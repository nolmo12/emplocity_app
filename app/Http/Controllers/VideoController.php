<?php

namespace App\Http\Controllers;

use Sqids\Sqids;
use App\Models\Tag;
use App\Models\Video;
use App\Helpers\utils;
use Illuminate\Http\Request;
use App\Helpers\VideoManager;
use App\Models\LanguangeVideo;
use App\Helpers\ValidateHelper;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

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

        $count = Video::count();

        $video->reference_code = $sqids->encode([$count, rand(0, 100), rand(0, 100)]);

        if($request->hasFile('video'))
        {
            $videoName = $video->reference_code . $request->file('video')->getClientOriginalName();
            $path = $request->file('video')->storeAs('public/videos', $videoName);
            $publicPath = $request->file('video')->move(public_path('storage/videos'), $videoName);

            Storage::delete($path);

            $video->video = $publicPath;
        }

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
            $thumbnailName = $video->reference_code() . $request->file('thumbnail')->getClientOriginalName();
            $path = $request->file('thumbnail')->storeAs('public/thumbnails', $thumbnailName);

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
        $video = Video::where('reference_code', $referenceCode)->first();
    
        if (!$video) {
            return response()->json(['error' => 'Video not found'], 404);
        }

        $language = $video->languages()->first();
        $title = $language->pivot->title;
        $description = $language->pivot->description;
        $tags = $video->tags()->get();
    
        return response()->json(compact('video', 'title', 'description', 'tags'));
    }
}
