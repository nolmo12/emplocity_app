<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Url extends Model
{
    use HasFactory;
    protected $fillable = [
        'original_url',
        'short_url',
        'video_id',
        'ip_adress'
    ];

    protected $hidden = [
        'ip_adress'
    ];

    public function video() : BelongsTo
    {
        return $this->belongsTo(Video::class);
    }
}
