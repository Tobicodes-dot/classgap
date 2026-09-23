<?php

namespace App\Http\Controllers;

use App\Models\AssessmentResult;
use Illuminate\Http\Request;

class AssessmentResultController extends Controller
{
    public function index()
    {
        return response()->json(
            AssessmentResult::with([
                'student.user',
                'assessmentQuestion.topic'
            ])->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'student_id' => [
                'required',
                'exists:students,id'
            ],
            'assessment_question_id' => [
                'required',
                'exists:assessment_questions,id'
            ],
            'score' => [
                'required',
                'numeric',
                'min:0'
            ],
        ]);

        $question = \App\Models\AssessmentQuestion::findOrFail(
            $data['assessment_question_id']
        );

        if ($data['score'] > $question->max_score) {
            return response()->json([
                'message' => 'Score cannot exceed the maximum score.'
            ], 422);
        }

        $result = AssessmentResult::updateOrCreate(
            [
                'student_id' => $data['student_id'],
                'assessment_question_id' => $data['assessment_question_id'],
            ],
            [
                'score' => $data['score'],
            ]
        );

        return response()->json(
            $result->load([
                'student.user',
                'assessmentQuestion.topic'
            ]),
            201
        );
    }

    public function destroy(AssessmentResult $assessmentResult)
    {
        $assessmentResult->delete();

        return response()->json([
            'message' => 'Result deleted successfully.'
        ]);
    }
}