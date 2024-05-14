<?php

namespace App\Http\Controllers;

use App\Models\Border;
use Illuminate\Http\Request;

class BorderController extends Controller
{
    public function all()
    {
        return Border::all();
    }
}
