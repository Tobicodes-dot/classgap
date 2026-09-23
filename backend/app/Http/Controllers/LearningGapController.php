<?php

namespace App\Http\Controllers;

use App\Models\AssessmentResult;
use App\Models\Student;

class LearningGapController extends Controller
{
    public function student(Student $student)
    {
        $results = AssessmentResult::with([
            'assessmentQuestion.topic'
        ])
        ->where('student_id', $student->id)
        ->get();

        $topicPerformance = $results
            ->groupBy(function ($result) {
                return $result->assessmentQuestion->topic_id;
            })
            ->map(function ($topicResults) {
                $totalScore = $topicResults->sum('score');

                $maxScore = $topicResults->sum(function ($result) {
                    return $result->assessmentQuestion->max_score;
                });

                $percentage = $maxScore > 0
                    ? round(($totalScore / $maxScore) * 100, 2)
                    : 0;

                $topic = $topicResults
                    ->first()
                    ->assessmentQuestion
                    ->topic;

                return [
                    'topic_id' => $topic->id,
                    'topic' => $topic->name,
                    'score' => $totalScore,
                    'max_score' => $maxScore,
                    'percentage' => $percentage,
                    'is_gap' => $percentage < 50,
                ];
            })
            ->values();

        return response()->json([
            'student' => [
                'id' => $student->id,
                'name' => $student->user->name,
            ],
            'learning_gaps' => $topicPerformance
                ->where('is_gap', true)
                ->values(),
            'topic_performance' => $topicPerformance,
        ]);
    }
}