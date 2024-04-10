<?php

namespace App\Models;

use App\Models\User;
use App\Models\Report;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use App\Helpers\VideoManager;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Video extends Model
{
    use HasFactory;

    protected $fillable = [
        'thumbnail', 'video', 'user_id', 'tags'
    ];

    public function user() :BelongsTo
    {
        return $this->belongsTo(User::class, 'owner');
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

    public function getDuration()
    {
        $videoManager = new VideoManager($this->video);

        $durationInSeconds = $videoManager->getDuration('seconds');

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
}
