<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\History;
use App\Models\Video;

class HistoryController extends Controller
{
    public function createOrUpdate(Request $request, $refrenceCode)
    {
        $video = Video::where('reference_code', $refrenceCode)->first();

        if (!$video) {
            return response()->json(['error' => 'Video not found'], 404);
        }

        $history = History::firstOrNew([
            'user_id' => $request->user()->id,
            'video_id' => $video->id,
        ]);
        
        if ($history) {
            $history->touch();
        }

        return response()->json(['message' => 'History updated successfully'], 200);
    }

    public function read(Request $request)
    {
        $history = History::where('user_id', $request->user()->id)
                          ->with('video')
                          ->orderBy('updated_at', 'desc')
                          ->get();

        $videoData = [];
        foreach ($history as $item) {
            $stats = $item->video->stats();
            unset($stats['tags']);
            $videoData[] = $stats;
        }             
        return response()->json($videoData);
    }
}
