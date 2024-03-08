<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;

class UserController extends Controller
{
    public function show()
    {
        return User::all();
    }

    public function tokens($id)
    {
        $user = $this->find($id);
        return $user->tokens;
    }

    public function find($id)
    {
        return User::find($id);
    }
}
