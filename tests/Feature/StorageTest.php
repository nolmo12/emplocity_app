<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class StorageControllerTest extends TestCase
{
    public function testFindStorage()
    {
        $type = 'images';
        $asset = 'example.jpg';

        $response = $this->getJson("/api/storage/{$type}/{$asset}");

        $response->assertStatus(200)
                ->assertJson([
                    asset("storage/{$type}/{$asset}")
                ]);
    }

}
