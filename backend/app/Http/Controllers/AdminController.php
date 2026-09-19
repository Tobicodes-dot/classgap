<?php

namespace App\Http\Controllers;

use App\Models\School;
use App\Models\SchoolClass;
use App\Models\students;
use App\Models\subject;
use App\Models\user;



class AdminController extends Controller
{
    public function dashboard() {
        return response()->json([
            'students' => student::count(),
            'teachers' => user::where('role', 'teacher')->count(),
            'classes' => SchoolClass::count(),
            'subjects' => subject::count(),
            'schools' => School::first(),
        ]);
    }
}
