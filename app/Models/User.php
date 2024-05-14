<?php

namespace App\Models;

use Exception;

use App\Helpers\SearchInterface;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Models\Permission;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends Authenticatable implements JWTSubject, MustVerifyEmail, SearchInterface
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'first_name',
        'avatar',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'email',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'two_factor_confirmed_at',
        'email_verified_at',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function videos(): HasMany
    {
        return $this->hasMany(Video::class);
    }

    // Relationship with VideoLikeDislike
    public function likesDislikes()
    {
        return $this->hasMany(VideoLikesDislike::class, 'user_id');
    }

    public function reports()
    {
        return $this->morphMany(Report::class, 'reportable');
    }

    public function status()
    {
        return $this->hasOne('App\Models\User', 'status');
    }

    public function comments() : HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function histories() : HasMany
    {
        return $this->hasMany(History::class);
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function calculateSearchScore(array $searchQueryArray) : float
    {

        $name = $this->name;
        $firstName = $this->first_name;

        similar_text(strtolower($name), strtolower(implode(' ', $searchQueryArray)), $nameSimilarity);
        similar_text(strtolower($firstName), strtolower(implode(' ', $searchQueryArray)), $firstNameSimilarity);

        $score = 3 * ($nameSimilarity / 100);

        $score += 7 * ($firstNameSimilarity / 100);

        return $score;
    }

    public function calculateListingScore() : float
    {
        throw new Exception("method2 is not supported");
    }


        /**
     * Return a key-value array that will be serialized as the claims of the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    public function roles()
    {
        return $this->morphToMany(Role::class, 'model', 'model_has_roles', 'model_id', 'role_id');
    }

    public function permissions()
    {
        return $this->morphToMany(Permission::class, 'model', 'model_has_permissions', 'model_id', 'permission_id');
    }

    public function report()
    {
        return $this->morphToMany(Report::class, 'reportable');
    }

    public function borders(): BelongsToMany
    {
        return $this->belongsToMany(Border::class);
    }

}
