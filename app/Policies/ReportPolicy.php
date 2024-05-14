<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Report;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Auth\Access\Response;

class ReportPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can create a report.
     *
     * @param  \App\Models\User  $user
     * @return bool
     */
    public function create(User $user)
    {
        // Check if the user is logged in
        return $user !== null
            ? Response::allow()
            : Response::deny('You must be logged in to create a report.');
    }

    public function delete(User $user, Report $report)
    {
        return $user->hasRole('admin')
            ? Response::allow()
            : Response::deny('You do not have permission to delete reports.');
    }
}
