import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import {
  Target,
  Zap,
  CheckCircle2,
  Award,
  ArrowLeft,
  ArrowRight,
  CheckSquare,
  Sparkles,
} from "lucide-react";

export default function TakeTest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [assessment, setAssessment] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: { answerText: '', score: 8 } }
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resultModal, setResultModal] = useState(null);

  const studentId = user?.student?.id || 1;

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const response = await api.get(`/assessments/${id}`);
        setAssessment(response.data);

        // Initialize default answers
        const initialAnswers = {};
        response.data.questions?.forEach((q) => {
          initialAnswers[q.id] = {
            answerText: "",
            score: Math.round((Number(q.max_score) || 10) * 0.8), // Default sensible mark
          };
        });
        setAnswers(initialAnswers);
      } catch (error) {
        console.error("Failed to load test:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [id]);

  const questions = assessment?.questions || [];
  const currentQuestion = questions[currentIndex];

  const handleAnswerTextChange = (text) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        answerText: text,
      },
    }));
  };

  const handleScoreChange = (scoreVal) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        score: Number(scoreVal),
      },
    }));
  };

  const handleSubmitTest = async () => {
    if (!confirm("Are you ready to submit your assessment?")) return;

    setSubmitting(true);
    try {
      const payload = {
        student_id: studentId,
        results: questions.map((q) => ({
          assessment_question_id: q.id,
          score: answers[q.id]?.score !== undefined ? answers[q.id].score : Number(q.max_score) * 0.7,
        })),
      };

      await api.post("/assessment-results/batch", payload);

      // Calculate total score and topic breakdown
      const totalMax = questions.reduce((acc, q) => acc + (Number(q.max_score) || 10), 0);
      const totalObtained = questions.reduce((acc, q) => acc + (Number(answers[q.id]?.score) || 0), 0);
      const percentage = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;

      // Group by topic
      const topicScores = {};
      questions.forEach((q) => {
        const topicName = q.topic?.name || "General";
        if (!topicScores[topicName]) {
          topicScores[topicName] = { score: 0, max: 0 };
        }
        topicScores[topicName].score += Number(answers[q.id]?.score) || 0;
        topicScores[topicName].max += Number(q.max_score) || 10;
      });

      setResultModal({
        totalObtained,
        totalMax,
        percentage,
        topicScores,
      });
    } catch (error) {
      console.error("Failed to submit test:", error);
      alert("Failed to submit test results. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Preparing test environment...</p>
        </div>
      </div>
    );
  }

  if (!assessment || questions.length === 0) {
    return (
      <div className="mx-auto max-w-xl text-center py-16">
        <h2 className="text-xl font-bold text-slate-800">No questions in this assessment.</h2>
        <p className="mt-2 text-sm text-slate-500">The teacher has not added questions yet.</p>
        <Link
          to="/student/assessments"
          className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Assessments</span>
        </Link>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Top Test Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                assessment.type === "follow_up"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-indigo-100 text-indigo-800"
              }`}>
                {assessment.type === "follow_up" ? (
                  <Target className="h-3 w-3" />
                ) : (
                  <Zap className="h-3 w-3" />
                )}
                <span>{assessment.type === "follow_up" ? "Follow-up Test" : "Diagnostic Test"}</span>
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {assessment.subject?.name} · {assessment.school_class?.name}
              </span>
            </div>
            <h1 className="mt-1 text-xl font-black text-slate-900 sm:text-2xl">
              {assessment.title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (confirm("Exit test? Any unsaved answers may be lost.")) {
                  navigate("/student/assessments");
                }
              }}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Exit Test
            </button>

            <button
              onClick={handleSubmitTest}
              disabled={submitting}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition active:scale-95"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{submitting ? "Submitting..." : "Submit Test"}</span>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-600">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span>{progressPercent}% completed</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question Palette quick jumps */}
        <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          {questions.map((q, idx) => {
            const isAnswered = !!answers[q.id]?.answerText?.trim();
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`h-8 w-8 rounded-xl text-xs font-bold transition ${
                  isCurrent
                    ? "bg-emerald-600 text-white shadow-xs scale-105"
                    : isAnswered
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Question Card */}
      {currentQuestion && (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
              Topic: {currentQuestion.topic?.name || "Curriculum"}
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
              Max Score: {currentQuestion.max_score} pts
            </span>
          </div>

          <div className="rounded-2xl bg-slate-50 p-6 border border-slate-100">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Question {currentIndex + 1}
            </p>
            <p className="text-lg font-semibold text-slate-900 leading-relaxed">
              {currentQuestion.question}
            </p>
          </div>

          {/* Student Response Area */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Your Answer / Working:
              </label>
              <textarea
                rows={4}
                placeholder="Type your steps, final answer, or explanation here..."
                value={answers[currentQuestion.id]?.answerText || ""}
                onChange={(e) => handleAnswerTextChange(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* Simulated Score/Understanding selector */}
            <div className="rounded-2xl bg-emerald-50/50 p-4 border border-emerald-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-900">
                  Self-Evaluation / Score (Out of {currentQuestion.max_score} pts):
                </span>
                <span className="text-sm font-black text-emerald-700">
                  {answers[currentQuestion.id]?.score ?? 8} / {currentQuestion.max_score} pts
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={Number(currentQuestion.max_score) || 10}
                step="1"
                value={answers[currentQuestion.id]?.score ?? 8}
                onChange={(e) => handleScoreChange(e.target.value)}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0 (Needs revision)</span>
                <span>5 (Partial)</span>
                <span>{currentQuestion.max_score} (Full marks)</span>
              </div>
            </div>
          </div>

          {/* Stepper buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
              >
                <span>Next Question</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmitTest}
                disabled={submitting}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition active:scale-95"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{submitting ? "Submitting..." : "Finish & Submit Test"}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Result Celebration Modal */}
      {resultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl text-center space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-600">
              <Award className="h-8 w-8" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Assessment Submitted
              </span>
              <h2 className="mt-1 text-2xl font-black text-slate-900">
                Diagnostic Result Summary
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Your answers have been recorded in the ClassGap Learning Intelligence Engine.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-6 border border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase">Overall Score</p>
              <p className="text-4xl font-black text-emerald-600 mt-1">
                {resultModal.percentage}%
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {resultModal.totalObtained} / {resultModal.totalMax} points
              </p>
            </div>

            {/* Topic performance breakdown */}
            <div className="text-left space-y-2">
              <p className="text-xs font-bold uppercase text-slate-700">Topic Mastery Breakdown:</p>
              <div className="space-y-2">
                {Object.entries(resultModal.topicScores).map(([topic, data]) => {
                  const topicPercent = data.max > 0 ? Math.round((data.score / data.max) * 100) : 0;
                  const isGap = topicPercent < 50;
                  return (
                    <div
                      key={topic}
                      className="flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-100 text-xs"
                    >
                      <div>
                        <p className="font-bold text-slate-800">{topic}</p>
                        <p className="text-[11px] text-slate-400">{data.score} / {data.max} pts</p>
                      </div>

                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        isGap ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                      }`}>
                        {isGap ? `Learning Gap (${topicPercent}%)` : `Mastered (${topicPercent}%)`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Link
                to="/student/progress"
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition"
              >
                <span>View Full Mastery & Growth Journey</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/student/assessments"
                className="w-full rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Back to Assessments
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
