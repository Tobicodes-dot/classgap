import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../api/axios";
import {
  AlertTriangle,
  CheckCircle2,
  Target,
  ArrowRight,
  Zap,
} from "lucide-react";

export default function TeacherLearningGaps() {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [gapData, setGapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get("/students");
        setStudents(response.data);
        const urlStudentId = searchParams.get("student_id");
        if (urlStudentId) {
          setSelectedStudentId(urlStudentId);
        } else if (response.data.length > 0) {
          setSelectedStudentId(String(response.data[0].id));
        }
      } catch (error) {
        console.error("Failed to load students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [searchParams]);

  useEffect(() => {
    if (!selectedStudentId) return;

    const fetchGaps = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/students/${selectedStudentId}/learning-gaps`);
        setGapData(response.data);
      } catch (error) {
        console.error("Failed to load learning gaps:", error);
        setGapData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchGaps();
  }, [selectedStudentId]);

  const selectedStudent = students.find((s) => String(s.id) === String(selectedStudentId));

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
            Diagnostic Intelligence
          </span>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Learning Gap Detection
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Identify specific syllabus topics where students scored below 50% mastery on diagnostic tests.
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
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 shadow-xs outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
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
          Analyzing diagnostic assessment results...
        </div>
      ) : !gapData ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-400">
          No diagnostic assessment data available for this student.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Banner */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 font-bold text-purple-700 text-lg">
                  {selectedStudent?.user?.name?.charAt(0) || "S"}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {gapData.student?.name || selectedStudent?.user?.name}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Class: {selectedStudent?.school_class?.name} · Student ID: #{selectedStudent?.id}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-red-50 px-4 py-2 text-center border border-red-100">
                  <p className="text-[10px] font-bold uppercase text-red-500">Identified Gaps</p>
                  <p className="text-xl font-extrabold text-red-600">
                    {gapData.learning_gaps?.length || 0}
                  </p>
                </div>
                <div className="rounded-xl bg-emerald-50 px-4 py-2 text-center border border-emerald-100">
                  <p className="text-[10px] font-bold uppercase text-emerald-600">Mastered Topics</p>
                  <p className="text-xl font-extrabold text-emerald-700">
                    {(gapData.topic_performance?.length || 0) - (gapData.learning_gaps?.length || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Critical Learning Gaps Alert Section */}
          <div className="rounded-2xl border border-red-200 bg-red-50/40 p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500 text-white font-bold shrink-0">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-red-900">
                  Critical Learning Gaps (&lt; 50% Mastery)
                </h3>
                <p className="text-xs text-red-700">
                  These topics require immediate targeted intervention before advancing to new material.
                </p>
              </div>
            </div>

            {!gapData.learning_gaps?.length ? (
              <div className="rounded-xl bg-white p-6 text-center text-xs text-slate-600 border border-emerald-200 flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>No critical learning gaps detected! The student scored ≥ 50% across all evaluated topics.</span>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {gapData.learning_gaps.map((gap) => (
                  <div
                    key={gap.topic_id}
                    className="rounded-xl border border-red-200 bg-white p-5 shadow-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{gap.topic}</h4>
                        <p className="text-xs text-red-600 font-semibold mt-0.5">
                          Score: {gap.score} / {gap.max_score} ({gap.percentage}%)
                        </p>
                      </div>
                      <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-bold text-red-700">
                        Needs Action
                      </span>
                    </div>

                    {/* Progress visual */}
                    <div className="mt-3 w-full rounded-full bg-slate-100 h-2">
                      <div
                        className="h-2 rounded-full bg-red-500 transition-all"
                        style={{ width: `${Math.min(gap.percentage, 100)}%` }}
                      />
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Action:</span>
                      <Link
                        to={`/teacher/interventions?student_id=${selectedStudentId}&topic_id=${gap.topic_id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-purple-700 transition"
                      >
                        <Target className="h-3.5 w-3.5" />
                        <span>Plan Intervention</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* All Topics Performance Breakdown */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="border-b border-slate-100 px-6 py-5">
              <h3 className="text-sm font-bold text-slate-900">
                Full Topic Diagnostic Performance
              </h3>
              <p className="text-xs text-slate-400">
                Complete evaluation breakdown across all evaluated syllabus topics.
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {gapData.topic_performance?.map((tp) => (
                <div
                  key={tp.topic_id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-slate-900">{tp.topic}</h4>
                      {tp.is_gap ? (
                        <span className="rounded-full bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 border border-red-200">
                          Gap (&lt;50%)
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 border border-emerald-200">
                          Satisfactory
                        </span>
                      )}
                    </div>
                    <div className="mt-2 w-full max-w-md rounded-full bg-slate-100 h-2">
                      <div
                        className={`h-2 rounded-full ${
                          tp.percentage < 50 ? "bg-red-500" : "bg-emerald-500"
                        }`}
                        style={{ width: `${Math.min(tp.percentage, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0">
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">{tp.percentage}%</p>
                      <p className="text-[11px] text-slate-400">
                        {tp.score} / {tp.max_score} pts
                      </p>
                    </div>

                    <Link
                      to={`/teacher/interventions?student_id=${selectedStudentId}&topic_id=${tp.topic_id}`}
                      className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      {tp.is_gap ? "Create Plan" : "Log Note"}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
