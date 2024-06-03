<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Video;
use App\Models\Comment;

class ReportTest extends TestCase
{
    public function testUserReport(): void
    {
        $user = User::first();
        $data = [
            'description' => 'Test report',
            'id' => $user->id,
        ];
    
        $response = $this->actingAs($user, 'api')->postJson('/api/report/user', $data);
    
        $response->assertStatus(200)
                 ->assertJson([
                     'status' => true,
                     'message' => 'Report created successfully'
                 ]);
    }

    public function testVideoReport()
    {
        $user = User::first();
        $video = Video::first();

        $data = [
            'description' => 'Test video report',
        ];

        $response = $this->actingAs($user, 'api')->postJson("/api/report/video/{$video->reference_code}", $data);

        $response->assertStatus(200)
                ->assertJson([
                    'status' => true,
                    'message' => 'Report created successfully'
                ]);
    }

    public function testCommentReport()
    {
        $user = User::first();
        $comment = Comment::first();

        $data = [
            'description' => 'Test comment report',
            'id' => $comment->id,
        ];

        $response = $this->actingAs($user, 'api')->postJson('/api/report/comment', $data);

        $response->assertStatus(200)
                ->assertJson([
                    'status' => true,
                    'message' => 'Report created successfully'
                ]);
    }
}
