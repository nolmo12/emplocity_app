<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;


class AuthTest extends TestCase
{
    public function testRegisterCorrect(): void
    {
        $response = $this->post('/api/auth/register', [
            'email' => fake()->unique()->email(),
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
            'repeatPassword' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
         ]);

        $response->assertStatus(200);
    }

    public function testRegisterFailEmail(): void
    {
        $response = $this->post('/api/auth/register', [
            'email' => fake()->name(),
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
            'repeatPassword' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
         ]);

        $response->assertStatus(401);
    }

    public function testRegisterFailPassword(): void
    {
        $response = $this->post('/api/auth/register', [
            'email' => fake()->unique()->email(),
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
            'repeatPassword' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKi'
         ]);

        $response->assertStatus(401);
    }

    public function testLoginCorrect(): void
    {
        $email = fake()->unique()->email();
        $this->post('/api/auth/register', [
            'email' => $email,
            'password' => 'password123',
            'repeatPassword' => 'password123'
        ]);
        
        $response = $this->post('/api/auth/login', [
            'email' => $email,
            'password' => 'password123',
         ]);

        

        $response->assertStatus(200)
        ->assertJsonStructure([
            'status',
            'user',
            'authorisation' => [
                'token',
                'type',
            ]
        ])
        ->assertJson([
            'status' => 'success',
            'authorisation' => [
                'type' => 'bearer',
                'token' => true
            ]
        ]);

        $token = $response->json('authorisation.token');
        $this->assertNotEmpty($token);
    }

    public function testLoginIncorrect(): void
    {
        $email = fake()->unique()->email();
        $this->post('/api/auth/register', [
            'email' => $email,
            'password' => 'password123',
            'repeatPassword' => 'password123'
        ]);

        $response = $this->post('/api/auth/login', [
            'email' => $email,
            'password' => 'password13',
         ]);

        $response->assertStatus(401)
        ->assertJsonStructure([
            'status',
            'message',
            ])
        ->assertJson([
            'status' => false,
            'message' => "Email & Password does not match with our record.",
            
        ]);
    }

    public function testLogout()
    {
        $email = fake()->unique()->email();
    
        $this->post('/api/auth/register', [
            'email' => $email,
            'password' => 'password123',
            'repeatPassword' => 'password123'
        ]);
    
        $response = $this->post('/api/auth/login', [
            'email' => $email,
            'password' => 'password123',
        ]);
    
        $token = $response->json('authorisation.token');
    
        $this->assertNotEmpty($token);
    
        $logoutResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
                              ->post('/api/auth/logout');
    
        $logoutResponse->assertStatus(200);
    }
    
}
