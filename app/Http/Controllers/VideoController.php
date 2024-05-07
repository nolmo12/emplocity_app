<?php

namespace App\Http\Controllers;

use Sqids\Sqids;
use Carbon\Carbon;
use App\Models\Tag;
use App\Models\User;
use App\Models\Video;
use App\Helpers\Utils;
use App\Rules\Enumerate;
use App\Models\VideoView;
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
            'video' => 'required|file|mimetypes:video/mp4,video/avi, video/mov, video/mpeg,video/quicktime,',
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
       
        $videoManager = new VideoManager($video->video);

        $maxTime = $videoManager->getDuration('seconds');

        $video->duration = $maxTime;

        if(!$request->hasFile('thumbnail'))
        {
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

        $this->authorize('view', [$video]);

        return response()->json($video->stats());
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

    public function getSimilarVideos(Request $request, string $referenceCode)
    {

        $offset = $request->input('offset', 16);

        $video = Video::where('reference_code', $referenceCode)->first();

        if (!$video) 
        {
            return response()->json(['error' => 'Video not found'], 404);
        }

        $similarVideosBasedTags = Video::whereHas('tags', function($tag) use ($video) {
            $tag->whereIn('name', $video->tags()->pluck('name'));
        })
        ->where('reference_code', '!=', $referenceCode)
        ->where('visibility', 'Public')
        ->limit(4)
        ->get();

        $similarVideos = collect();

        foreach($similarVideosBasedTags as $similarVideo)
        {
            $stats = $similarVideo->stats();
            unset($stats['tags']);
            unset($stats['description']);
            $similarVideos->push($stats);
        }
    
        if ($similarVideos->count() < $offset)
        {
            $additionalVideosNeeded = $offset - $similarVideos->count();
            $additionalVideos = Video::where('visibility', 'Public')
                ->inRandomOrder()
                ->whereNotIn('reference_code', $similarVideosBasedTags->pluck('reference_code')->toArray())
                ->limit($additionalVideosNeeded)
                ->get();
    
            foreach($additionalVideos as $additionalVideo)
            {
                $stats = $additionalVideo->stats();
                unset($stats['tags']);
                unset($stats['description']);
                $similarVideos->push($stats);
            }
        }

        //$similarVideos = $similarVideos->unique('video.reference_code');

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
        
        $this->authorize('delete', $video);

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

        $this->authorize('update', $video);

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


    public function search(Request $request)
    {
        $request->validate([
            'query' => 'string|max:255|min:0',
            'offset' => 'nullable|integer|min:0',
            'sorting' => ['nullable','string', new Enumerate(['upload_date_desc', 'upload_date_asc', 'views', 'popularity'])]
        ]);

        $offset = $request->input('offset', 0);

        $searchQuery = $request->query('query');

        $searchQueryArray = explode(' ', $searchQuery);

        $searchQueryArray = array_map('strtolower', $searchQueryArray);

        $videoCollection = collect();

        $userCollection = collect();
        
        foreach($searchQueryArray as $word)
        {
            $videos = Video::where('visibility', 'Public')
            ->whereHas('tags', function ($query) use ($word) {
                $soundexWord = soundex($word);
                $query->whereRaw("SOUNDEX(name) = '$soundexWord'");
            })
            ->offset(12 * $offset)
            ->get();
        
            $users = User::where(function ($query) use ($word) {
                $query->whereRaw("SOUNDEX(name) = SOUNDEX(?)", [$word])
                      ->orWhereRaw("SOUNDEX(first_name) = SOUNDEX(?)", [$word]);
            })
            ->get();

            $videoCollection = $videoCollection->concat($videos);
            $userCollection = $userCollection->concat($users);
        }
        
        $videoScores = [];
        $userScores = [];

        foreach ($videoCollection as $video) {
            $videoScores[$video->reference_code] = [
                'video_name' => $video->languages()->first()->pivot->title,
                'upload_date' => $video->created_at->timestamp,
                'score' => $video->calculateSearchScore($searchQueryArray),
                'views' => $video->views
            ];
        }

        foreach ($userCollection as $user)
        {
            $userScores[$user->id] = [
                'score' => $user->calculateSearchScore($searchQueryArray)
            ];
        }

        $order = $request->sorting;
        switch($order)
        {
            case 'popularity':
                uasort($videoScores, function($a, $b) {
                    return $b['score'] <=> $a['score'];
                });
                break;
            case 'upload_date_desc':
                uasort($videoScores, function($a, $b) {
                    return $b['upload_date'] <=> $a['upload_date'];
                });
                break;
            case 'upload_date_asc':
                uasort($videoScores, function($a, $b) {
                    return $b['upload_date'] <= $a['upload_date'];
                });
                break;
            case 'views':
                    uasort($videoScores, function($a, $b) {
                        return $b['views'] >= $a['views'];
                    });
                    break;
            default:
            uasort($videoScores, function($a, $b) {
                return $b['score'] <=> $a['score'];
            });                                                                                                                                                                                                            
        }

        uasort($userScores, function ($a, $b) {
            return $b['score'] <=> $a['score'];
        });

        $videos = [];
        $users = [];

        foreach($videoScores as $referenceCode => $value)
        {
            $video = Video::where('reference_code', $referenceCode)->first();
            $stats = $video->stats();
            unset($stats['tags']);
            $videos[] = $stats;
        }

        foreach($userScores as $id => $value)
        {
            $user = User::find($id);
            $users[] = $user;
        }

        $result = [
            'videos' => $videos,
            'users' => $users
        ];
        
        return $result;
    }

    public function listing(Request $request)
    {
        $request->validate([
            'offset' => 'nullable|integer|min:0',
        ]);
        
        $offset = $request->input('offset', 0);
        $user = $request->user();

        $listedVideos = collect();
        $watchedTags = collect();
        $videos = collect();


        if(!$user)
        {
            $videos = Video::inRandomOrder()->where('visibility', 'Public')->offset(12 * $offset)->limit(12)->get();
        }
        else
        {
            $watchedVideos = $user->histories()->with('video.tags')->get();
            foreach($watchedVideos as $history)
            {
                $watchedTags = $watchedTags->merge($history->video->tags);
            }

            foreach ($watchedTags as &$tag)
            {
                unset($tag['pivot']);
            }
            
            $videos = Video::whereHas('tags', function($query) use ($watchedTags) {
                $query->whereIn('name', $watchedTags->pluck('name'));
            })
            ->whereNotIn('id', $videos->pluck('id'))
            ->where('visibility', 'Public')
            ->inRandomOrder()
            ->limit(12)
            ->get();
        }

        if($videos->count() < 12)
        {
            $additionalVideos = Video::inRandomOrder()
            ->whereNotIn('id', $videos->pluck('id'))
            ->limit(12 - $videos->count())
            ->where('visibility', 'Public')
            ->get();
    
            $videos = $videos->merge($additionalVideos);
        }

        foreach($videos as $video)
        {
            $stats = $video->stats();
            unset($stats['tags']);
            $listedVideos->push($stats);
        }

        return $listedVideos;
    }
    
    public function countView(Request $request, string $referenceCode)
    {
        $video = Video::where('reference_code', $referenceCode)->first();

        if($video)
        {
            $ipAddress = $request->ip();
            $hasViewed = VideoView::where('video_id', $video->id)
            ->where('ip_address', $ipAddress)
            ->where('created_at', '>=', Carbon::now()->subHours(24))
            ->exists();

            if (!$hasViewed)
            {
                $video->views += 1;
                $video->save();

                VideoView::create([
                    'video_id' => $video->id,
                    'ip_address' => $ipAddress,
                ]);
            
                return response()->json('Succesfully added view');
            }
        }
    }

}
