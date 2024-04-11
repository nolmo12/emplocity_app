<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Video;
use App\Models\VideoLikesDislike;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;

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
        ->first();

        if($likesDislikes)
        {
            return $likesDislikes->is_like ? 1 : 0;
        }
    }
}
