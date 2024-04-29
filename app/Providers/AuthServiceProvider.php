<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;
use App\Models\User;
use App\Models\Video;
use App\Models\Comment;
use App\Policies\VideoPolicy;
use App\Policies\CommentPolicy;
use App\Policies\UserPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */

     protected $policies = [
        Video::class => VideoPolicy::class,
        Comment::class => CommentPolicy::class,
        User::class => UserPolicy::class,
    ];
    public function boot(): void
    {
        $this->registerPolicies();
        ResetPassword::createUrlUsing(function (User $user, string $token) {
            return 'http://127.0.0.1:8000/reset-password?token='.$token.'&email='.$user->email;
        });
    }
}
