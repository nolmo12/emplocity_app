<?php

namespace App\Models;

use App\Helpers\SearchInterface;
use App\Models\User;
use App\Models\Report;
use App\Helpers\VideoManager;
use Illuminate\Support\Facades\File;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Video extends Model implements SearchInterface
{
    use HasFactory;

    protected $fillable = [
        'thumbnail', 'video', 'user_id', 'tags'
    ];

    protected $hidden = [
        'user_id'
    ];

    public function user() : BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reports()
    {
        return $this->morphMany(Report::class, 'reportable');
    }

    // Relationship with VideoLikeDislike
    public function likesDislikes()
    {
        return $this->hasMany(VideoLikesDislike::class, 'video_id');
    }
    

    // Relationship with Tags
    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }

    // Relationship with Status
    public function status()
    {
        return $this->hasOne('App\Models\Video', 'status');
    }

    // Relationship with Languages
    public function languages()
    {
        return $this->belongsToMany(Language::class)->withPivot('title', 'description');;
    }

    // Relationship with Comments
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    // Relationship with History
    public function histories()
    {
        return $this->hasMany(History::class);
    }

    public function stats()
    {
        $language = $this->languages()->first();
        $title = $language->pivot->title;
        $description = $language->pivot->description;
        $tags = $this->tags()->get();
        $likesCount = $this->getLikesDislikesCount(true);
        $dislikesCount = $this->getLikesDislikesCount(false);

        $user = User::find($this->user_id);

        $user = User::find($this->user_id);
        $userName = $user ? $user->name : null;
        $userFirstName = $user ? $user->first_name : null;
        $userAvatar = $user ? $user->avatar : null;
        
        $responseData = [
            'video' => $this,
            'title' => $title,
            'description' => $description,
            'userName' => $userName,
            'userFirstName' => $userFirstName,
            'userAvatar' => $userAvatar,
            'tags' => $tags,
            'likesCount' => $likesCount,
            'dislikesCount' => $dislikesCount,
        ];

        return $responseData;
    }

    public function getDuration()
    {
        $videoManager = new VideoManager($this->video);

        $durationInSeconds = $videoManager->getDuration('seconds');

        return $durationInSeconds;
    }

    public function addTags(array $tags): void
    {
        foreach ($tags as $tagName)
        {
            $tagName = strtolower($tagName);
            $tag = Tag::where('name', $tagName)->first();
    
            if ($tag)
            {
                $this->tags()->attach($tag->id);
            } 
            else
            {
                $newTag = Tag::create(['name' => $tagName]);
                $this->tags()->attach($newTag->id);
            }
        }
    }

    public function getLikesDislikesCount(bool $type = true): int
    {
        return $this->likesDislikes()->where('is_like', $type)->count();
    }

    public function removeThumbnail() : void
    {
        $publicPath = public_path($this->thumbnail);
        if(File::exists($publicPath))
        {
           File::delete($publicPath);
           $this->thumbnail = null;
        }
        else
            error_log('Thumbnail not found');
    }

    public function removeVideo() : void
    {
        $publicPath = public_path($this->video);
        if(File::exists($publicPath))
            File::delete($publicPath);
        else
            error_log('Video not found');
    }

    public function calculateSimilarityScore(Video $other): int
    {
        $title = $this->languages()->first()->pivot->title;

        $otherTitle = $other->languages()->first()->pivot->title;

        similar_text(strtolower($title), strtolower($otherTitle), $titleSimilarity);

        $titleSimiliratyScore = 7 * ($titleSimilarity / 100);

        $tags = $this->tags->pluck('name')->toArray();
        $otherTags = $other->tags->pluck('name')->toArray();


        $commonTags = array_intersect($tags, $otherTags);
        $commonTagsCount = count($commonTags);

        $tagSimilarityScore = 3 * ($commonTagsCount / count($tags));

        $similarityScore = $tagSimilarityScore + $titleSimiliratyScore;

        return $similarityScore;
    }

    public function calculateSearchScore(array $searchQueryArray) : float
    {
        $score = 0;

        $title = $this->languages()->first()->pivot->title;

        similar_text(strtolower($title), strtolower(implode(' ', $searchQueryArray)), $titleSimilarity);
        
        $titleSimiliratyScore = 7 * ($titleSimilarity / 100);

        $tags = $this->tags->pluck('name')->toArray();
        $tags = array_map('strtolower', $tags);

        $commonTags = array_intersect($tags, $searchQueryArray);
        $commonTagsCount = count($commonTags);

        $tagSimilarityScore = 3 * ($commonTagsCount / count($tags));
        
        $score += $titleSimiliratyScore + $tagSimilarityScore;

        return $score;
    }

    public function calculateListingScore(): float
    {
        return 3.3;
    }
}
