<?php

namespace App\Http\Controllers;

use DateTime;
use App\Models\User;
use App\Models\Video;

use App\Models\Comment;

use Illuminate\Http\Request;
use App\Helpers\ValidateHelper;
use App\Models\VideoLikesDislike;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;
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
    public function delete(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $this->authorize('delete', $user);
        if ($user) 
        {
            User::where('id', $id)->delete();
            Auth::logout();
            return redirect('/');
        }
        return redirect('/login');
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
            'name' => 'string|max:255',
            'password' => 'string',
            'repeatPassword' => 'same:password',
            'thumbnail' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
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
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }
        if ($request->hasFile('thumbnail')) {
            $thumbnailName = $user->id . '_' . time() . '.' . $request->file('thumbnail')->getClientOriginalExtension();
            $thumbnailPath = $request->file('thumbnail')->storeAs('public/avatars', $thumbnailName);
            $relativePath = str_replace(public_path(), '/', $thumbnailPath);
            $user->avatar = $relativePath;
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
    try {
        if ($request->user()->id == $id) {
            $user = User::with('videos')->findOrFail($id);
        } else {
            $user = User::with(['videos' => function ($query) {
                $query->where('visibility', 'Public');
            }])->findOrFail($id);
        }

        $userData = [
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
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'User not found',
        ], 404);
    }
    }

    public function listing()
    {    
        $limit = 10;

        $twentyFourHoursAgo = new DateTime('-24 hours');

        $users = User::with(['videos' => function ($query) use ($twentyFourHoursAgo) {
            $query->where('created_at', '<=', $twentyFourHoursAgo->format('Y-m-d H:i:s'))
                  ->where('visibility', 'public');
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

                $likeToDisLikeRatio = $video->$likes / max(1, $likes + $dislikes);

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
                $topUsersDetails->push($user);
            }
        }

        return $topUsersDetails;

    }

}
