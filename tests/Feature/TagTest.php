<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Tag;
use App\Models\Video;

class TagTest extends TestCase
{
    public function testAllTags()
    {
        $response = $this->getJson('/api/tags/all');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    '*' => [
                        'id',
                        'name',
                        'videos_count'
                    ]
                ]);
    }

    public function testGetVideoByTag()
    {
        $tag = Tag::first();
        $response = $this->getJson("/api/tags/{$tag->name}");

        $response->assertStatus(200)
                ->assertJsonStructure([
                    '*' => [
                        'id',
                        'title',
                        'description',
                        'visibility',
                        'thumbnail',
                        'views',
                        'likes',
                        'dislikes',
                        'comments',
                        'created_at',
                        'updated_at',
                        'user' => [
                            'id',
                            'name',
                            'email',
                            'avatar',
                            'created_at',
                            'updated_at'
                        ]
                    ]
                ]);
    }
}
