<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;

class UserPolicy
{
    public function update(User $user, User $model)
    {
        return $user->id === $model->id
            ? Response::allow()
            : Response::deny('You do not own this user.');
    }

    public function delete(User $user, User $model)
    {
        return $user->id === $model->id
            ? Response::allow()
            : Response::deny('You do not own this user.');
    }
}
