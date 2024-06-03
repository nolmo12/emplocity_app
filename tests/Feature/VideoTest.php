<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Video;
use Illuminate\Http\UploadedFile;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class VideoTest extends TestCase
{
    // use RefreshDatabase;
    /**
     * A basic feature test example.
     */
    public function testVideoUpload(): void
    {
        $user = User::find(1);
        $this->actingAs($user, 'api');

        $response = $this->post('/api/video/upload', [
            'title' => 'Sznycowy film',
            'description' =>'Mega fajny opis',
            'thumbnail' => UploadedFile::fake()->image('thumbnail.jpg'),
            'language' => 1,
            'visibility' => 'Public',
            'video' => UploadedFile::fake()->create('video.mp4', 100, 'video/mp4'),
            'tags' => ['tag1', 'tag2', 'tag3'],
         ]);

        $response->assertStatus(201);

        $video = Video::find($response->json('id'));

        $this->assertUploadedFileExists($video->thumbnail);
        $this->assertUploadedFileExists($video->video);
    }

    // public function testVideoDeletion(): void
    // {
    //     $user = User::find(1);
    //     $this->actingAs($user, 'api');

    //     $this->testVideoUpload();

    //     $video = $user->videos()->first();

    //     $response = $this->delete('/api/video/delete',[
    //         'reference_code' => $video->reference_code
    //     ]);

    //     $response->assertStatus(200);
    // }

    // public function testVideoEdition(): void
    // {
    //     $user = User::find(1);
    //     $this->actingAs($user, 'api');

    //     $this->testVideoUpload();

    //     $video = $user->videos()->first();

    //     $response = $this->post('/api/video/update',[
    //         'reference_code' => $video->reference_code,
    //         'title' => 'Bivowy film',
    //         'description' =>'Mega nie fajny opis',
    //         'thumbnail' => UploadedFile::fake()->image('thumbnail.jpg'),
    //         'language' => 1,
    //         'visibility' => 'Public',
    //         'tags' => ['tag1', 'tag2', 'tag3'],
    //     ]);

    //     $response->assertStatus(200);

    // }

    public function testShow(): void
    {
        $video = Video::first();
        $user = $video->user;
        $this->actingAs($user, 'api');
        $response = $this->getJson("api/video/watch/{$video->reference_code}");
        $response->assertStatus(200)
                 ->assertJsonStructure([
                    '*' => []
                ]);
    }

    public function testUpdateLikes(): void
    {
        $video = Video::first();
        $user = User::first();
        $this->actingAs($user, 'api');
        $response = $this->post("api/video/like/{$video->reference_code}", [
            'like_dislike' => true
        ]);
        $response->assertStatus(200)
             ->assertJson(['message' => 'Likes updated successfully']);
    }

    public function testAll(): void
    {

        $response = $this->getJson('api/video/all');
        $response->assertStatus(200)
                 ->assertJsonStructure([
                    '*' => [
                        'video',
                        'reference_code',
                        'duration',
                        'thumbnail',
                        'video',
                        'views',
                        'visibility',
                        'shares',
                        'created_at',
                        'updated_at',
                        'status',
                        'languages',
                        'tags',
                        'userName',
                        'firstName',
                        'avatar',
                        'likesCount',
                        'dislikesCount',
                    ]
                 ]);
    }

    public function testSearch(): void
    {
        $response = $this->getJson('/api/video/search?search=Sznycowy film');
        $response->assertStatus(200);

        $responseData = $response->json('videos');
    
        $containsKeyword = collect($responseData)->contains(function ($video) {
            return str_contains($video['title'], 'Sznycowy film');
        });
    
        $this->assertTrue($containsKeyword, 'No videos with the keyword "Sznycowy film" found in the response.');
    }

    public function testCountView(): void
    {
        $video = Video::first();
        $response = $this->post("api/video/addView/{$video->reference_code}");
        $response->assertStatus(200)
                ->assertSee('Succesfully added view');
        $this->assertDatabaseHas('video_views', ['video_id' => $video->id]);
    }
    protected function assertUploadedFileExists(string $path)
    {
        $this->assertTrue(
            file_exists(public_path($path)),
            "Failed asserting that the file at path '$path' exists."
        );
    }
}
