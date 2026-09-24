<?php

namespace App\Http\Controllers;

use App\Models\InterventionPlan;
use App\Models\Student;
use Illuminate\Http\Request;

class InterventionPlanController extends Controller
{
    public function index(Student $student)
    {
        return response()->json(
            InterventionPlan::with('topic')
                ->where('student_id', $student->id)
                ->get()
        );
    }

    public function store(Request $request, Student $student)
    {
        $data = $request->validate([
            'topic_id' => [
                'required',
                'exists:topics,id'
            ],
            'identified_gap' => [
                'required',
                'string'
            ],
            'recommendation' => [
                'required',
                'string'
            ],
            'activity' => [
                'required',
                'string'
            ],
        ]);

        $plan = InterventionPlan::updateOrCreate(
            [
                'student_id' => $student->id,
                'topic_id' => $data['topic_id'],
            ],
            [
                'identified_gap' => $data['identified_gap'],
                'recommendation' => $data['recommendation'],
                'activity' => $data['activity'],
                'status' => 'pending',
            ]
        );

        return response()->json(
            $plan->load('topic'),
            201
        );
    }

    public function updateStatus(
        Request $request,
        InterventionPlan $interventionPlan
    ) {
        $data = $request->validate([
            'status' => [
                'required',
                'in:pending,in_progress,completed'
            ],
        ]);

        $interventionPlan->update($data);

        return response()->json(
            $interventionPlan->load('topic')
        );
    }
}