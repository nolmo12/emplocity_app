<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\Video;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserOwnsModel
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $videoId = $request->video_id;
        $video = Video::find($videoId);
        if (!$video)
        {
            return response()->json(['error' => 'Video not found'], 404);
        }

        if(!$request->user()->videos()->where('id', $videoId)->exists())
        {
            return redirect('/login');
        }

        return $next($request);
    }
}
