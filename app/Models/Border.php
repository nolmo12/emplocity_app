<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Border extends Model
{
    use HasFactory;
    public $fillable = [
        'rarity',
        'type',
        'price',
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }
    
    public function order(): MorphMany
    {
        return $this->morphMany(Order::class, 'orderable');
    }
}
