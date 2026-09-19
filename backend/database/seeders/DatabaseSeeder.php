<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $school = \App\Models\School::create([
            'name' => 'ClassGap Demo School',
        ]);

        $class = \App\Models\SchoolClass::create([
            'school_id' => $school->id,
            'name' => 'JSS 2',
        ]);

        $subject = \App\Models\Subject::create([
            'school_id' => $school->id,
            'name' => 'Mathematics',
        ]);

        $topics = [
            'Fractions',
            'Algebra',
            'Word Problems',
            'Decimals',
            'Basic Geometry',
        ];

        foreach ($topics as $topic) {
            \App\Models\Topic::create([
                'subject_id' => $subject->id,
                'name' => $topic,
            ]);
        }
    }
}
