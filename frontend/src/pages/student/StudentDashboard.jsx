import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import {
  Sparkles,
  BookOpen,
  BarChart3,
  Target,
  Zap,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Lightbulb,
} from "lucide-react";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [progress, setProgress] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);

  const studentId = user?.student?.id || 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assessRes, progRes, intervRes] = await Promise.all([
          api.get("/assessments"),
          api.get(`/students/${studentId}/progress`).catch(() => ({ data: { progress: [] } })),
          api.get(`/students/${studentId}/interventions`).catch(() => ({ data: [] })),
        ]);

        setAssessments(assessRes.data);
        setProgress(progRes.data?.progress || []);
        setInterventions(intervRes.data || []);
      } catch (error) {
        console.error("Failed to load student dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentId]);

  const completedTopicsCount = progress.filter((p) => p.before !== null || p.after !== null).length;
  const learningGapsCount = progress.filter((p) => p.before !== null && p.before < 50).length;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-900 p-8 text-white shadow-xl">
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1 text-xs font-semibold text-emerald-100 backdrop-blur-md border border-white/10">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>Keep learning, keep growing!</span>
          </span>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Hi, {user?.name || "Student"}!
          </h1>

          <p className="mt-2 text-sm text-emerald-100/90 leading-relaxed">
            Welcome to your ClassGap portal. Take your diagnostic & follow-up assessments,
            discover areas to improve, and watch your skills level up.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/student/assessments"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-emerald-800 shadow-md transition hover:bg-emerald-50 active:scale-95"
            >
              <BookOpen className="h-4 w-4 text-emerald-700" />
              <span>Take Available Tests</span>
            </Link>

            <Link
              to="/student/progress"
              className="inline-flex items-center gap-2 rounded-xl bg-white/20 px-5 py-2.5 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white/30 active:scale-95 border border-white/20"
            >
              <TrendingUp className="h-4 w-4" />
              <span>View My Mastery</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 font-bold">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
              Active
            </span>
          </div>
          <p className="mt-4 text-xs font-medium text-slate-500">Available Tests</p>
          <p className="mt-1 text-3xl font-black text-slate-900">{assessments.length}</p>
          <p className="mt-0.5 text-xs text-slate-400">Assigned to your class</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 font-bold">
              <BarChart3 className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700">
              Assessed
            </span>
          </div>
          <p className="mt-4 text-xs font-medium text-slate-500">Evaluated Topics</p>
          <p className="mt-1 text-3xl font-black text-slate-900">{completedTopicsCount}</p>
          <p className="mt-0.5 text-xs text-slate-400">Curriculum topics tested</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 font-bold">
              <Target className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
              Focus
            </span>
          </div>
          <p className="mt-4 text-xs font-medium text-slate-500">Learning Plans</p>
          <p className="mt-1 text-3xl font-black text-slate-900">{interventions.length}</p>
          <p className="mt-0.5 text-xs text-slate-400">Custom teacher guidance</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 font-bold">
              <Zap className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-[10px] font-bold text-purple-700">
              Target
            </span>
          </div>
          <p className="mt-4 text-xs font-medium text-slate-500">Gaps to Close</p>
          <p className="mt-1 text-3xl font-black text-slate-900">{learningGapsCount}</p>
          <p className="mt-0.5 text-xs text-slate-400">Topics needing follow-up</p>
        </div>
      </div>

      {/* Two Column Layout: Assigned Tests & Teacher Guidance */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Available Tests List */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Your Assigned Assessments</h2>
              <p className="text-xs text-slate-400">Take tests online and see your results instantly</p>
            </div>
            <Link
              to="/student/assessments"
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              <span>View all</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading tests...</div>
          ) : assessments.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">No assessments assigned yet.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {assessments.map((a) => (
                <div
                  key={a.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 transition hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold ${
                        a.type === "follow_up"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-indigo-100 text-indigo-700"
                      }`}
                    >
                      {a.type === "follow_up" ? (
                        <Target className="h-5 w-5" />
                      ) : (
                        <BookOpen className="h-5 w-5" />
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{a.title}</h3>
                      <p className="text-xs text-slate-400">
                        {a.subject?.name} · {a.school_class?.name} · {a.questions?.length || 0} Questions
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/student/take-test/${a.id}`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition active:scale-95"
                  >
                    <span>Start Test</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Teacher Guidance / Learning Focus */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Teacher Learning Focus</h2>
            <p className="text-xs text-slate-400">Custom guidance and activities assigned to you</p>
          </div>

          {interventions.length === 0 ? (
            <div className="rounded-xl bg-slate-50 p-6 text-center text-xs text-slate-400 border border-slate-100">
              No active learning recommendations. Keep up the great work!
            </div>
          ) : (
            <div className="space-y-3">
              {interventions.slice(0, 3).map((plan) => (
                <div key={plan.id} className="rounded-xl bg-emerald-50/40 p-3.5 border border-emerald-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900">
                      Topic: {plan.topic?.name}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        plan.status === "completed"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {plan.status.replace("_", " ")}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-700 leading-relaxed font-medium">
                    <Lightbulb className="h-3 w-3 inline text-amber-500 mr-1" />
                    <span className="font-bold">Advice:</span> {plan.recommendation}
                  </p>

                  <div className="mt-2 rounded-lg bg-white p-2 text-[11px] text-slate-600 border border-emerald-200/60">
                    <span className="font-bold text-emerald-800">Task:</span> {plan.activity}
                  </div>
                </div>
              ))}

              <Link
                to="/student/interventions"
                className="inline-flex w-full items-center justify-center gap-1 text-center text-xs font-bold text-emerald-600 hover:text-emerald-700 pt-2"
              >
                <span>View all learning plans ({interventions.length})</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
