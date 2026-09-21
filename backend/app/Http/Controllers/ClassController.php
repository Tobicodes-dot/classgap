<?php

namespace App\Http\Controllers;

use App\Models\SchoolClass;
use Illuminate\Http\Request;

class ClassController extends Controller
{
    public function index()
    {
        return response()->json(
            SchoolClass::with('school')->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'school_id' => ['required', 'exists:schools,id'],
            'name' => ['required', 'string', 'max:255'],
        ]);

        $class = SchoolClass::create($data);

        return response()->json($class, 201);
    }

    public function update(Request $request, SchoolClass $schoolClass)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $schoolClass->update($data);

        return response()->json($schoolClass);
    }

    public function destroy(SchoolClass $schoolClass)
    {
        $schoolClass->delete();

        return response()->json([
            'message' => 'Class deleted successfully.'
        ]);
    }
}