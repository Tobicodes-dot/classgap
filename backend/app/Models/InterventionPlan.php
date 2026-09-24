<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InterventionPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'topic_id',
        'identified_gap',
        'recommendation',
        'activity',
        'status',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function topic()
    {
        return $this->belongsTo(Topic::class);
    }
}