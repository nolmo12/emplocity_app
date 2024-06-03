<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Video;

class UrlTest extends TestCase
{
    public function testCreateVideoUrl()
    {
        $video = Video::first();
        $response = $this->putJson('/api/video/getUrl', [
            'original_url' => 'video/'. $video->reference_code,
            'reference_code' => $video->reference_code,
            'time' => 123,
        ]);

        $response->assertStatus(200);
    }
}
