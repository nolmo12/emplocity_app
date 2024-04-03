<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    use HasFactory;

    public function owner()
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
        return $this->hasMany(VideoLikeDislike::class, 'video_id');
    }

    // Relationship with Tags
    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }

    // Relationship with Status
    public function status()
    {
        return $this->belongsTo(Status::class);
    }

    // Relationship with Languages
    public function languages()
    {
        return $this->hasMany(Language::class);
    }

    // Relationship with Comments
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
