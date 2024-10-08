<?php
namespace App\Helpers;

use Illuminate\Support\Facades\Storage;

class VideoManager
{
    private string $videoPath;

    public function __construct(string $videoPath)
    {
        $this->videoPath = public_path($videoPath);
    }
    

    public function saveFrame(int $time): string
    {
        $formattedTime = gmdate('H:i:s', $time);

        $ext = pathinfo($this->videoPath, PATHINFO_EXTENSION);

        $thumbnailName = str_replace(".$ext", "", $this->videoPath);

        $thumbnailName .= '%03d.jpg';
        
        $command = "ffmpeg -ss $formattedTime -i $this->videoPath -vframes 1 -frames:v 1 $thumbnailName";
        
        shell_exec($command);

        return $thumbnailName;
    }
    /**
     * Function to retrieve video time duration
     * @param string $type Specifies what type you want to return, default Minutes : Seconds
     * Possible values:
     *   - 'seconds': returns video time in Seconds
     *   - 'minutes': returns video time as an array [Minutes, Seconds]
     *   - 'hours': return video time as an array [Hours, Minutes, Seconds]
     * @return mixed The video duration based on the specified type
     */
    public function getDuration(string $type = 'minutes'): mixed
    {
        $escapedPath = escapeshellarg($this->videoPath);
        $output = shell_exec("ffmpeg -i $escapedPath 2>&1");
        
        $matches = [];
        if (preg_match('/Duration: (\d+):(\d+):(\d+)/', $output, $matches)) 
        {
            $hours = intval($matches[1]);
            $minutes = intval($matches[2]);
            $seconds = intval($matches[3]);



            $totalSeconds = ($hours * 3600) + ($minutes * 60) + $seconds;

            error_log("Time: ".$totalSeconds);

            return VideoManager::convertSeconds($totalSeconds, $type);
        } 
        else 
        {
            return "Error: Duration not found in video metadata.";
        }
    }

    public function getVideoPath(): string
    {
        return $this->videoPath;
    }

    public function setVideoPath(string $videoPath): void
    {
        $this->videoPath = $videoPath;
    }

    /**
    * Function to get video time in minutes
    * @param int Time in seconds
     * @param string $type Specifies what type you want to return, default Minutes : Seconds
     * Possible values:
     *   - 'seconds': returns video time in Seconds
     *   - 'minutes': returns video time as an array [Minutes, Seconds]
     *   - 'hours': return video time as an array [Hours, Minutes, Seconds]
     * @return mixed The video duration based on the specified type
    */
    public static function convertSeconds(int $time, string $type = 'minutes'): mixed
    {

        switch ($type)
        {
            case 'seconds':
                return $time;
            case 'minutes':
                $minutes = $time / 60;
                $seconds = $minutes - floor($minutes);
                $seconds *= 60;
                return [floor($minutes), $seconds];
            case 'hours':
                $hours = $time / 3600;
                $minutes = (($hours - floor($hours)) * 3600) / 60;
                $seconds = ($minutes - floor($minutes)) * 60;
                return [floor($hours), floor($minutes), $seconds];
            default:
                return [$time];
        }

    }

}