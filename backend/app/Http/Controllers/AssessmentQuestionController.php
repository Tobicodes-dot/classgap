<?php

namespace App\Http\Controllers;

use App\Models\AssessmentQuestion;
use Illuminate\Http\Request;

class AssessmentQuestionController extends Controller
{
    public function index()
    {
        return response()->json(
            AssessmentQuestion::with([
                'assessment',
                'topic'
            ])->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'assessment_id' => [
                'required',
                'exists:assessments,id'
            ],
            'topic_id' => [
                'required',
                'exists:topics,id'
            ],
            'question' => [
                'required',
                'string'
            ],
            'max_score' => [
                'required',
                'numeric',
                'min:1'
            ],
        ]);

        $question = AssessmentQuestion::create($data);

        return response()->json(
            $question->load([
                'assessment',
                'topic'
            ]),
            201
        );
    }

    public function update(Request $request, AssessmentQuestion $assessmentQuestion)
    {
        $data = $request->validate([
            'topic_id' => [
                'required',
                'exists:topics,id'
            ],
            'question' => [
                'required',
                'string'
            ],
            'max_score' => [
                'required',
                'numeric',
                'min:1'
            ],
        ]);

        $assessmentQuestion->update($data);

        return response()->json(
            $assessmentQuestion->load([
                'assessment',
                'topic'
            ])
        );
    }

    public function destroy(AssessmentQuestion $assessmentQuestion)
    {
        $assessmentQuestion->delete();

        return response()->json([
            'message' => 'Question deleted successfully.'
        ]);
    }
}