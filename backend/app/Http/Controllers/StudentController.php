<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'school_id' => ['required', 'exists:schools,id'],
            'school_class_id' => ['required', 'exists:school_classes,id'],
        ]);

        $student = DB::transaction(function () use ($data) {
            $user = \App\Models\User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $data['password'],
                'role' => 'student',
            ]);

            return Student::create([
                'user_id' => $user->id,
                'school_id' => $data['school_id'],
                'school_class_id' => $data['school_class_id'],
            ]);
        });

        return response()->json(
            $student->load(['user', 'school', 'schoolClass']),
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