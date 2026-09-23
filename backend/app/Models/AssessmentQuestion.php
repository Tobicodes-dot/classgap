<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssessmentQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'assessment_id',
        'topic_id',
        'question',
        'max_score',
    ];

    public function assessment()
    {
        return $this->belongsTo(Assessment::class);
    }

    public function topic()
    {
        return $this->belongsTo(Topic::class);
    }
    public function results()
    {
        return $this->hasMany(AssessmentResult::class);
    }
}