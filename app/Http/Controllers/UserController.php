<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Video;
use App\Models\VideoLikesDislike;
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
    public function delete()
    {
        $user = Auth::user();

        if ($user) 
        {
            User::where('id', $user->id)->delete();
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
    public function update(Request $request)
    {
        $request->user();

        try{
            // Validate the request data
        $validateUser = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'email' => 'email|unique:users,email,'. $request->user()->id,
            'password' => 'string',
            'repeatPassword' => 'same:password'
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

        $user = User::findOrFail($request->user()->id);

        if ($request->filled('email')) {
            $user->email = $request->email;
            // user registered event
            $user->email_verified_at = null;
            event(new Registered($user));
        }
        if ($request->filled('name')) {
            $user->name = $request->name;
        }
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
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
    public function read(Request $request)
{
    try {
        $user = User::with('videos')->findOrFail($request->user()->id);

        $userData = [
            'name' => $user->name,
            'email' => $user->email,
        ];
        $videosData = [];
        foreach ($user->videos as $video) {
            $videosData[] = [
                'title' => $video->title,
                'date' => $video->created_at->format('Y-m-d'),
                'views' => $video->views,
                // 'comments' => $video
                'likes' => $video->getLikesDislikesCount(true),
            ];
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
