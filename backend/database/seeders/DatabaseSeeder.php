<?php

namespace Database\Seeders;

use App\Models\Assessment;
use App\Models\AssessmentQuestion;
use App\Models\AssessmentResult;
use App\Models\InterventionPlan;
use App\Models\School;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\Topic;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $school = School::firstOrCreate(
            ['name' => 'ClassGap Demo School']
        );

        $jss1 = SchoolClass::firstOrCreate(['school_id' => $school->id, 'name' => 'JSS 1']);
        $jss2 = SchoolClass::firstOrCreate(['school_id' => $school->id, 'name' => 'JSS 2']);
        $jss3 = SchoolClass::firstOrCreate(['school_id' => $school->id, 'name' => 'JSS 3']);
        $sss1 = SchoolClass::firstOrCreate(['school_id' => $school->id, 'name' => 'SSS 1']);

        // Subjects & Topics
        $math = Subject::firstOrCreate(['school_id' => $school->id, 'name' => 'Mathematics']);
        $english = Subject::firstOrCreate(['school_id' => $school->id, 'name' => 'English Language']);
        $science = Subject::firstOrCreate(['school_id' => $school->id, 'name' => 'Basic Science']);

        $mathTopics = ['Fractions', 'Algebra', 'Word Problems', 'Decimals', 'Basic Geometry'];
        $createdMathTopics = [];
        foreach ($mathTopics as $name) {
            $createdMathTopics[$name] = Topic::firstOrCreate([
                'subject_id' => $math->id,
                'name' => $name,
            ]);
        }

        $englishTopics = ['Grammar & Tenses', 'Reading Comprehension', 'Vocabulary & Antonyms'];
        foreach ($englishTopics as $name) {
            Topic::firstOrCreate([
                'subject_id' => $english->id,
                'name' => $name,
            ]);
        }

        $scienceTopics = ['Living Organisms', 'Forces & Energy', 'Matter & Chemical Reactions'];
        foreach ($scienceTopics as $name) {
            Topic::firstOrCreate([
                'subject_id' => $science->id,
                'name' => $name,
            ]);
        }

        // 1. Admin User
        User::updateOrCreate(
            ['email' => 'admin@classgap.test'],
            [
                'name' => 'ClassGap Administrator',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        // 2. Teacher User & Record
        User::updateOrCreate(
            ['email' => 'teacher@classgap.test'],
            [
                'name' => 'Mr. David Okon',
                'password' => Hash::make('password'),
                'role' => 'teacher',
            ]
        );

        Teacher::updateOrCreate(
            ['email' => 'teacher@classgap.test'],
            [
                'school_id' => $school->id,
                'name' => 'Mr. David Okon',
            ]
        );

        // Also ensure davis@gmail.com has user account if exists
        User::updateOrCreate(
            ['email' => 'davis@gmail.com'],
            [
                'name' => 'Mr. David',
                'password' => Hash::make('password'),
                'role' => 'teacher',
            ]
        );
        Teacher::updateOrCreate(
            ['email' => 'davis@gmail.com'],
            [
                'school_id' => $school->id,
                'name' => 'Mr. David',
            ]
        );

        // 3. Students
        $johnUser = User::updateOrCreate(
            ['email' => 'john@student.classgap.test'],
            [
                'name' => 'John Doe',
                'password' => Hash::make('password'),
                'role' => 'student',
            ]
        );

        $johnStudent = Student::updateOrCreate(
            ['user_id' => $johnUser->id],
            [
                'school_id' => $school->id,
                'school_class_id' => $jss2->id,
            ]
        );

        $janeUser = User::updateOrCreate(
            ['email' => 'jane@student.classgap.test'],
            [
                'name' => 'Jane Smith',
                'password' => Hash::make('password'),
                'role' => 'student',
            ]
        );

        $janeStudent = Student::updateOrCreate(
            ['user_id' => $janeUser->id],
            [
                'school_id' => $school->id,
                'school_class_id' => $jss2->id,
            ]
        );

        $samUser = User::updateOrCreate(
            ['email' => 'samuel@student.classgap.test'],
            [
                'name' => 'Samuel Adebayo',
                'password' => Hash::make('password'),
                'role' => 'student',
            ]
        );

        $samStudent = Student::updateOrCreate(
            ['user_id' => $samUser->id],
            [
                'school_id' => $school->id,
                'school_class_id' => $jss2->id,
            ]
        );

        // 4. Diagnostic Assessment
        $diagnostic = Assessment::firstOrCreate(
            [
                'school_class_id' => $jss2->id,
                'subject_id' => $math->id,
                'type' => 'diagnostic',
            ],
            [
                'title' => 'JSS 2 Mathematics Diagnostic Assessment',
            ]
        );

        $diagQuestions = [
            ['topic' => 'Fractions', 'question' => 'What is 3/4 + 1/8? Simplify your answer.', 'max_score' => 10],
            ['topic' => 'Algebra', 'question' => 'Solve for x: 2x + 5 = 15.', 'max_score' => 10],
            ['topic' => 'Word Problems', 'question' => 'A book costs ₦500. If you buy 3 books and pay with a ₦2,000 note, how much change do you receive?', 'max_score' => 10],
            ['topic' => 'Decimals', 'question' => 'Calculate 4.5 × 2.4 without a calculator.', 'max_score' => 10],
            ['topic' => 'Basic Geometry', 'question' => 'What is the area and perimeter of a rectangle with length 8 cm and width 5 cm?', 'max_score' => 10],
        ];

        $createdDiagQuestions = [];
        foreach ($diagQuestions as $q) {
            $createdDiagQuestions[] = AssessmentQuestion::firstOrCreate(
                [
                    'assessment_id' => $diagnostic->id,
                    'question' => $q['question'],
                ],
                [
                    'topic_id' => $createdMathTopics[$q['topic']]->id,
                    'max_score' => $q['max_score'],
                ]
            );
        }

        // 5. Follow-up Assessment
        $followUp = Assessment::firstOrCreate(
            [
                'school_class_id' => $jss2->id,
                'subject_id' => $math->id,
                'type' => 'follow_up',
            ],
            [
                'title' => 'JSS 2 Mathematics Post-Intervention Follow-up',
            ]
        );

        $followQuestions = [
            ['topic' => 'Fractions', 'question' => 'Evaluate 2/3 - 1/6 and express as a fraction in lowest terms.', 'max_score' => 10],
            ['topic' => 'Word Problems', 'question' => 'A farmer has 24 oranges and shares them equally among 6 children. How many oranges does each child receive?', 'max_score' => 10],
            ['topic' => 'Basic Geometry', 'question' => 'Find the area of a rectangle with length 10 cm and width 6 cm.', 'max_score' => 10],
        ];

        $createdFollowQuestions = [];
        foreach ($followQuestions as $q) {
            $createdFollowQuestions[] = AssessmentQuestion::firstOrCreate(
                [
                    'assessment_id' => $followUp->id,
                    'question' => $q['question'],
                ],
                [
                    'topic_id' => $createdMathTopics[$q['topic']]->id,
                    'max_score' => $q['max_score'],
                ]
            );
        }

        // 6. Sample Assessment Results for John (showing baseline diagnostic vs follow-up)
        // Diagnostic: Fractions (3/10 - gap), Algebra (8/10), Word Problems (4/10 - gap), Decimals (7/10), Geometry (8/10)
        $johnDiagScores = [3, 8, 4, 7, 8];
        foreach ($createdDiagQuestions as $index => $question) {
            if (isset($johnDiagScores[$index])) {
                AssessmentResult::updateOrCreate(
                    [
                        'student_id' => $johnStudent->id,
                        'assessment_question_id' => $question->id,
                    ],
                    [
                        'score' => $johnDiagScores[$index],
                    ]
                );
            }
        }

        // Follow-up for John (showing improvement after intervention!)
        // Fractions (8/10 - +50%), Word Problems (9/10 - +50%), Geometry (10/10)
        $johnFollowScores = [8, 9, 10];
        foreach ($createdFollowQuestions as $index => $question) {
            if (isset($johnFollowScores[$index])) {
                AssessmentResult::updateOrCreate(
                    [
                        'student_id' => $johnStudent->id,
                        'assessment_question_id' => $question->id,
                    ],
                    [
                        'score' => $johnFollowScores[$index],
                    ]
                );
            }
        }

        // 7. Sample Intervention Plans for John
        InterventionPlan::updateOrCreate(
            [
                'student_id' => $johnStudent->id,
                'topic_id' => $createdMathTopics['Fractions']->id,
            ],
            [
                'identified_gap' => 'Struggles with finding common denominators when adding dissimilar fractions.',
                'recommendation' => 'Provide visual fraction bars and 15 targeted practice exercises on LCM.',
                'activity' => 'Interactive fraction shading worksheets and peer-assisted problem solving.',
                'status' => 'completed',
            ]
        );

        InterventionPlan::updateOrCreate(
            [
                'student_id' => $johnStudent->id,
                'topic_id' => $createdMathTopics['Word Problems']->id,
            ],
            [
                'identified_gap' => 'Difficulty translating multi-step real world scenarios into mathematical operations.',
                'recommendation' => 'Teach the 4-step Polya problem-solving heuristic (Understand, Plan, Solve, Check).',
                'activity' => 'Highlighting key operational keywords (sum, product, difference, per) in sentence problems.',
                'status' => 'in_progress',
            ]
        );
    }
}
