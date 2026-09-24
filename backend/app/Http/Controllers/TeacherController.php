<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\InterventionPlan;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\Topic;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TeacherController extends Controller
{
    public function index()
    {
        return response()->json(
            Teacher::with('school')->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'school_id' => ['required', 'exists:schools,id'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:teachers,email'],
            'password' => ['nullable', 'string', 'min:6'],
        ]);

        $teacher = DB::transaction(function () use ($data, $request) {
            User::updateOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'password' => $request->input('password', 'password'),
                    'role' => 'teacher',
                ]
            );

            return Teacher::create([
                'school_id' => $data['school_id'],
                'name' => $data['name'],
                'email' => $data['email'],
            ]);
        });

        return response()->json($teacher->load('school'), 201);
    }

    public function update(Request $request, Teacher $teacher)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                'unique:teachers,email,' . $teacher->id,
            ],
        ]);

        DB::transaction(function () use ($teacher, $data) {
            $oldEmail = $teacher->email;
            $teacher->update($data);

            $user = User::where('email', $oldEmail)->first();
            if ($user) {
                $user->update([
                    'name' => $data['name'],
                    'email' => $data['email'],
                ]);
            }
        });

        return response()->json($teacher->load('school'));
    }

    public function destroy(Teacher $teacher)
    {
        DB::transaction(function () use ($teacher) {
            User::where('email', $teacher->email)->where('role', 'teacher')->delete();
            $teacher->delete();
        });

        return response()->json([
            'message' => 'Teacher deleted successfully.'
        ]);
    }

    public function dashboard(Request $request)
    {
        $totalStudents = Student::count();
        $totalAssessments = Assessment::count();
        $totalInterventions = InterventionPlan::count();
        $classes = SchoolClass::with('school')->get();
        $subjects = Subject::with('topics')->get();
        $recentAssessments = Assessment::with(['schoolClass', 'subject', 'questions.topic'])->latest()->take(5)->get();
        $pendingInterventions = InterventionPlan::with(['student.user', 'topic'])->where('status', '!=', 'completed')->take(6)->get();

        return response()->json([
            'stats' => [
                'total_students' => $totalStudents,
                'total_assessments' => $totalAssessments,
                'total_interventions' => $totalInterventions,
                'classes_count' => $classes->count(),
            ],
            'classes' => $classes,
            'subjects' => $subjects,
            'recent_assessments' => $recentAssessments,
            'pending_interventions' => $pendingInterventions,
        ]);
    }
}