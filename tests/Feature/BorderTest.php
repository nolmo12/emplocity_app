<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;

class BorderTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function testGetAllBorders(): void
    {   
        $user = User::first();
        $this->actingAs($user, 'api');
        $response = $this->get('/api/auth/borders');

        $response->assertStatus(200)
             ->assertJsonStructure([
                 'success',
                 'borders',
             ]);
    }
}
