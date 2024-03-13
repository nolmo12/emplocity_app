<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class StorageController extends Controller
{
    public function find($type, $asset)
    {
        return [asset("storage/$type/$asset")];
    }
}
