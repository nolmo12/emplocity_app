<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Helpers\ValidateHelper;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
/**
 * AuthController class which controlls everything related to authentication.
 */
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

            if($validateUser->fails())
            {
                $errors = $validateUser->errors();
                $formattedErrors = ValidateHelper::getAllAuthErrorCodes($errors);


                return response()->json([
                    'status' => false,
                    'message' => 'validation error',
                    'errors' => $formattedErrors
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

            $name .= rand(1, 9999);

            $user = User::create([
                'name' => $name,
                'first_name' => $name,
                'email' => $request->email,
                'password' => Hash::make($request->password)
            ]);
            // user registered event
            event(new Registered($user));

            return response()->json([
                'status' => 'success',
                'message' => 'User created successfully',
                'user' => $user,
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

            if($validateUser->fails())
            {
                $errors = $validateUser->errors();
                $formattedErrors = ValidateHelper::getAllAuthErrorCodes($errors);


                return response()->json([
                    'status' => false,
                    'message' => 'validation error',
                    'errors' => $formattedErrors
                ], 401);
            }

            $token = Auth::attempt($request->only(['email', 'password']));
            $user = Auth::user();
            
            $refreshToken = JWTAuth::fromUser($user, ['exp' => now()->addDays(30)->timestamp]);

            if(!$token)
            {
                return response()->json([
                    'status' => false,
                    'message' => 'Email & Password does not match with our record.',
                ], 401);
            }
            
            if (!Auth::user()->email_verified_at)
            {
                return response()->json([
                    'status' => false,
                    'message' => 'Your email is not verified. Please verify your email before logging in.',
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
        $currentToken = Auth::getToken();
        if(!$currentToken)
        {
            return response()->json(['status' => 'error', 'message' => 'Token not provided'], 400);
        }

        $user = Auth::user();
        
        $newToken = Auth::refresh($currentToken);

        return response()->json([
            'status' => 'success',
            'user' => $user,
            'authorisation' => [
                'token' => $newToken,
                'type' => 'bearer',
            ]
        ]);
    }

    /**
     * Send forgot password email
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