<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use App\Models\Video;
use Illuminate\Http\Request;
use App\Models\LanguangeVideo;
use Illuminate\Support\Facades\Validator;
use Sqids\Sqids;
use App\Helpers\ValidateHelper;
use App\Helpers\VideoManager;
use App\Helpers\utils;

class VideoController extends Controller
{
    public function store(Request $request)
    {

        $validateVideo = Validator::make($request->all(), 
        [
            'title' => 'required|string|max:255',
            'description' =>'string|max:255',
            'thumbnail' => 'file|mimetypes:image/jpeg,image/png',
            'language' => 'required|exists:languages,id',
            'video' => 'required|file|mimetypes:video/mp4,video/avi,video/mpeg,video/quicktime',
            'tags' => 'array',
            'tags.*' => 'string|min:2'
        ]);

        if($validateVideo->fails())
        {
            $errors = $validateVideo->errors();
            $formattedErrors = ValidateHelper::getAllVideoErrorCodes($errors);


            return response()->json([
                'status' => false,
                'message' => 'validation error',
                'errors' => $formattedErrors
            ], 401);
        }

        $video = new Video;

        if($request->tags != null)
        {
            foreach($request->tags as $tagName)
            {
                $tag = Tag::where('name', $tagName)->first();
                
                if($tag)
                {
                    $video->tags()->attach($tag->id);
                }
                else
                {
                    $newTag = new Tag;
                    $newTag->name = $tagName;
                    $newTag->save();
    
                    $video->tags()->attach($newTag->id);
                }
            }
        }

        $sqids = new Sqids(minLength : 10);

        if($request->hasFile('video'))
        {
            $path = $request->file('video')->store('videos', ['disk'
        => 'public'
        ]);

            $video->video = $path;
        }

        $count = Video::count();

        $video->reference_code = $sqids->encode([$count, rand(0, 100), rand(0, 100)]);

        $video->save();

        if(!$request->hasFile('thumbnail'))
        {
            $videoManager = new VideoManager($video->video);

            $maxTime = $videoManager->getDuration('seconds');

            $randomTime = rand(0, intval($maxTime));

            $thumbnailPath = $videoManager->saveFrame($randomTime);

            $video->thumbnail = $thumbnailPath;

            $video->save();

        }
        else
        {
            $path = $request->file('thumbnail')->store('thumbnails', ['disk'
            => 'public'
            ]);

            $video->thumbnail = $path;
        }

        

        $video->languages()->attach($request->language,
        [
            'title' => $request->title,
            'description'=> $request->description
        ]);
    }

    public function show(string $referenceCode)
    {
        $video = Video::where('reference_code','=', $referenceCode)->first();

        return $video;
    }
}
