<?php

namespace App\Policies;

use App\Models\Comment;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CommentPolicy
{
    public function before(User $user, string $ability) : bool|null
    {
        if($user->hasRole('admin') || $user->hasRole('moderator'))
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
    // public function view(User $user, Comment $comment): bool
    // {
    //     //
    // }

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
    public function update(User $user, Comment $comment): Response
    {
        return $comment->user->id === $user->id 
            ? Response::allow()
            : Response::deny('You do not own the comment');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Comment $comment): Response
    {
        return $comment->user->id === $user->id || $comment->video->user_id === $user->id
            ? Response::allow()
            : Response::deny('You do not own the comment');
    }

    /**
     * Determine whether the user can restore the model.
     */
    // public function restore(User $user, Comment $comment): bool
    // {
    //     //
    // }

    // /**
    //  * Determine whether the user can permanently delete the model.
    //  */
    // public function forceDelete(User $user, Comment $comment): bool
    // {
    //     //
    // }
}
