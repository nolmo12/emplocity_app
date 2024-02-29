<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VideoLikeDisLike extends Model
{
    use HasFactory;

    public function video()
    {
        return $this->belongsTo(Video::class, 'video_id');
    }

    // Relationship with User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
