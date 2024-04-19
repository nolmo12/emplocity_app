<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Model;
use Symfony\Component\HttpFoundation\Response;
    /**
     * This middleware will probably be obsolete
     */
class EnsureUserOwnsModel
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if($referenceCode = $request->reference_code)
        {
            $video = Video::where('reference_code', $referenceCode)->first();
            if (!$video)
            {
                return response()->json(['error' => 'Video not found'], 404);
            }
    
            if(!$request->user()->videos()->where('id', $video->id)->exists())
            {
                return redirect('/login');
            }
        }
        else
        {
            
        }

        return $next($request);
    }
}
