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
            $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
            $host = $_SERVER['HTTP_HOST'];
            return $protocol . '://' . $host . '/reset-password?token=' . $token . '&email=' . urlencode($user->email);
        });
    }
}
