<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('assessment_results', function (Blueprint $table) {
        $table->id();

        $table->foreignId('student_id')
            ->constrained('students')
            ->cascadeOnDelete();

        $table->foreignId('assessment_question_id')
            ->constrained('assessment_questions')
            ->cascadeOnDelete();

        $table->decimal('score', 5, 2);

        $table->timestamps();

        $table->unique([
            'student_id',
            'assessment_question_id'
        ]);
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assessment_results');
    }
};
