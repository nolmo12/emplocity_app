<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Video;
use Illuminate\Auth\Access\Response;
use Illuminate\Support\Facades\Auth;

class VideoPolicy
{

    public function before(User $user, string $ability) : bool|null
    {
        if($user->hasRole('admin'))
            return true;
        return null;
    }

    /**
     * Determine whether the user can view any models.
     */
    // public function viewAny(User $user): bool
    // {
    //     //
    // }

    /**
     * Determine whether the user can view the model.
     */
    public function view(?User $user, Video $video): Response
    {
        $user = Auth::user();
        
        if ($video->visibility === 'Hidden')
        {

            if (!$user)
            {
                return Response::deny("You are not authenticated.");
            }

            return $video->user->id === $user->id
            ? Response::allow()
            : Response::deny('You are not allowed to watch the video');
        }
        return Response::allow();
    }

    /**
     * Determine whether the user can create models.
     */
    // public function create(User $user): bool
    // {
    //     //
    // }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Video $video): Response
    {
        return $video->user->id === $user->id 
                            ? Response::allow()
                            : Response::deny('You do not own the video');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Video $video): Response
    {
        return $video->user->id === $user->id 
                            ? Response::allow()
                            : Response::deny('You do not own the video');
    }

    /**
     * Determine whether the user can restore the model.
     */
    // public function restore(User $user, Video $video): bool
    // {
    //     //
    // }

    /**
     * Determine whether the user can permanently delete the model.
     */
    // public function forceDelete(User $user, Video $video): bool
    // {
    //     //
    // }
}
