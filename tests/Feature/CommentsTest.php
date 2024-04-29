<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Video;
use Illuminate\Http\UploadedFile;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CommentsTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function testCommentPost(): void
    {    
        $user = User::first();
        $video = Video::first();
        $this->actingAs($user, 'api');

        $response = $this->post('/api/video/comment', [
            'reference_code' => $video->reference_code,
            'content' =>'Mega fajny opis',
         ]);

        $response->assertStatus(200);

        $video = Video::find($response->json('id'));
    }

    public function testCommentDeletion(): void
    {
        $user = User::first();
        $this->testCommentPost();
        $comment = $user->comments()->first();

        $this->actingAs($user, 'api');

        $response = $this->delete('/api/video/comment/delete', [
            'comment' => $comment->id,
         ]);

        $response->assertStatus(200);
    }

    public function testCommentUpdate(): void
    {
        $user = User::first();
        $this->testCommentPost();
        $comment = $user->comments()->first();

        $this->actingAs($user, 'api');

        $response = $this->patch('/api/video/comment/update', [
            'comment' => $comment->id,
            'content' => 'NOWY KOMENTARZ WOOHOO'
         ]);

        $response->assertStatus(200);
    }
}
