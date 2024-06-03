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
    // use RefreshDatabase;
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

    public function testCommentShow(): void
    {
        $user = User::first();
        $video = Video::first();
        $this->actingAs($user, 'api');

        $postResponse = $this->post('/api/video/comment', [
            'reference_code' => $video->reference_code,
            'content' =>'Mega fajny opis',
        ]);

        $postResponse->assertStatus(200);

        error_log($video->reference_code);
        $getResponse = $this->getJson('/api/video/comments?reference_code=' . $video->reference_code . '&offset=1');

        // Assert the comments are retrieved correctly
        $getResponse->assertStatus(200)
                     ->assertJsonStructure([
                         'comments' => [
                             '*' => [
                                 'id',
                                 'content',
                                 'user_name',
                                 'user_first_name',
                                 'user_avatar',
                                 'current_border',
                                 'children_count',
                                 'children'
                             ]
                         ]
                     ]);
 
        
        $comments = $getResponse->json('comments');
        $this->assertEquals('Mega fajny opis', $comments[0]['content']);
        $this->assertEquals($user->name, $comments[0]['user_name']);
        $this->assertEquals($user->first_name, $comments[0]['user_first_name']);
    }


}
