<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Video;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'reference_code' => 'required|exists:videos,reference_code',
            'content' => 'required|string|max:512|min:1',
            'parent' => 'exists:comments,id'
        ]);


        $referenceCode = $request->reference_code;

        $video = Video::where('reference_code', $referenceCode)->first();

        $comment = Comment::create([
            'content' => $request->content,
            'parent' => $request->parent ? $request->parent : 0,
            'video_id' => $video->id,
            'user_id' => $request->user()->id,
        ]);

        $comment->video()->associate($video);
        $comment->save();

        return response()->json([
            'comment' => $comment,
            'status' => 'Properly added a comment'
        ]);
    }

    public function show(Request $request)
    {
        $request->validate([
            'reference_code' => 'required|exists:videos,reference_code',
            'offset' => 'nullable|integer|min:0',
            'children_offset' => 'nullable|integer|min:0'
        ]);

        $offset = $request->input('offset', 0);
        $children_offset = $request->input('children_offset', 0);


        $referenceCode = $request->reference_code;

        $video = Video::where('reference_code', $referenceCode)->first();
        
        $comments = $video->comments()
        ->where('parent', 0)
        ->offset(10 * $offset)
        ->limit(10)
        ->get();
        
        foreach($comments as &$comment)
        {
            $user = User::find($comment['user_id']);
            $comment['user_name'] = $user->name;
            $comment['user_first_name'] = $user->first_name;
            $comment['user_avatar'] = $user->avatar;
            $comment['children_count'] = $comment->countChildren();
            $comment['children'] = $comment->getChildren($children_offset);
        }
        
        return response()->json(['comments' => $comments]);
    }

    public function getChildrenComments(Request $request)
    {
        $request->validate([
            'comment' => 'required|integer|exists:comments,id',
            'offset' => 'nullable|integer|min:0'
        ]);

        $offset = $request->input('offset', 0);

        $comment = Comment::find($request->comment);
        if(!$comment->hasChildren())
        {
            return response()->json(null);
        }

        $children = Comment::where('parent', $comment->id)
        ->offset(10 * $offset)
        ->limit(10)
        ->get();

        if($children)
        {
            foreach($children as &$child)
            {
                $user = User::find($child['user_id']);
                $child['user_name'] = $user->name;
                $child['user_first_name'] = $user->first_name;
                $child['user_avatar'] = $user->avatar;
                $comment['children_count'] = $comment->countChildren();
                $child['children`'] = $child->getChildren();
    
            }
    
            return response()->json(['child_comments' => $children]);
        }

        return response()->json('No child comments');

    }

    public function delete(Request $request)
    {
        $comment = Comment::find($request->comment);

        if (!$comment)
        {
            return response()->json(['error' => 'Comment not found'], 404);
        }

        $this->authorize($comment);

        $children = $comment->getChildren();

        foreach($children as $child)
        {
            $child->delete();
        }

        $comment->delete();

        return response()->json(
            ['Comment' => $comment,
                'Comment removed succesfully',
            ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'comment' => 'required|integer|exists:comments,id',
            'content' => 'string|max:512|min:1',
        ]);

        $comment = Comment::find($request->comment);

        $this->authorize($comment);

        $comment->content = $request->content;

        $comment->save();

        return response()->json(
            ['Comment' => $comment,
                'Comment updated succesfully',
            ]);

    }

}
