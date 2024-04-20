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
    //use RefreshDatabase;
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
            'visibility' => 'Hidden',
            'video' => UploadedFile::fake()->create('video.mp4', 100),
            'tags' => ['tag1', 'tag2', 'tag3'],
         ]);

        $response->assertStatus(201);

        $video = Video::find($response->json('id'));

        $this->assertUploadedFileExists($video->thumbnail);
        $this->assertUploadedFileExists($video->video);
    }

    public function testVideoDeletion(): void
    {
        $user = User::find(1);
        $this->actingAs($user, 'api');

        $this->testVideoUpload();

        $video = $user->videos()->first();

        $response = $this->delete('/api/video/delete',[
            'reference_code' => $video->reference_code
        ]);

        $response->assertStatus(200);
    }

    public function testVideoEdition(): void
    {
        $user = User::find(1);
        $this->actingAs($user, 'api');

        $this->testVideoUpload();

        $video = $user->videos()->first();

        $response = $this->patch('/api/video/update',[
            'reference_code' => $video->reference_code,
            'title' => 'Bivowy film',
            'description' =>'Mega nie fajny opis',
            'thumbnail' => UploadedFile::fake()->image('thumbnail.jpg'),
            'language' => 1,
            'visibility' => 'Public',
            'tags' => ['tag1', 'tag2', 'tag3'],
        ]);

        $response->assertStatus(200);

    }

    protected function assertUploadedFileExists(string $path)
    {
        $this->assertTrue(
            file_exists(public_path($path)),
            "Failed asserting that the file at path '$path' exists."
        );
    }
}
