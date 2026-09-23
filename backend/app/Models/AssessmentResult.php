<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssessmentResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'assessment_question_id',
        'score',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function assessmentQuestion()
    {
        return $this->belongsTo(AssessmentQuestion::class);
    }
}