<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use Illuminate\Http\Request;

class AssessmentController extends Controller
{
    public function index()
    {
        return response()->json(
            Assessment::with([
                'schoolClass',
                'subject',
                'questions.topic',
            ])->get()
        );
    }

    public function show(Assessment $assessment)
    {
        return response()->json(
            $assessment->load([
                'schoolClass',
                'subject',
                'questions.topic',
            ])
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'school_class_id' => ['required', 'exists:school_classes,id'],
            'subject_id' => ['required', 'exists:subjects,id'],
            'title' => ['required', 'string', 'max:255'],
            'type' => ['required', 'in:diagnostic,follow_up'],
        ]);

        $assessment = Assessment::create($data);

        return response()->json(
            $assessment->load([
                'schoolClass',
                'subject',
                'questions.topic',
            ]),
            201
        );
    }

    public function update(Request $request, Assessment $assessment)
    {
        $data = $request->validate([
            'school_class_id' => [
                'required',
                'exists:school_classes,id'
            ],
            'subject_id' => [
                'required',
                'exists:subjects,id'
            ],
            'title' => [
                'required',
                'string',
                'max:255'
            ],
            'type' => [
                'required',
                'in:diagnostic,follow_up'
            ],
        ]);

        $assessment->update($data);

        return response()->json(
            $assessment->load([
                'schoolClass',
                'subject',
                'questions.topic',
            ])
        );
    }

    public function destroy(Assessment $assessment)
    {
        $assessment->delete();

        return response()->json([
            'message' => 'Assessment deleted successfully.'
        ]);
    }
}