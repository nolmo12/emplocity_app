<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'content',
        'parent',
        'video_id',
        'user_id'
    ];

    public function video()
    {
        return $this->belongsTo(Video::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function hasChildren() : bool
    {
        return Comment::where('parent', $this->id)->exists();
    }

    public function getChildren()
    {
        return Comment::where('parent', $this->id)->get();
    }
}
