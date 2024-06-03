<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Video;
use App\Models\Border;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;


class UserTest extends TestCase
{
    public function testGetLikes(): void
    {
        $user = User::first();
        $video = Video::all()->first();
        $this->actingAs($user, 'api');
        $likedResponse = $this->post("/api/video/like/$video->reference_code", [
            'like_dislike' => true
        ]);
        $likedResponse->assertStatus(200);

        $response = $this->get('/api/auth/likedVideos');
        $response->assertStatus(200)
        ->assertJsonStructure([
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
               'tags',
               'likesCount',
               'dislikesCount',
           ]
        ]);
    }

    public function testHasUserLikedVideo(): void
    {
        $user = User::first();
        $video = Video::all()->first();
        $this->actingAs($user, 'api');
        $likedResponse = $this->post("/api/video/like/$video->reference_code", [
            'like_dislike' => true
        ]);
        $likedResponse->assertStatus(200);

        $response = $this->get("/api/video/hasUserLiked/{$video->reference_code}");
        $response->assertStatus(200)
                 ->assertSeeText('1');
    }
    
    public function testDelete(): void
    {
        $email = fake()->unique()->email();
        $name = fake()->name();

        $user = User::create([
            'name' => $name,
            'first_name' => $name,
            'email' => $email,
            'password' => Hash::make('password123'),
        ]);

        $user->email_verified_at = now();
        $user->save();

        $loginResponse = $this->post('/api/auth/login', [
            'email' => $email,
            'password' => 'password123',
        ]);
        $loginResponse->assertStatus(200);

        $token = $loginResponse->json('token');
        $this->withHeaders([
            'Authorization' => "Bearer $token",
        ]);

        $deleteResponse = $this->delete('/api/auth/delete', [
            'user_id' => $user->id
        ]);
        $deleteResponse->assertStatus(200)
                    ->assertJson(['success' => 'Successfully deleted user']);
    }

    public function testUpdate(): void
    {
        $user = User::first();

        $this->actingAs($user, 'api');

        $response = $this->post("/api/auth/update/{$user->id}", [
            'name' => 'Updated Name',
        ]);
        $response->assertStatus(200)
                 ->assertJson([
                     'status' => 'success',
                     'message' => 'User updated successfully',
                 ]);
    }

    public function testRead(): void
    {
        $user = User::first();

        $this->actingAs($user, 'api');

        $response = $this->get("/api/auth/read/{$user->id}");
        $response->assertStatus(200)
                 ->assertJson([
                     'status' => 'success',
                 ]);
    }

    public function testListing(): void
    {
        $response = $this->get('/api/users/listing');
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     '*' => [
                         'id',
                         'name',
                         'first_name',
                         'avatar',
                         'created_at',
                         'updated_at',
                         'status',
                         'current_border',
                     ]
                 ]);
    }

    public function testShowCurrentBorder(): void
    {
        $user = User::first();
        $this->actingAs($user, 'api');

        $response = $this->get("/api/auth/currentBorder/{$user->id}");
        $response->assertStatus(200)
                ->assertJsonStructure([
                    'message',
                ]);
    }

    public function testChangeCurrentBorder(): void
    {
        $user = User::first();
        $this->actingAs($user, 'api');

        $border = Border::first();

        if (!$user->borders->contains($border->id)) {
            $user->borders()->attach($border->id);
        }

        $response = $this->patch('/api/auth/changeCurrentBorder', [
            'borderId' => $border->id,
        ]);

        $response->assertStatus(200)
                ->assertJson([
                    'message' => 'Current border updated successfully',
                ]);

    }

    public function testFollow(): void
    {
        $user = User::first();
        $this->actingAs($user, 'api');

        $creator = User::where('id', '!=', $user->id)->first();

        $response = $this->post('/api/auth/follow', [
            'creator_id' => $creator->id,
        ]);
        $response->assertStatus(200)
                ->assertJson([
                    'status' => true,
                    'message' => 'Successfully followed the creator.',
                ]);
    }

    public function testHasFollowed(): void
    {
        $user = User::first();
        $this->actingAs($user, 'api');

        $creator = User::where('id', '!=', $user->id)->first();

        $response = $this->get("/api/auth/isFollowing/{$creator->id}");
        $response->assertStatus(200)
             ->assertJson([
                 'is_following' => true,
             ]);
    }

    public function testGetCreators(): void
    {
        $user = User::first();
        $this->actingAs($user, 'api');
        $creator = User::where('id', '!=', $user->id)->first();

        $response = $this->get('/api/auth/followed');
        $response->assertStatus(200)
             ->assertJsonStructure([
                 '*' => []
             ]);
    }

    public function testUnfollow(): void
    {
        $user = User::first();
        $this->actingAs($user, 'api');

        $creator = User::where('id', '!=', $user->id)->first();

        $response = $this->post('/api/auth/unfollow', [
            'creator_id' => $creator->id,
        ]);
        $response->assertStatus(200)
                    ->assertJson([
                        'status' => true,
                        'message' => 'Successfully unfollowed the creator.',
                    ]);
    }
}
