<?php

namespace App\Http\Controllers;

use Sqids\Sqids;
use App\Models\Tag;
use App\Models\User;
use App\Models\Video;
use App\Helpers\utils;
use App\Rules\Enumerate;
use Illuminate\Http\Request;
use App\Helpers\VideoManager;
use App\Models\LanguageVideo;
use App\Helpers\ValidateHelper;
use App\Models\VideoLikesDislike;
use Illuminate\Support\Facades\File;
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
            'visibility' => ['required', new Enumerate(['Public', 'Unlisted', 'Hidden'])],
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

        $video->status = 'Uploading';
      
        $sqids = new Sqids(minLength : 10);

        $count = Video::count();

        $video->reference_code = $sqids->encode([$count, rand(0, 100), rand(0, 100)]);
        
        if($request->hasFile('video'))
        {
            $videoName = $video->reference_code . str_replace(' ', '', $request->file('video')->getClientOriginalName());
            $path = $request->file('video')->storeAs('public/videos', $videoName);

            $request->file('video')->move(public_path('storage/videos'), $videoName);

            $publicPath = Storage::url($path);

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
            $relativePath = str_replace([public_path(), '\\'], '', $thumbnailPath);
            $relativePath = str_replace("%03d", "001", $relativePath);

            $video->thumbnail = $relativePath;

            $video->save();

        }
        else
        {
            $thumbnailName = $video->reference_code . str_replace(' ', '', $request->file('thumbnail')->getClientOriginalName());
            $path = $request->file('thumbnail')->storeAs('public/videos', $thumbnailName);

            $request->file('thumbnail')->move(public_path('storage/videos'), $thumbnailName);
            $publicPath = Storage::url($path);
            Storage::delete($path);

            $video->thumbnail = $publicPath;
        }

        

        $video->languages()->attach($request->language,
        [
            'title' => $request->title,
            'description'=> $request->description
        ]);

        $languages = $video->languages;

        if($request->tags != null)
        {
            $video->addTags($request->tags);
        }

        foreach($languages as $language)
        {
            $nameArr = explode(" ", $language->pivot->title);
            foreach ($nameArr as $tag)
            {
                if (strlen($tag) >= 3)
                {
                    $video->addTags([$tag]);
                }
            }
        }

        if($request->user())
        {
            $request->user()->videos()->save($video);
        }

        $video->status = 'Ok';
        $video->visibility = $request->visibility;
        $video->save();
        
        return $video;
    }

    public function show(Request $request, string $referenceCode)
    {   
        $video = Video::where('reference_code', $referenceCode)->first();
    
        if (!$video)
        {
            return response()->json(['error' => 'Video not found'], 404);
        }
        if($request->user())
            error_log('User '.$request->user()->name.'is logged in');
        $this->authorize('view', [$video]);

        $language = $video->languages()->first();
        $title = $language->pivot->title;
        $description = $language->pivot->description;
        $tags = $video->tags()->get();
        $likesCount = $video->getLikesDislikesCount(true);
        $dislikesCount = $video->getLikesDislikesCount(false);

        $user = User::find($video->user_id);

        $user = User::find($video->user_id);
        $userName = $user ? $user->name : null;
        $userFirstName = $user ? $user->first_name : null;
        $userAvatar = $user ? $user->avatar : null;
        
        $responseData = compact('video', 'title', 'description', 'userName', 'userFirstName', 'userAvatar', 'tags', 'likesCount', 'dislikesCount');

        return response()->json($responseData);
    }
    public function all(Request $request)
    {
        $request->validate([
            'offset' => 'nullable|integer|min:0',
        ]);
        
        $offset = $request->input('offset', 0);

        

        $videos = Video::with(['languages', 'tags'])->where('visibility', 'Public')->offset(12 * $offset)->limit(12)->get();

        $videosArray = [];
        foreach ($videos as $video)
        {

            $likesCount = $video->getLikesDislikesCount(true);
            $dislikesCount = $video->getLikesDislikesCount(false);

            $user = User::find($video->user_id);
    
            $videoArray = $video->toArray();
            if($user)
            {
                $videoArray['userName'] = $user->name;
                $videoArray['firstName'] = $user->first_name;
                $videoArray['avatar'] = $user->avatar;
            }
                
            $videoArray['likesCount'] = $likesCount;
            $videoArray['dislikesCount'] = $dislikesCount;
    
            $videosArray[] = $videoArray;
        }
        return response()->json($videosArray);
    }
    
    /**
     * Gets similarVideos based on tags, user and if lacking videos, then it chooses them randomly.
     * @param string $referenceCode Reference code of the video(Sqids)
     * @return \Illuminate\Support\Collection<array-key, mixed> Collection of similar videos
     */
    public function getSimilarVideos(string $referenceCode)
    {
        $video = Video::with('languages', 'tags')->where('reference_code', $referenceCode)->first();

        if (!$video) 
        {
            return response()->json(['error' => 'Video not found'], 404);
        }

        $similarVideos = collect();

        foreach ($video->tags as $tag)
        {
            $tagVideos = $tag->videos()->where('visibility', 'Public')->get();
            $similarVideos = $similarVideos->merge($tagVideos);
        }

        if ($video->user_id != null)
        {
            $videoOwner = User::find($video->user_id);
            $similarVideos = $similarVideos->merge($videoOwner->videos()->where('visibility', 'Public')->get());
        }

        $similarVideos = $similarVideos->unique('reference_code');

        if ($similarVideos->count() < 10)
        {
            $additionalVideosNeeded = 10 - $similarVideos->count();
            $additionalVideos = Video::where('visibility', 'Public')
                ->inRandomOrder()
                ->whereNotIn('reference_code', $similarVideos->pluck('reference_code')->toArray())
                ->limit($additionalVideosNeeded)
                ->get();

            $similarVideos = $similarVideos->merge($additionalVideos);
        }

        $similarVideos = $similarVideos->filter(function ($similarVideo) use ($video) {
            return $similarVideo->reference_code !== $video->reference_code;
        });

        $similarVideos = $similarVideos->take(10);

        $similarVideos->shuffle();

        $similarVideos->transform(function ($similarVideo) use ($video) {
            $similarVideo->title = $similarVideo->languages()->first()->pivot->title;
            return $similarVideo;
        });
        
        $similarVideosTags = collect();
        foreach ($similarVideos as $similarVideo)
        {
            $similarVideosTags = $similarVideosTags->merge($similarVideo->tags);
            unset($similarVideo->pivot);
        }

        $similarVideosTags = $similarVideosTags->unique();

        return $similarVideos;
    }
    //This method needs to be changed, because it is currently not working
    //Use File instead of Storage class
    public function delete(Request $request)
    {
        $video = Video::where('reference_code', $request->reference_code)->first();

        if (!$video)
        {
            return response()->json(['error' => 'Video not found'], 404);
        }

        $video->tags()->detach();

        $video->languages()->detach();

        $video->likesDislikes()->delete();

        $video->comments()->delete();

        $videoPath = public_path($video->video);
        $thumbnailPath = public_path($video->thumbnail);

        if(File::exists($videoPath))
            File::delete($videoPath);
        else
            return response()->json(['error' => 'Video path not found'], 404);

        
        if(File::exists($thumbnailPath))
            File::delete($thumbnailPath);
        else
            return response()->json(['error' => 'Thumbnail path not found'], 404);

        $video->delete();

        return response()->json(['success'=> 'Succesfully deleted video'], 200);
    }

    public function updateLikes(Request $request, string $referenceCode)
    {

        
        $validateVideo = Validator::make($request->all(), 
        [
            'like_dislike' => 'required|boolean',
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

        $video = Video::where('reference_code', $referenceCode)->first();
        if (!$video)
        {
            return response()->json(['error' => 'Video not found'], 404);
        }

        $existingLike = VideoLikesDislike::where('user_id', $request->user()->id)
        ->where('video_id', $video->id)
        ->first();


        if ($existingLike)
        {
            if ($existingLike->is_like == $request->like_dislike)
            {
                $existingLike->delete();
            } 
            else 
            {
                $existingLike->update(['is_like' => $request->like_dislike]);
            }
        } 
        else 
        {
            $likeDislike = VideoLikesDislike::create([
                'user_id' => $request->user()->id,
                'video_id' => $video->id,
                'is_like' => $request->like_dislike
            ]);
        }

        return response()->json(['message' => 'Likes updated successfully'], 200);
    }

    public function update(Request $request)
    {
        $referenceCode = $request->reference_code;
        $validateVideo = Validator::make($request->all(), 
        [
            'title' => 'string|max:255',
            'description' =>'string|max:255',
            'thumbnail' => 'file|mimetypes:image/jpeg,image/png',
            'language' => 'exists:languages,id',
            'visibility' => [new Enumerate(['Public', 'Unlisted', 'Hidden'])],
            'tags' => 'array',
            'tags.*' => 'string|min:3',
            'tags_to_remove' => 'array'
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

        $video = Video::with('languages', 'tags')->where('reference_code', $referenceCode)->first();

        $video->visibility = $request->visibility;

        if($request->hasFile('thumbnail'))
        {
            $publicPath = public_path($video->thumbnail);
            File::delete($publicPath);
            $thumbnailName = $video->reference_code . str_replace(' ', '', $request->file('thumbnail')->getClientOriginalName());
            $path = $request->file('thumbnail')->storeAs('public/videos', $thumbnailName);

            $request->file('thumbnail')->move(public_path('storage/videos'), $thumbnailName);
            $publicPath = Storage::url($path);
            Storage::delete($path);

            $video->thumbnail = $publicPath;
            $video->save();
        }

        if($request->tags_to_remove)
        {
            foreach($request->tags_to_remove as $tag)
            {
                $tagModel = Tag::where('name', $tag)->first();
                $video->tags()->detach($tagModel->id);
            }
            $video->save();
        }

        //this is to be changed when we will add functionality for more languages)
        $languages = $video->languages;
        if($request->title)
        {
            foreach($languages as $language)
            {
                $language->pivot->title = $request->title;
                $language->pivot->save();
            }
        }

        if($request->description)
        {
            foreach($languages as $language)
            {
                $language->pivot->description = $request->description;
                $language->pivot->save();
            }
        }


        foreach($languages as $language)
        {
            $nameArr = explode(" ", $language->pivot->title);
            foreach ($nameArr as $tag)
            {
                if (strlen($tag) >= 3)
                {
                    $video->addTags([$tag]);
                }
            }
        }

        if($request->tags)
            $video->addTags($request->tags);

        $video->save();  
    }
}
