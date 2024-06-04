<?php
namespace App\Helpers;

use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Concerns\InteractsWithInput;
use Illuminate\Http\Request;

class FileRequestManager
{
    private Request $request;
    private string $fileName;
    public function __construct(Request $request, string $fileName)
    {
        $this->request = $request;
        $this->fileName = $fileName;
    }

    public function getHashName() : string
    {
        $name = hash(
            'sha256',
            $this->request
            ->file($this->fileName)
            ->getClientOriginalName()) . date("Y-m-d h:i:sa") .'.'. 
            $this->request
            ->file($this->fileName)
            ->extension();
        return $name;
    }

    public function save($path) : string
    {
        $finalPath = $this->request->file($this->fileName)->storeAs($path, $this->getHashName());
        return $finalPath;
    }

    public function move($path)
    {
        $this->request->file($this->fileName)->move(public_path($path), $this->getHashName());
    }

    public function getFile()
    {
        return $this->request->file($this->fileName);
    }

    public function setFile(Request $request)
    {
        $this->request = $request;
    }
}