<?php

namespace App\Http\Controllers;

use Sqids\Sqids;
use Carbon\Carbon;
use App\Models\Tag;
use App\Models\Url;
use App\Models\User;
use App\Models\Video;
use App\Helpers\Utils;
use App\Models\History;
use App\Rules\Enumerate;
use App\Models\VideoView;
use Illuminate\Http\Request;
use App\Helpers\ImageManager;
use App\Helpers\VideoManager;
use App\Models\LanguageVideo;
use App\Helpers\ValidateHelper;
use App\Models\VideoLikesDislike;
use App\Jobs\SendEmailToFollowers;
use Illuminate\Support\Facades\DB;
use App\Helpers\FileRequestManager;
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
            'video' => 'required|file|mimetypes:video/mp4,video/avi, video/mov, video/mpeg,video/quicktime, video/webm',
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
            $file = $request->file('video');
            $videoName = hash('sha256', $file->getClientOriginalName()) .'.'. $file->extension();
            $path = $file->storeAs('public/videos', $videoName);

            $file->move(public_path('storage/videos'), $videoName);

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
            $fileManager = new FileRequestManager($request, 'thumbnail');
            $path = $fileManager->save('public/videos');
            $fileManager->move('storage/videos');

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

        if($request->user()){
            SendEmailToFollowers::dispatch($video)->onQueue('emails');
        }
        
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
                ->where('reference_code', '!=', $referenceCode)
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

        $video->histories()->delete();

        $video->languages()->detach();

        $video->likesDislikes()->delete();

        $video->comments()->delete();

        $video->views()->delete();

        $videoPath = public_path($video->video);
        $thumbnailPath = public_path($video->thumbnail);

        $video->delete();

        if(File::exists($videoPath))
            File::delete($videoPath);
        else
            return response()->json(['error' => 'Video path not found'], 404);

        // to fix if the thumbnail is not added to the video throws errors
        if(File::exists($thumbnailPath))
            File::delete($thumbnailPath);
        else
            return response()->json(['error' => 'Thumbnail path not found'], 404);

        return response()->json([
            'success'=> 'Succesfully deleted video',
            'video' => $video], 200);
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

        $this->countView($request, $referenceCode);

        return response()->json([
            'message' => 'Likes updated successfully'
        ], 200);
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
        if($request->visibility)
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
        return $video;
    }


    public function search(Request $request)
{
    $request->validate([
        'query' => 'string|max:255|min:0',
        'sorting' => ['nullable', 'string', new Enumerate(['upload_date_desc', 'upload_date_asc', 'views', 'popularity'])],
        'page' => 'integer|min:1',
        'per_page' => 'integer|min:1|max:100'
    ]);

    $perPage = $request->input('per_page', 12); // Default to 12 items per page
    $page = $request->input('page', 1);

    $searchQuery = $request->query('query');
    $searchQueryArray = array_map('strtolower', explode(' ', $searchQuery));

    $videoCollection = collect();
    $userCollection = collect();

    foreach($searchQueryArray as $word)
    {
        $wordLength = strlen($word);
        $maxDistance = intval($wordLength * 0.4);
        $escapedWord = str_replace(['%', '_'], ['\\%', '\\_'], $word);
        
        $videos = Video::where('visibility', 'Public')
            ->whereHas('tags', function ($query) use ($word, $escapedWord, $maxDistance) {
                $query->whereRaw("levenshtein(name, ?) <= ?", [$word, $maxDistance])
                    ->orWhere('name', 'like', '%' . $escapedWord . '%');
            })
            ->get();
        
        $users = User::where(function ($query) use ($word, $escapedWord, $maxDistance) {
            $query->orWhereRaw("levenshtein(name, ?) <= ?", [$word, $maxDistance])
                  ->orWhere('name', 'like', '%' . $escapedWord . '%')
                  ->orWhere('first_name', 'like', '%' . $escapedWord . '%');
        })
        ->get();

        $videoCollection = $videoCollection->concat($videos);
        $userCollection = $userCollection->concat($users);
    }

    $videoScores = [];
    $userScores = [];

    foreach ($videoCollection as $video)
     {
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
    switch($order) {
        case 'popularity':
            uasort($videoScores, fn($a, $b) => $b['score'] <=> $a['score']);
            break;
        case 'upload_date_desc':
            uasort($videoScores, fn($a, $b) => $b['upload_date'] <=> $a['upload_date']);
            break;
        case 'upload_date_asc':
            uasort($videoScores, fn($a, $b) => $a['upload_date'] <=> $b['upload_date']);
            break;
        case 'views':
            uasort($videoScores, fn($a, $b) => $b['views'] <=> $a['views']);
            break;
        default:
            uasort($videoScores, fn($a, $b) => $b['score'] <=> $a['score']);
    }

    uasort($userScores, fn($a, $b) => $b['score'] <=> $a['score']);

    
    $videoScores = array_slice($videoScores, ($page - 1) * $perPage, $perPage, true);
    
    $userScores = array_slice($userScores, ($page - 1) * $perPage, $perPage, true);

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
        'users' => $users,
        'page' => $page,
        'per_page' => $perPage
    ];

    return response()->json($result);
}


    public function list(Request $request)
    {
        $token = csrf_token();
        
        $hash = hash('sha256', $token);
    
        $decimal = hexdec($hash);
        
        $seed = $decimal / (pow(2, 256) - 1);

        $seed = min(max($seed, 0), 1);

        DB::statement("SELECT SETSEED($seed)");

        $randomVideos = collect();

        $randomVideos = Video::where('visibility', 'Public')
        ->orderByRaw('RANDOM()')
        ->simplePaginate(20);

        foreach ($randomVideos as $key => $video)
        {
            $stats = $video->stats();
            unset($stats['tags']);
            $randomVideos[$key] = $stats;
        }

        return $randomVideos;
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

    public function downloadVideo(Request $request, string $reference_code)
    {
        try {
            $video = Video::where('reference_code', $reference_code)->firstOrFail();

            $filePath = public_path('storage/videos/' . basename($video->video));

            if (!File::exists($filePath)) {
                return response()->json(['error' => 'File not found'], 404);
            }

            return response()->download($filePath, basename($video->video));

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Video not found'], 404);
        }
    }
    
}
