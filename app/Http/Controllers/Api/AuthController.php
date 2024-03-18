<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Create User
     * @param Request $request
     * @return User 
     */
    public function register(Request $request)
    {
        try {
            //Validated
            $validateUser = Validator::make($request->all(), 
            [
                'email' => 'required|email|unique:users,email',
                'password' => 'required',
                'repeatPassword' => 'required|same:password'
            ]);
            error_log($validateUser->errors());

            if($validateUser->fails()){
                return response()->json([
                    'status' => false,
                    'message' => 'validation error',
                    'errors' => $validateUser->errors()
                ], 401);
            }

            $email = $request->email;
            $pos = strpos($email, '@');

            if ($pos !== false)
            {
                $name = substr($email, 0, $pos);
            }
            else
            {
                $name = $email;
            }

            $name = rtrim($name);

            $name .= rand(100, 9999);

            $user = User::create([
                'name' => $name,
                'email' => $request->email,
                'password' => Hash::make($request->password)
            ]);

            $token = Auth::attempt($request->only(['email', 'password']));

            return response()->json([
                'status' => 'success',
                'message' => 'User created successfully',
                'user' => $user,
                'authorisation' => [
                    'token' => $token,
                    'type' => 'bearer',
                ]
            ]);

        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Login The User
     * @param Request $request
     * @return User
     */
    public function login(Request $request)
    {
        try {
            $validateUser = Validator::make($request->all(), 
            [
                'email' => 'required|email',
                'password' => 'required'
            ]);

            //Custom http codes for validation errors
            //Starts at 46x
            //461 => email error
            //462 => password error

            if($validateUser->fails()){
                $errors = $validateUser->errors();
                $formattedErrors = [];
                foreach ($errors->all() as $error)
                {
                    $code = 0;
                    if(str_contains($error, 'email'))
                    {
                        $code = 461;
                    }
                    if(str_contains($error, 'password'))
                    {
                        $code = 462;
                    }

                    $formattedErrors[] = [
                        $code => $error
                    ];
                }
                return response()->json([
                    'status' => false,
                    'message' => 'validation error',
                    'errors' => $formattedErrors
                ], 401);
            }

            $token = Auth::attempt($request->only(['email', 'password']));

            if(!$token)
            {
                return response()->json([
                    'status' => false,
                    'message' => 'Email & Password does not match with our record.',
                ], 401);
            }

            $user = Auth::user();

            return response()
            ->json([
                'status' => 'success',
                'user' => $user,
                'authorisation' => [
                    'token' => $token,
                    'type' => 'bearer',
                ]
                ]);

        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage()
            ], 500);
        }
        
    }

    public function logout()
    {
        Auth::logout();
        return response()->json([
            'status' => 'success',
            'message' => 'Successfully logged out',
        ]);
    }

    public function refresh()
    {
        return response()->json([
            'status' => 'success',
            'user' => Auth::user(),
            'authorisation' => [
                'token' => Auth::refresh(),
                'type' => 'bearer',
            ]
        ]);
    }

    /**
     * Login The User
     * @param Request $request
     * @return RedirectResponse
     */
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);
 
        $status = Password::sendResetLink(
            $request->only('email')
        );
     
        return $status === Password::RESET_LINK_SENT
                    ? back()->with(['status' => __($status)])
                    : back()->withErrors(['email' => __($status)]);
    }
}