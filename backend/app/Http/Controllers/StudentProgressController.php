<?php

namespace App\Http\Controllers;

use App\Models\AssessmentResult;
use App\Models\Student;

class StudentProgressController extends Controller
{
    public function show(Student $student)
    {
        $results = AssessmentResult::with([
            'assessmentQuestion.assessment',
            'assessmentQuestion.topic',
        ])
        ->where('student_id', $student->id)
        ->get();

        $performance = $results
            ->groupBy(function ($result) {
                return $result->assessmentQuestion->topic_id;
            })
            ->map(function ($topicResults) {

                $topic = $topicResults
                    ->first()
                    ->assessmentQuestion
                    ->topic;

                $diagnostic = $topicResults->filter(
                    fn ($result) =>
                        $result->assessmentQuestion->assessment->type
                        === 'diagnostic'
                );

                $followUp = $topicResults->filter(
                    fn ($result) =>
                        $result->assessmentQuestion->assessment->type
                        === 'follow_up'
                );

                $calculatePercentage = function ($results) {
                    $score = $results->sum('score');

                    $max = $results->sum(
                        fn ($result) =>
                            $result->assessmentQuestion->max_score
                    );

                    return $max > 0
                        ? round(($score / $max) * 100, 2)
                        : null;
                };

                $before = $calculatePercentage($diagnostic);
                $after = $calculatePercentage($followUp);

                return [
                    'topic_id' => $topic->id,
                    'topic' => $topic->name,
                    'before' => $before,
                    'after' => $after,
                    'improvement' =>
                        $before !== null && $after !== null
                            ? round($after - $before, 2)
                            : null,
                ];
            })
            ->values();

        return response()->json([
            'student' => [
                'id' => $student->id,
                'name' => $student->user->name,
            ],
            'progress' => $performance,
        ]);
    }
}