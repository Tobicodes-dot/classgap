<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index()
    {
        return response()->json(
            Student::with([
                'user',
                'school',
                'schoolClass'
            ])->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'school_id' => ['required', 'exists:schools,id'],
            'school_class_id' => ['required', 'exists:school_classes,id'],
        ]);

        $student = Student::create($data);

        return response()->json(
            $student->load([
                'user',
                'school',
                'schoolClass'
            ]),
            201
        );
    }

    public function update(Request $request, Student $student)
    {
        $data = $request->validate([
            'school_class_id' => [
                'required',
                'exists:school_classes,id'
            ],
        ]);

        $student->update($data);

        return response()->json(
            $student->load([
                'user',
                'school',
                'schoolClass'
            ])
        );
    }

    public function destroy(Student $student)
    {
        $student->delete();

        return response()->json([
            'message' => 'Student deleted successfully.'
        ]);
    }    
}