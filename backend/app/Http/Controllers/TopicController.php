<?php

namespace App\Http\Controllers;

use App\Models\Topic;
use Illuminate\Http\Request;

class TopicController extends Controller
{
    public function index()
    {
        return response()->json(
            Topic::with('subject')->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'subject_id' => ['required', 'exists:subjects,id'],
            'name' => ['required', 'string', 'max:255'],
        ]);

        $topic = Topic::create($data);

        return response()->json(
            $topic->load('subject'),
            201
        );
    }

    public function update(Request $request, Topic $topic)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $topic->update($data);

        return response()->json(
            $topic->load('subject')
        );
    }

    public function destroy(Topic $topic)
    {
        $topic->delete();

        return response()->json([
            'message' => 'Topic deleted successfully.'
        ]);
    }
}