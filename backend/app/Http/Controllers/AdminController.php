<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\InterventionPlan;
use App\Models\School;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\Topic;
use App\Models\User;

class AdminController extends Controller
{
    public function dashboard()
    {
        $studentsCount = Student::count();
        $teachersCount = Teacher::count();
        $classesCount = SchoolClass::count();
        $subjectsCount = Subject::count();
        $topicsCount = Topic::count();
        $assessmentsCount = Assessment::count();
        $interventionsCount = InterventionPlan::count();

        return response()->json([
            'students' => $studentsCount,
            'students_count' => $studentsCount,
            'teachers' => $teachersCount,
            'teachers_count' => $teachersCount,
            'classes' => $classesCount,
            'classes_count' => $classesCount,
            'subjects' => $subjectsCount,
            'subjects_count' => $subjectsCount,
            'topics' => $topicsCount,
            'topics_count' => $topicsCount,
            'assessments' => $assessmentsCount,
            'assessments_count' => $assessmentsCount,
            'interventions' => $interventionsCount,
            'interventions_count' => $interventionsCount,
            'school' => School::first(),
            'recent_students' => Student::with(['user', 'schoolClass'])->latest()->take(5)->get(),
            'recent_assessments' => Assessment::with(['schoolClass', 'subject'])->latest()->take(5)->get(),
        ]);
    }
}