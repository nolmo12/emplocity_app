<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TagController extends Controller
{
    public function all(Request $request)
    {
        $offset = $request->input('offset', 0);
        
        $tags = Tag::withCount('videos')
        ->orderByDesc('videos_count')
        ->offset(16 * $offset)
        ->get();

        return $tags;
    }
    public function getVideoByTag(Request $request, string $tag)
    {
        $offset = $request->input('offset', 0);

        $videos = Video::whereHas('tags', function($query) use ($tag) {
            $query->where('name', $tag);
        })
        ->where('visibility', 'Public')
        ->offset(12 * $offset)
        ->limit(12)
        ->get();

        $videosCollection = collect();

        foreach($videos as $video)
        {
            $stats = $video->stats();
            $videosCollection->push($stats);
        }

        return $videosCollection;
    }
}
