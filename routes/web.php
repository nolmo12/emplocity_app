<?php

use Illuminate\Http\Request;
use Laravel\Fortify\Fortify;
use Illuminate\Support\Facades\Route;
use App\Actions\Fortify\CreateNewUser;
use App\Http\Controllers\UserController;
use Laravel\Fortify\Contracts\CreatesNewUsers;
use Laravel\Fortify\Http\Controllers\RegisteredUserController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/{path?}', function () {
    return view('welcome');
})
->where('path', '^(?!account|account-settings|history/[^/]+$|user-likes/[^/]+$|shop|login).*$');

Route::get('/account', function () {
    return view('welcome');
})->middleware('auth:api');

Route::get('/account-settings', function () {
    return view('welcome');
})->middleware('auth:api');

Route::get('/history/{id}', function () {
    return view('welcome');
})->middleware('auth:api');

Route::get('/user-likes/{id}', function () {
    return view('welcome');
})->middleware('auth:api');

Route::get('/shop', function () {
    return view('welcome');
})->middleware('auth:api');

Route::get('/login', function () {
    return view('welcome');
})->middleware('guest');



