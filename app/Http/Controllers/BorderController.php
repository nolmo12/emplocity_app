<?php

namespace App\Http\Controllers;

use App\Models\Border;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BorderController extends Controller
{
    public function all()
    {
        return Border::all();
    }

    public function getUserBorders(Request $request)
    {
        $borders = $request->user()->borders;
        
        return response()->json([
            'success' => true,
            'borders' => $borders
        ]);
        
    }
}
