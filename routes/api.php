<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\StorageController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;

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



Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:api');
    Route::post('/refresh', [AuthController::class, 'refresh'])->middleware('auth:api');
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])
    ->middleware('guest')
    ->name('password.email');
});

Route::get('storage/{type}/{asset}', [StorageController::class, 'find']);


Route::prefix('email')->group(function () {
    Route::get('/verify', function () {
        return view('auth.verify-email');
    })->middleware('auth')->name('verification.notice');
    
    Route::get('/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
        error_log("a");
        $request->fulfill();
    
        return redirect('');
    })->middleware(['auth'])->name('verification.verify');
    
    
    Route::post('/verification-notification', function (Request $request) {
        $request->user()->sendEmailVerificationNotification();
     
        return back()->with('message', 'Verification link sent!');
    })->middleware(['auth', 'throttle:6,1'])->name('verification.send');
});