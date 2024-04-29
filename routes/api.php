<?php

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Password;
use App\Http\Controllers\VideoController;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\StorageController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Middleware\EnsureUserOwnsModel;
use App\Http\Controllers\Auth\VerificationController;
use App\Http\Controllers\HistoryController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('users', [UserController::class, 'getUsersData']);
Route::get('user/{id}', [UserController::class, 'getUserData']);

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:api');
    Route::post('/refresh', [AuthController::class, 'refresh'])->middleware('auth:api');
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])
    ->middleware('guest')
    ->name('password.email');
    Route::get('/user-data', [UserController::class, 'getUserData']);
    Route::delete('/delete/{id}', [UserController::class, 'delete']);
    Route::patch('/update/{id}', [UserController::class, 'update']);
    Route::get('/read/{id}', [UserController::class, 'read']);
    Route::get('/likedVideos', [UserController::class, 'getLikes'])->middleware('auth:api');

});

Route::get('storage/{type}/{asset}', [StorageController::class, 'find']);

//Move this to controllers some time into the future
//EMAIL VERIFICATION
Route::prefix('email')->group(function () {
    Route::get('/verify/{id}/{hash}', [VerificationController::class, 'verify'])
        ->name('verification.verify');
    
    Route::post('/verification-notification', function (Request $request) {
        $request->user()->sendEmailVerificationNotification();
     
        return back()->with('message', 'Verification link sent!');
    })->middleware(['auth', 'throttle:6,1'])->name('verification.send');
});

//Password recovery
Route::post('/forgot-password', function (Request $request) {
    $request->validate(['email' => 'required|email']);
 
    $status = Password::sendResetLink(
        $request->only('email')
    );
 
    return $status === Password::RESET_LINK_SENT
                ? back()->with(['status' => __($status)])
                : back()->withErrors(['email' => __($status)]);
})->middleware('guest')->name('password.email');


Route::post('/reset-password', function (Request $request) {
    $validateData = Validator::make($request->all(), [
        'token' => 'required',
        'email' => 'required|email',
        'password' => 'required|min:8',
        'repeatPassword' => 'required|same:password'
    ]);

    if($validateData->fails())
    {
        return response()->json([
            'status' => false,
            'message' => 'validation error'
        ], 401);
    }
 
    $status = Password::reset(
        $request->only('email', 'password', 'password_confirmation', 'token'),
        function (User $user, string $password) {
            $user->forceFill([
                'password' => Hash::make($password)
            ])->setRememberToken(Str::random(60));
 
            $user->save();
 
            event(new PasswordReset($user));
        }
    );
 
    return $status === Password::PASSWORD_RESET
                ? redirect('http://localhost/login')->with('status', __($status))
                : back()->withErrors(['email' => [__($status)]]);
})->middleware('guest')->name('password.update');

Route::prefix('video')->group(function () {
    
    Route::get('/watch/{referenceCode}', [VideoController::class,'show'])
    ->name('watch');

    Route::get('/search', [VideoController::class,'search']);

    Route::get('/all', [VideoController::class,'all']);

    Route::get('/similarVideos/{referenceCode}', [VideoController::class,'getSimilarVideos'])
    ->name('similarVideos');

    Route::get('/hasUserLiked/{referenceCode}', [UserController::class, 'hasUserLikedVideo'])
    ->middleware('auth:api');

    Route::delete('/delete', [VideoController::class, 'delete'])
    ->middleware('auth:api');

    Route::post('/upload', [VideoController::class, 'store']);

    Route::post('/like/{referenceCode}', [VideoController::class,'updateLikes'])
    ->middleware('auth:api')    ->name('updateLikes');

    Route::patch('/update', [VideoController::class,'update'])
    ->middleware('auth:api');

    Route::post('/comment', [CommentController::class, 'store'])
    ->middleware('auth:api');

    Route::get('/comments', [CommentController::class, 'show']);

});

Route::prefix('history')->group(function () {
    Route::post('/{referenceCode}', [HistoryController::class,'createOrUpdate']);
    Route::get('/read', [HistoryController::class,'read']);

});
