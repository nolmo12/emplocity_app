<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body class="antialiased">
        <div id="root">
            <h1>Video Title: {{ $video->languages()->first()->pivot->title }}</h1>
            <br>
            <h2>Video: <a href = 'https://sznyctube.eu/video/{{$video->reference_code }}'>Click here to watch</a></h2>
            <br>
            Description: {{ $video->languages()->first()->pivot->description }}
        </div>
    </body>
</html>
