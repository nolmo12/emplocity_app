<?php

namespace App\Http\Controllers\Auth;


use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\VerifiesEmails;
use Illuminate\Auth\Events\Verified;

class VerificationController extends Controller
{
	/*
	|--------------------------------------------------------------------------
	| Email Verification Controller
	|--------------------------------------------------------------------------
	*/

	use VerifiesEmails {
		verify as parentVerify;
	}

	/**
	 * Where to redirect users after verification.
	 *
	 * @var string
	 */
	protected $redirectTo = '/';

	/**
	 * Create a new controller instance.
	 *
	 * @return void
	 */
	public function __construct()
	{
		$this->middleware('auth')->except('verify');
		$this->middleware('signed')->only('verify');
		$this->middleware('throttle:6,1')->only('verify', 'resend');
	}

	/**
	 * Mark the authenticated user's email address as verified.
	 *
	 * @param \Illuminate\Http\Request $request
	 *
	 * @return \Illuminate\Http\Response
	 *
	 * @throws \Illuminate\Auth\Access\AuthorizationException
	 */
	public function __invoke(Request $request)
{
    if ($request->user() && $request->user()->getKey() != $request->route('id')) {
        Auth::logout();
    }

    if (! $request->user()) {
        Auth::loginUsingId($request->route('id'), true);
    }

    $request->user()->markEmailAsVerified();

    event(new Verified($request->user()));

    return redirect($this->redirectPath())->with('verified', true);
}
}