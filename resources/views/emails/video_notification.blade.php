<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body class="antialiased">
        <div id="root">
            Video Title: {{ $video->languages()->first()->pivot->title }}
            <br>
            Video: {{ url('watch/'.$video->reference_code) }}
            <br>
            Description: {{ $video->languages()->first()->pivot->description }}
        </div>
    </body>
</html>
