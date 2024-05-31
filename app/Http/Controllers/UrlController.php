<?php

namespace App\Http\Controllers;

use Sqids\Sqids;
use App\Models\Url;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UrlController extends Controller
{
    public function createVideoUrl(Request $request)
    {
        $maxLength = 6;
        $validateVideo = Validator::make($request->all(), 
        [
            'original_url' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    if (!preg_match('/^video\/[A-Za-z0-9]+$/', $value)) {
                        $fail('The ' . $attribute . ' must follow the pattern video/{code}.');
                    }
                },
            ],
            'reference_code' => [
                'required',
                'string',
                'max:255',
                'exists:videos,reference_code'
            ],
            'time' => 'required|numeric|min:0',
        ]);
        
        if ($validateVideo->fails()) {
            return response()->json(['errors' => $validateVideo->errors()], 422);
        }

        if($validateVideo->fails())
        {
            $errors = $validateVideo->errors();


            return response()->json([
                'status' => false,
                'message' => 'validation error',
                'errors' => $errors
            ], 401);
        }
        $ip = $request->ip();
        $originalUrl = $request->original_url;
        $referenceCode = $request->reference_code;
        $time = $request->time;

        $video = Video::where('reference_code', $referenceCode)->first();

        $url = Url::where('ip_adress', $ip)
        ->where('video_id', $video->id)
        ->first();
        
        if($url)
        {
            $shortUrl = $url->short_url;
            $pattern = '/(\?|&)(t=)[^&]*/';

            if (preg_match($pattern, $shortUrl))
            {
                $shortUrl = preg_replace($pattern, '$1t=' . $time, $shortUrl);
            } 

            $url->short_url = $shortUrl;
            $url->save();

            return url("/v/{$url->short_url}");
        }

        $video->shares++;

        $hash = md5($originalUrl);
        $number = hexdec(substr($hash, 0, 15));

        $sqids = new Sqids();

        $shortenedUrl = $sqids->encode([$number, $time]);

        if(strlen($shortenedUrl) > $maxLength)
        {
            $shortenedUrl = substr($shortenedUrl, 0, $maxLength);
        }

        $shortenedUrl .= '?t=' . $time;

        

        Url::create([
            'original_url' => $originalUrl,
            'short_url' => $shortenedUrl,
            'video_id' => $video->id,
            'ip_adress' => $ip
        ]);

        return url("/v/{$shortenedUrl}");
    }

    public function redirection(Request $request, string $shortUrl)
    {
        $time = $request->t;
        $shortUrl =$shortUrl . '?t=' . $time;

        error_log($shortUrl);

        $url = Url::where('short_url', $shortUrl)->first();

        if($url)
        {
            $longUrl = $url->original_url . '/t=' . $time;
            return redirect($longUrl);
        }
        else
        {
            return redirect('/home')->with('Sorry, link has expired!');
        }
    }
}
