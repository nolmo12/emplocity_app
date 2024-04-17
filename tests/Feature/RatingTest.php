<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Video;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class RatingTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function testLikingVideo(): void
    {
        $user = User::find(1);
        $video = Video::all()->first();
        $this->actingAs($user, 'api');
        $response = $this->post("/api/video/like/$video->reference_code", [
            'like_dislike' => true
        ]);

        $response->assertStatus(200);
    }

    public function testDislikingVideo(): void
    {
        $user = User::find(1);
        $video = Video::all()->first();
        $this->actingAs($user, 'api');
        $response = $this->post("/api/video/like/$video->reference_code", [
            'like_dislike' => false
        ]);

        $response->assertStatus(200);
    }

    public function testRemoveLike(): void
    {
        $user = User::find(1);
        $video = Video::all()->first();
        $this->actingAs($user, 'api');

        $this->post("/like/$video->reference_code", [
            'like_dislike' => true
        ]);

        $response = $this->post("/api/video/like/$video->reference_code", [
            'like_dislike' => true
        ]);

        $response->assertStatus(200);
    }
}
