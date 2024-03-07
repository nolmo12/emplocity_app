<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function show()
    {
        return User::all();
    }

    public function tokens($id)
    {
        $user = User::find($id);
        return $user->tokens;
    }
}
