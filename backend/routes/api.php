<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ClassController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\TopicController;
use App\Http\Controllers\AssessmentController;
use App\Http\Controllers\AssessmentQuestionController;
use App\Http\Controllers\AssessmentResultController;
use App\Http\Controllers\LearningGapController;
use App\Http\Controllers\InterventionPlanController;
use App\Http\Controllers\StudentProgressController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Admin Dashboard
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
    
    // Teacher Dashboard
    Route::get('/teacher/dashboard', [TeacherController::class, 'dashboard']);

    // Class Routes
    Route::get('/classes', [ClassController::class, 'index']);
    Route::post('/classes', [ClassController::class, 'store']);
    Route::put('/classes/{schoolClass}', [ClassController::class, 'update']);
    Route::delete('/classes/{schoolClass}', [ClassController::class, 'destroy']);

    // Teacher Routes
    Route::get('/teachers', [TeacherController::class, 'index']);
    Route::post('/teachers', [TeacherController::class, 'store']);
    Route::put('/teachers/{teacher}', [TeacherController::class, 'update']);
    Route::delete('/teachers/{teacher}', [TeacherController::class, 'destroy']);

    // Students Routes
    Route::get('/students', [StudentController::class, 'index']);
    Route::post('/students', [StudentController::class, 'store']);
    Route::put('/students/{student}', [StudentController::class, 'update']);
    Route::delete('/students/{student}', [StudentController::class, 'destroy']);

    // Subjects Routes
    Route::get('/subjects', [SubjectController::class, 'index']);
    Route::post('/subjects', [SubjectController::class, 'store']);
    Route::put('/subjects/{subject}', [SubjectController::class, 'update']);
    Route::delete('/subjects/{subject}', [SubjectController::class, 'destroy']);

    // Topics Routes
    Route::get('/topics', [TopicController::class, 'index']);
    Route::post('/topics', [TopicController::class, 'store']);
    Route::put('/topics/{topic}', [TopicController::class, 'update']);
    Route::delete('/topics/{topic}', [TopicController::class, 'destroy']);

    // Assessments Routes
    Route::get('/assessments', [AssessmentController::class, 'index']);
    Route::post('/assessments', [AssessmentController::class, 'store']);
    Route::get('/assessments/{assessment}', [AssessmentController::class, 'show']);
    Route::put('/assessments/{assessment}', [AssessmentController::class, 'update']);
    Route::delete('/assessments/{assessment}', [AssessmentController::class, 'destroy']);

    // Assessment Questions Routes
    Route::get('/assessment-questions', [AssessmentQuestionController::class, 'index']);
    Route::post('/assessment-questions', [AssessmentQuestionController::class, 'store']);
    Route::put('/assessment-questions/{assessmentQuestion}', [AssessmentQuestionController::class, 'update']);
    Route::delete('/assessment-questions/{assessmentQuestion}', [AssessmentQuestionController::class, 'destroy']);

    // Assessment Results Routes
    Route::get('/assessment-results', [AssessmentResultController::class, 'index']);
    Route::post('/assessment-results', [AssessmentResultController::class, 'store']);
    Route::post('/assessment-results/batch', [AssessmentResultController::class, 'batchStore']);
    Route::delete('/assessment-results/{assessmentResult}', [AssessmentResultController::class, 'destroy']);

    // Learning Gaps Routes
    Route::get('/students/{student}/learning-gaps', [LearningGapController::class, 'student']);

    // Intervention Plan Routes
    Route::get('/students/{student}/interventions', [InterventionPlanController::class, 'index']);
    Route::post('/students/{student}/interventions', [InterventionPlanController::class, 'store']);
    Route::put('/interventions/{interventionPlan}/status', [InterventionPlanController::class, 'updateStatus']);

    // Student Progress Routes
    Route::get('/students/{student}/progress', [StudentProgressController::class, 'show']);
});
