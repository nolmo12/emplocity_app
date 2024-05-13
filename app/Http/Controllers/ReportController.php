<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Video;
use App\Models\Comment;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Policies\ReportPolicy;

class ReportController extends Controller
{
    /**
     * Create a report for a user.
     */
    public function userReport(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'description' => 'required|string',
                'id' => 'required|exists:users,id',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 400);
            }

            $authorization = $this->authorize('create', Report::class);

            if ($authorization->denied()) {
                return response()->json(['error' => $authorization->message()], 401);
            }

            $report = new Report();
            $report->type = 'User';
            $report->description = $request->description;
            $report->reportable_id = $request->id;
            $report->reportable_type = User::class;
            $report->save();

            return response()->json([
                'status' => true,
                'message' => 'Report created successfully'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'error' => $e->getMessage()], 500);
        }
    }

    public function videoReport(Request $request, $reference_code)
    {
        try {
            $validator = Validator::make($request->all(), [
                'description' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 400);
            }

            $authorization = $this->authorize('create', Report::class);

            if ($authorization->denied()) {
                return response()->json(['error' => $authorization->message()], 401);
            }

            $video = Video::where('reference_code', $reference_code)->first();

            if (!$video) {
                return response()->json(['error' => 'Video not found'], 404);
            }

            $report = new Report();
            $report->type = 'Video';
            $report->description = $request->description;
            $report->reportable_id =  $video->id;
            $report->reportable_type = Video::class;
            $report->save();

            return response()->json([
                'status' => true,
                'message' => 'Report created successfully'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'error' => $e->getMessage()], 500);
        }
    }

    public function commentReport(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'description' => 'required|string',
                'id' => 'required|exists:comments,id',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 400);
            }

            $authorization = $this->authorize('create', Report::class);

            if ($authorization->denied()) {
                return response()->json(['error' => $authorization->message()], 401);
            }

            $report = new Report();
            $report->type = 'Comment';
            $report->description = $request->description;
            $report->reportable_id = $request->id;
            $report->reportable_type = Comment::class;
            $report->save();

            return response()->json([
                'status' => true,
                'message' => 'Report created successfully'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'error' => $e->getMessage()], 500);
        }
    }

    public function read(Request $request)
    {
        try {
            $reports = Report::all();
    
         
            $allRelatedData = [];
            foreach ($reports as $report) {
                switch ($report->reportable_type) {
                    case User::class:
                        $relatedData = User::where('id', $report->reportable_id)->first();
                        break;
                    case Video::class:
                        $relatedData = Video::where('id', $report->reportable_id)->with('user')->first();
                        break;
                    case Comment::class:
                        $relatedData = Comment::where('id', $report->reportable_id)->with('user', 'video')->first();
                        break;
               
                }
                $allRelatedData[] = [
                    'report' => $report,
                    'related_data' => $relatedData,
                ];
            }
    
            return response()->json([
                'status' => true,
                'reports' => $allRelatedData,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function delete(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'id' => 'required|int',
            ]);


            $report = Report::find($request->id);

            if (!$report) {
                return response()->json([
                    'status' => false,
                    'error' => 'Report not found'
                ], 404);
            }

            // $this->authorize('delete', $report);

            $report->delete();


            return response()->json([
                'status' => true,
                'message' => 'Report deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
