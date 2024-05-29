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

    public function report()
    {
        return $this->morphToMany(Report::class, 'reportable');
    }

    public function getChildren(int $offset = 0)
    {
       $children = Comment::where('parent', $this->id)->offset($offset)->get();

       foreach($children as &$child)
       {
            $user = User::find($child['user_id']);
            $child['user_name'] = $user->name;
            $child['user_first_name'] = $user->first_name;
            $child['user_avatar'] = $user->avatar;
            $currentBorder = $user->currentBorder();
            unset($currentBorder['pivot']);
            $comment['current_border'] = $currentBorder;
            $child['children'] = $child->getChildren($offset);
       }

       return $children;

    }

    public function countChildren() : int
    {
        return Comment::where('parent', $this->id)->count();
    }

}
