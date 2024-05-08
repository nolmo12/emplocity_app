<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class RoleSeeder extends Seeder
{
    public function run()
    {
        $adminRole = Role::create(['name' => 'admin']);
        $userRole = Role::create(['name' => 'user']);
        $moderatorRole = Role::create(['name' => 'moderator']);

        $moderatorRole->givePermissionTo([
            'view videos',
            'create videos',
            'edit videos',
            'delete videos',
            'view comments',
            'create comments',
            'edit comments',
            'delete comments'
        ]);
        $adminRole->givePermissionTo([
            'view videos',
            'create videos',
            'edit videos',
            'delete videos',
            'view comments',
            'create comments',
            'edit comments',
            'delete comments',
            'view users',
            'create users',
            'edit users',
            'delete users',
        ]);
    }
}
