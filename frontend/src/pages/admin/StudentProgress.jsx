import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import { TrendingUp } from "lucide-react";

export default function StudentProgress() {
  const { id } = useParams();

  const [student, setStudent] = useState(null);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await api.get(`/students/${id}/progress`);
        setStudent(response.data.student);
        setProgress(response.data.progress || []);
      } catch (error) {
        console.error("Failed to load student progress:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [id]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-400">
        Loading student learning progress...
      </div>
    );
  }

  if (!student) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-400">
        Student not found.
      </div>
    );
  }

  const learningGaps = progress.filter(
    (topic) => topic.before !== null && topic.before < 50
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link
              to="/admin/students"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              ← Students Roster
            </Link>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {student.name}'s Learning Progress
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Topic-level diagnostic evaluations, learning gap identification, and post-intervention gains.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/admin/assessments"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
          >
            Assessments
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold text-slate-400 uppercase">Assessed Topics</p>
          <h2 className="mt-1 text-2xl font-black text-slate-900">{progress.length}</h2>
          <p className="mt-0.5 text-xs text-slate-400">Total topics evaluated</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold text-red-500 uppercase">Identified Gaps</p>
          <h2 className="mt-1 text-2xl font-black text-red-600">{learningGaps.length}</h2>
          <p className="mt-0.5 text-xs text-slate-400">Score &lt; 50% on diagnostic</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold text-emerald-600 uppercase">Overall Growth</p>
          <h2 className="mt-1 text-2xl font-black text-emerald-600">
            {progress.filter((p) => p.improvement > 0).length} Topics
          </h2>
          <p className="mt-0.5 text-xs text-slate-400">Measurable score improvements</p>
        </div>
      </div>

      {/* Progress Breakdown Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="border-b border-slate-100 px-6 py-5">
          <h3 className="text-base font-bold text-slate-900">
            Topic Diagnostic vs Follow-up Comparison
          </h3>
        </div>

        {progress.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No assessment results recorded for this student yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {progress.map((topic) => (
              <div key={topic.topic_id} className="p-6 transition hover:bg-slate-50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{topic.topic}</h4>
                      {topic.before !== null && topic.before < 50 && (
                        <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-bold text-red-700 border border-red-200">
                          Gap Identified
                        </span>
                      )}
                      {topic.improvement !== null && topic.improvement > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                          <TrendingUp className="h-3 w-3" />
                          <span>Improved</span>
                        </span>
                      )}
                    </div>

                    <div className="mt-4 space-y-2 max-w-md">
                      <div>
                        <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                          <span>Diagnostic Baseline:</span>
                          <span className="font-bold">
                            {topic.before !== null ? `${topic.before}%` : "—"}
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100">
                          {topic.before !== null && (
                            <div
                              className={`h-2 rounded-full ${
                                topic.before < 50 ? "bg-red-400" : "bg-indigo-400"
                              }`}
                              style={{ width: `${Math.min(topic.before, 100)}%` }}
                            />
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                          <span>Follow-up Post-Intervention:</span>
                          <span className="font-bold">
                            {topic.after !== null ? `${topic.after}%` : "Pending post-test"}
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100">
                          {topic.after !== null && (
                            <div
                              className="h-2 rounded-full bg-emerald-500"
                              style={{ width: `${Math.min(topic.after, 100)}%` }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end justify-center shrink-0">
                    <span className="text-[11px] font-bold uppercase text-slate-400">Growth</span>
                    {topic.improvement !== null ? (
                      <span
                        className={`text-2xl font-black ${
                          topic.improvement > 0
                            ? "text-emerald-600"
                            : topic.improvement < 0
                            ? "text-red-600"
                            : "text-slate-600"
                        }`}
                      >
                        {topic.improvement > 0 ? `+${topic.improvement}%` : `${topic.improvement}%`}
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-slate-400">Awaiting Follow-up</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}