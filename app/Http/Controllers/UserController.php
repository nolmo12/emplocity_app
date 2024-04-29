<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Video;
use App\Models\VideoLikesDislike;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;
use App\Helpers\ValidateHelper;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;


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

    public function getLikes(Request $request, string $referenceCode)
    {
        $video = Video::where('reference_code', $referenceCode)->first();
    
        $likesDislikes = VideoLikesDislike::where('video_id', $video->id)
        ->where('user_id', $request->user()->id)
        ->get();

        return $likesDislikes;

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
}
