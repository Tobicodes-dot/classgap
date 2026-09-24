import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import {
  Target,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

export default function TeacherStudentProgress() {
  const { id } = useParams();
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(id || "");
  const [student, setStudent] = useState(null);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get("/students");
        setStudents(response.data);
        if (!selectedStudentId && response.data.length > 0) {
          setSelectedStudentId(String(response.data[0].id));
        }
      } catch (error) {
        console.error("Failed to load students:", error);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    if (!selectedStudentId) return;

    const fetchProgress = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/students/${selectedStudentId}/progress`);
        setStudent(response.data.student);
        setProgress(response.data.progress || []);
      } catch (error) {
        console.error("Failed to load student progress:", error);
        setStudent(null);
        setProgress([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [selectedStudentId]);

  const learningGaps = progress.filter(
    (topic) => topic.before !== null && topic.before < 50
  );

  const improvedTopics = progress.filter(
    (topic) => topic.improvement !== null && topic.improvement > 0
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
            Efficacy & Learning Gains
          </span>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Student Progress & Measurement
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Compare baseline diagnostic scores against post-intervention follow-up assessments.
          </p>
        </div>

        {/* Student Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
            Select Student:
          </label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 shadow-xs outline-none focus:border-purple-500"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.user?.name} ({s.school_class?.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-400">
          Calculating student progress and improvement rates...
        </div>
      ) : !student ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-400">
          No assessment history found for this student.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <p className="text-xs font-semibold text-slate-400 uppercase">Student Name</p>
              <h2 className="mt-1 text-xl font-extrabold text-slate-900">{student.name}</h2>
              <p className="mt-1 text-xs text-purple-600 font-medium">Student ID #{student.id}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <p className="text-xs font-semibold text-red-500 uppercase">Initial Baseline Gaps</p>
              <h2 className="mt-1 text-2xl font-extrabold text-red-600">{learningGaps.length}</h2>
              <p className="mt-1 text-xs text-slate-400">Topics &lt; 50% in diagnostic test</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <p className="text-xs font-semibold text-emerald-600 uppercase">Improved Topics</p>
              <h2 className="mt-1 text-2xl font-extrabold text-emerald-600">{improvedTopics.length}</h2>
              <p className="mt-1 text-xs text-slate-400">Positive post-intervention gains</p>
            </div>
          </div>

          {/* Progress Comparison Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Topic-by-Topic Performance & Improvement
                </h3>
                <p className="text-xs text-slate-400">
                  Diagnostic (Before) vs Follow-up (After) Assessment Metrics
                </p>
              </div>

              <Link
                to={`/teacher/interventions?student_id=${selectedStudentId}`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-purple-50 px-3 py-2 text-xs font-bold text-purple-700 hover:bg-purple-100 transition"
              >
                <Target className="h-3.5 w-3.5" />
                <span>View / Add Intervention</span>
              </Link>
            </div>

            {progress.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No test data recorded yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {progress.map((item) => {
                  const hasGain = item.improvement !== null && item.improvement > 0;
                  const isGap = item.before !== null && item.before < 50;

                  return (
                    <div key={item.topic_id} className="p-6 transition hover:bg-slate-50">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900">{item.topic}</h4>
                            {isGap && (
                              <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-700 border border-red-200">
                                Gap Identified
                              </span>
                            )}
                            {hasGain && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                                <TrendingUp className="h-3 w-3" />
                                <span>+{item.improvement}% Gain</span>
                              </span>
                            )}
                          </div>

                          {/* Visual score bars */}
                          <div className="mt-4 space-y-2 max-w-lg">
                            <div>
                              <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                                <span>Diagnostic (Before Intervention)</span>
                                <span className="font-bold">
                                  {item.before !== null ? `${item.before}%` : "Not assessed"}
                                </span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-slate-100">
                                {item.before !== null && (
                                  <div
                                    className={`h-2 rounded-full ${
                                      item.before < 50 ? "bg-red-400" : "bg-indigo-400"
                                    }`}
                                    style={{ width: `${Math.min(item.before, 100)}%` }}
                                  />
                                )}
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                                <span>Follow-up (After Intervention)</span>
                                <span className="font-bold">
                                  {item.after !== null ? `${item.after}%` : "Pending post-test"}
                                </span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-slate-100">
                                {item.after !== null && (
                                  <div
                                    className="h-2 rounded-full bg-emerald-500"
                                    style={{ width: `${Math.min(item.after, 100)}%` }}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Improvement badge */}
                        <div className="flex flex-col sm:items-end justify-center shrink-0">
                          <p className="text-[11px] uppercase font-bold text-slate-400">Improvement</p>
                          {item.improvement !== null ? (
                            <p
                              className={`text-2xl font-black ${
                                item.improvement > 0
                                  ? "text-emerald-600"
                                  : item.improvement < 0
                                  ? "text-red-600"
                                  : "text-slate-600"
                              }`}
                            >
                              {item.improvement > 0 ? `+${item.improvement}%` : `${item.improvement}%`}
                            </p>
                          ) : (
                            <p className="text-xs font-semibold text-slate-400">Awaiting Follow-up</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
