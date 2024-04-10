<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Support\Facades\Auth;

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
}
