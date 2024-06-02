<?php

namespace App\Http\Controllers;

use DateTime;
use Exception;
use App\Models\User;

use App\Models\Video;

use App\Models\Border;
use App\Models\Comment;
use Illuminate\Http\Request;
use App\Helpers\ValidateHelper;
use App\Models\VideoLikesDislike;
use App\Helpers\FileRequestManager;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function show()
    {
        return User::all();
    }
    public function find($id)
    {
        return User::find($id);
    }

    public function getUsersData()
    {
        return User::all();
    }

    public function getUserData($id)
    {
        $userData = User::with(['likesDislikes'])->findOrFail($id);
        $userData->makeHidden(['email']);

        return $userData;
    }

    public function getLikes(Request $request)
    {
        $likes = $request->user()->likesDislikes()->where('is_like', true)->get();
        
        $videos = [];

        foreach($likes as $like)
        {
            $video = Video::find($like->video_id);
            $videos[] = $video->stats();
        }

        return $videos;
    }

    public function hasUserLikedVideo(Request $request, string $referenceCode)
    {
        $video = Video::where('reference_code', $referenceCode)->first();
        $likesDislikes = VideoLikesDislike::where('user_id', $request->user()->id)
        ->where('video_id', $video->id)
        ->first();

        if($likesDislikes)
        {
            return $likesDislikes->is_like ? 1 : 0;
        }
    }
    public function delete(Request $request)
    {
        $user = User::find($request->user_id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $this->authorize('delete', $user);

        $user->permissions()->detach();

        $user->roles()->detach();

        $user->histories()->delete();

        $avatarPath = public_path($user->avatar);
        if($user->avatar != '/storage/avatars/ico.png')
            if(File::exists($avatarPath))
                File::delete($avatarPath);

        $videos = $user->videos;
        foreach ($videos as $video) {

            $video->tags()->detach();

            $video->histories()->delete();

            $video->languages()->detach();

            $video->likesDislikes()->delete();

            $video->comments()->delete();

            $video->views()->delete();

            $videoPath = public_path($video->video);
            $thumbnailPath = public_path($video->thumbnail);

            $video->delete();

            if(File::exists($videoPath))
                File::delete($videoPath);
            else
                return response()->json(['error' => 'Video path not found'], 404);

            if(File::exists($thumbnailPath))
                File::delete($thumbnailPath);
            else
                return response()->json(['error' => 'Thumbnail path not found'], 404);
        }

        $user->comments()->delete();

        $user->likesDislikes()->delete();

        $user->delete();
        Auth::logout();

        return response()->json(['success' => 'Successfully deleted user'], 200);
    }

    /**
 * Update User
 * @param Request $request
 * @return User
 */
public function update(Request $request, $id)
{

    try{
        // Validate the request data
    $validateUser = Validator::make($request->all(), [
        'name' => 'string|max:255|regex:/^[a-zA-Z0-9\s]+$/u',
        'currentPassword' => 'string',
        'password' => 'string|required_with:current_password',
        'repeatPassword' => 'string|required_with:password',
        'thumbnail' => 'file|mimetypes:image/jpeg,image/png',
    ]);

    if ($validateUser->fails()) {
        $errors = $validateUser->errors();
        $formattedErrors = ValidateHelper::getAllAuthErrorCodes($errors);

        return response()->json([
            'status' => false,
            'message' => 'Validation error',
            'errors' => $formattedErrors,
        ], 401);
    }

    $user = User::findOrFail($id);
    $this->authorize('update', $user);

    if ($request->filled('name')) {
        $user->name = $request->name;
    }
    if ($request->filled('password') && $request->filled('currentPassword')) {
        if (!Hash::check($request->currentPassword, $user->password)) {
            return response()->json([
                'status' => false,
                'message' => 'Current password is incorrect',
            ], 401);
        }
        if ($request->password != $request->repeatPassword) {
            return response()->json([
                'status' => false,
                'message' => 'Passwords do not match',
            ], 401);
        }
        if ($request->password == $request->currentPassword) {
            return response()->json([
                'status' => false,
                'message' => 'New password cannot be the same as the current password',
            ], 401);
        }
        $user->password = Hash::make($request->password);
    }

    if ($request->hasFile('thumbnail')) {
        $fileManager = new FileRequestManager($request, 'thumbnail');
        $path = $fileManager->save('public/avatars');
        $fileManager->move('storage/avatars');

        $publicPath = Storage::url($path);
        Storage::delete($path);
        
        $user->avatar = $publicPath;
    }

    $user->save();

    return response()->json([
        'status' => 'success',
        'message' => 'User updated successfully',
        'user' => $user,
    ]);

    } catch (\Throwable $th) {
        return response()->json([
            'status' => false,
            'message' => $th->getMessage()
        ], 500);
    }
}
    public function read(Request $request, $id)
    {
        if($request->user() && $request->user()->id == $id)
        {
            $user = User::with('videos')->findOrFail($id);
        }
        else
        {
            $user = User::with(['videos' => function ($query){
                $query->where('visibility', 'Public');
            }])->findOrFail($id);
        }
            
        $userData = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
        ];
        $videosData = [];
        foreach ($user->videos as $video) {
            $videoStats = $video->stats();
            $commentsCount = Comment::where('video_id', $video->id)->count();
            $videoStats['comments'] = $commentsCount;
            unset($videoStats['tags']);
            $videosData[] = $videoStats;
        }
        return response()->json([
            'status' => 'success',
             'user' => $userData,
            'videos' => $videosData,
        ]);
    }

    public function listing()
    {    
        $limit = 10;


        $users = User::with(['videos' => function ($query)
        {
            $query->where('visibility', 'Public');
        }])->get();

        $userScores = [];

        foreach ($users as $user)
        {
            $totalScore = 0;
            foreach ($user->videos as $video)
            {
                $likes = $video->getLikesDislikesCount(true);
                $dislikes = $video->getLikesDislikesCount(false);

                if($likes + $dislikes == 0 || $video->views == 0)
                    continue;

                $likeToDisLikeRatio = $likes / max(1, $likes + $dislikes);

                if($likeToDisLikeRatio > 0.5)
                    $videoScore  = $video->views * $likeToDisLikeRatio;
                else
                    $videoScore = 0;

                $totalScore += $videoScore;
            }
            $userScores[$user->id] = $totalScore;
        }

        arsort($userScores);

        $topUsers = array_slice($userScores, 0, $limit, true);

        $sortedKeys = array_keys($topUsers);

        $topUsersDetails = collect();
        foreach ($sortedKeys as $key)
        {
            $user = User::find($key);
            if ($user) 
            {
                $currentBorder = $user->currentBorder();
                unset($currentBorder['pivot']);
                $user['current_border'] = $currentBorder;
                $topUsersDetails->push($user);
            }
        }

        return $topUsersDetails;

    }

    public function grantAdmin(Request $request)
    {
        $user = User::findOrFail($request->user_id);
        $this->authorize('update', $user);
        error_log('you have an admin wow:o');
    }

    public function showCurrentBorder($userId)
    {
        $user = User::findOrFail($userId);
        $currentBorder = $user->currentBorder();

        if ($currentBorder)
        {
            return response()->json([
                'message' => 'Current Border found',
                'current_border' => $currentBorder
            ]);
        } 
        else 
        {
            return response()->json(['message' => 'No borders found for this user']);
        }
    }
    public function changeCurrentBorder(Request $request)
    {
        $user = $request->user();

        $existingBorders = $user->borders()->get();

        if ($existingBorders->contains(Border::findOrFail($request->borderId)))
        {
            $user->borders()->updateExistingPivot($request->borderId, ['updated_at' => now()], false);
            $border = $user->currentBorder();
            unset($border['pivot']);
            return response()->json([
                'border' => $border,
                'message' => 'Current border updated successfully'
            ]);
        }
        return response()->json(['message' => 'You dont own that border or there was an error updating']);   
    }

    public function getFollowers(Request $request)
    {
        $user = $request->user();
        $followers = $user->followers;
        foreach($followers as &$follower)
        {
            unset($follower['pivot']);
            $border = $follower->currentBorder();
            unset($border['pivot']);
        }
        return $followers;
    }

    public function follow(Request $request)
    {
        $validateUser = Validator::make($request->all(), [
            'creator_id' => 'required|exists:users,id',
        ]);
    
        if ($validateUser->fails()) {
            $errors = $validateUser->errors();
    
            return response()->json([
                'status' => false,
                'message' => 'Validation error',
                'errors' => $errors,
            ], 401);
        }

        $user = $request->user();

        $creatorId = $request->creator_id;
        if ($user->id != $creatorId) 
        {

                if ($user->creators()->where('creator_id', $creatorId)->exists()) 
                {
                    return response()->json([
                        'status' => false,
                        'message' => 'You are already following this creator.',
                    ], 400);
                }

                $user->creators()->attach($creatorId);

                $user->creators()->updateExistingPivot($creatorId, ['updated_at' => now(), 'created_at' => now()], false);
            
                return response()->json([
                    'status' => true,
                    'message' => 'Successfully followed the creator.',
                ], 200);
        }
        return response()->json([
            'status' => false,
            'message' => 'You cannot follow yourself!.',
        ], 400);

    }

    public function unfollow(Request $request)
    {
        $validateUser = Validator::make($request->all(), [
            'creator_id' => 'required|exists:users,id',
        ]);
    
        if ($validateUser->fails()) {
            $errors = $validateUser->errors();
    
            return response()->json([
                'status' => false,
                'message' => 'Validation error',
                'errors' => $errors,
            ], 401);
        }

        $user = $request->user();
        $creatorId = $request->creator_id;
    
        if (!$user->creators()->find($creatorId))
        {
            return response()->json([
                'status' => false,
                'message' => 'You are not following this creator.',
            ], 400);
        }

        $user->creators()->detach($creatorId);

        return response()->json([
            'status' => true,
            'message' => 'Successfully unfollowed the creator.',
        ], 200);
    }

    public function hasFollowed(Request $request, int $userId)
    {
        try {
            $user = $request->user();
        
            if($user)
            {
                if ($user->creators()->where('creator_id', $userId)->exists()) 
                {
                    return response()->json([
                        'is_following' => true,
                    ], 200);
                }
    
                return response()->json([
                    'is_following' => false,
                ], 200);
    
            }
    
            return response()->json([
                'is_following' => false,
            ], 200);
        }
        catch (Exception $e)
        {
            return response()->json([
                'status' => false,
            ], 400);
        }

    }

    public function getCreators(Request $request)
    {
        $user = $request->user();
        $creators = $user->creators;

        foreach($creators as &$creator)
        {
            unset($creator['pivot']);
            $border = $creator->currentBorder();
            unset($border['pivot']);
            $creator['current_border'] = $border;
        }

        return $creators;
    }

}
