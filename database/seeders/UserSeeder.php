<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::create([
        'name' => 'admin',
        'first_name' => 'admin',
        'email' => 'pawelo320@wp.pl',
        'password' => Hash::make('admin'),
        ]);

        $admin->email_verified_at = date('Y-m-d H:i:s');
        $admin->save();

        $admin->assignRole('admin');
    }
}
