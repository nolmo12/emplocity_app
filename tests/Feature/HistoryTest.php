<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Video;
use App\Models\History;


class HistoryTest extends TestCase
{
    // use RefreshDatabase;

    public function testCreateHistory()
    {
        $user = User::first();
        $video = Video::first();

        $response = $this->actingAs($user, 'api')->postJson('/api/history/' . $video->reference_code);
        
        $response->assertStatus(200)
                 ->assertJson(['message' => 'History updated successfully']);
    }

    public function testCreateOrUpdateHistoryNotFound()
    {
        $user = User::first();
        $video = Video::first();

        $response = $this->actingAs($user, 'api')->postJson('/api/history/invalid');

        $response->assertStatus(404)
                 ->assertJson(['error' => 'Video not found']);
    }

    public function testReadHistory()
    {
        $user = User::first();
    
        $response = $this->actingAs($user, 'api')->getJson('/api/history/read');
    
        $response->assertJsonStructure([
            '*' => [
                'video',
                'title',
                'description',
                'commentCount',
                'userId',
                'userName',
                'userFirstName',
                'userAvatar',
                'userBorder',
                'likesCount',
                'dislikesCount',
            ]
        ]);
    }
}
