<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    public function index()
    {
        return response()->json(
            Subject::with('school')->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'school_id' => ['required', 'exists:schools,id'],
            'name' => ['required', 'string', 'max:255'],
        ]);

        $subject = Subject::create($data);

        return response()->json(
            $subject->load('school'),
            201
        );
    }

    public function update(Request $request, Subject $subject)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $subject->update($data);

        return response()->json(
            $subject->load('school')
        );
    }

    public function destroy(Subject $subject)
    {
        $subject->delete();

        return response()->json([
            'message' => 'Subject deleted successfully.'
        ]);
    }
}