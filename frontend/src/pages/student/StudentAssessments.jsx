import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { Target, Zap, ArrowRight, BookOpen } from "lucide-react";

export default function StudentAssessments() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await api.get("/assessments");
        setAssessments(response.data);
      } catch (error) {
        console.error("Failed to load assessments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
          Evaluations & Quizzes
        </span>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Class Assessments
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Take your diagnostic assessments to discover learning gaps, or complete follow-up tests to prove mastery.
        </p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-400">
          Loading assigned assessments...
        </div>
      ) : assessments.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-400">
          No assessments assigned to your class right now.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {assessments.map((assessment) => {
            const isFollowUp = assessment.type === "follow_up";
            const questionCount = assessment.questions?.length || 0;
            const totalScore = assessment.questions?.reduce(
              (acc, q) => acc + (Number(q.max_score) || 0),
              0
            );

            return (
              <div
                key={assessment.id}
                className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-xs transition hover:shadow-md hover:border-emerald-300"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                        isFollowUp
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                      }`}
                    >
                      {isFollowUp ? (
                        <Target className="h-3.5 w-3.5" />
                      ) : (
                        <Zap className="h-3.5 w-3.5" />
                      )}
                      <span>{isFollowUp ? "Follow-up Test" : "Diagnostic Test"}</span>
                    </span>

                    <span className="text-xs font-semibold text-slate-400">
                      {assessment.subject?.name}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-slate-900 leading-snug">
                    {assessment.title}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Target Class: <span className="font-semibold text-slate-700">{assessment.school_class?.name}</span>
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-slate-50 p-3 text-center">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Questions</p>
                      <p className="text-sm font-bold text-slate-800">{questionCount} items</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Total Marks</p>
                      <p className="text-sm font-bold text-slate-800">{totalScore || questionCount * 10} pts</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link
                    to={`/student/take-test/${assessment.id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition active:scale-98"
                  >
                    <span>Start Assessment</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
