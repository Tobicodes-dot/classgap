<?php

namespace App\Http\Controllers;

use App\Models\School;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Topic;
use App\Models\User;

class AdminController extends Controller
{
    public function dashboard()
    {
        return response()->json([
            'students' => Student::count(),
            'teachers' => User::where('role', 'teacher')->count(),
            'classes' => SchoolClass::count(),
            'subjects' => Subject::count(),
            'topics' => Topic::count(),
            'school' => School::first(),
        ]);
    }
}