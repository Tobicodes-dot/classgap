import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import {
  Users,
  CheckSquare,
  Target,
  Layers,
  Zap,
  TrendingUp,
  Plus,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [dashRes, studentsRes] = await Promise.all([
          api.get("/teacher/dashboard"),
          api.get("/students"),
        ]);
        setData(dashRes.data);
        setStudents(studentsRes.data);
      } catch (error) {
        console.error("Failed to load teacher dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const stats = [
    {
      label: "Total Students",
      value: data?.stats?.total_students ?? students.length,
      icon: Users,
      bg: "bg-blue-50 text-blue-600",
      desc: "Assigned in your classes",
    },
    {
      label: "Assessments",
      value: data?.stats?.total_assessments ?? 0,
      icon: CheckSquare,
      bg: "bg-purple-50 text-purple-600",
      desc: "Diagnostics & Follow-ups",
    },
    {
      label: "Active Interventions",
      value: data?.stats?.total_interventions ?? 0,
      icon: Target,
      bg: "bg-amber-50 text-amber-600",
      desc: "In progress / pending",
    },
    {
      label: "Classes Managed",
      value: data?.classes?.length ?? 1,
      icon: Layers,
      bg: "bg-emerald-50 text-emerald-600",
      desc: "Active curriculum groups",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-700 to-slate-900 p-8 text-white shadow-xl">
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-purple-200 backdrop-blur-md">
            Teacher Intelligence Hub
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Welcome, {user?.name || "Teacher"}
          </h1>
          <p className="mt-2 text-sm text-purple-100/90 leading-relaxed">
            Run topic-level diagnostics, identify student misunderstandings before they compound,
            and monitor post-intervention improvement.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/teacher/assessments"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-purple-700 shadow-md transition hover:bg-purple-50 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Create Assessment</span>
            </Link>
            <Link
              to="/teacher/learning-gaps"
              className="inline-flex items-center gap-1.5 rounded-xl bg-purple-500/30 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-md transition hover:bg-purple-500/40 active:scale-95 border border-white/20"
            >
              <Zap className="h-4 w-4" />
              <span>Analyze Learning Gaps</span>
            </Link>
            <Link
              to="/teacher/interventions"
              className="inline-flex items-center gap-1.5 rounded-xl bg-purple-500/30 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-md transition hover:bg-purple-500/40 active:scale-95 border border-white/20"
            >
              <Target className="h-4 w-4" />
              <span>Plan Interventions</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:shadow-md hover:border-purple-200"
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bg} font-bold`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                  Live
                </span>
              </div>
              <p className="mt-4 text-xs font-medium text-slate-500">{stat.label}</p>
              <p className="mt-1 text-3xl font-extrabold text-slate-900">{stat.value}</p>
              <p className="mt-1 text-xs text-slate-400">{stat.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout: Student Roster & Recent Assessments */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Student Learning Gap Tracker */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Student Diagnostics & Roster</h2>
              <p className="text-xs text-slate-500">Select any student to view diagnostic gaps and improvement history</p>
            </div>
            <Link
              to="/teacher/students"
              className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-700"
            >
              <span>View all students</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center text-sm text-slate-400">Loading student roster...</div>
          ) : students.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">No students found.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 transition hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 font-bold text-purple-700">
                      {student.user?.name?.charAt(0) || "S"}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {student.user?.name || "Student"}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {student.user?.email} · <span className="text-purple-600 font-medium">{student.school_class?.name || "Class"}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/teacher/students/${student.id}/gaps`}
                      className="inline-flex items-center gap-1 rounded-xl bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition"
                    >
                      <Zap className="h-3.5 w-3.5" />
                      <span>Check Gaps</span>
                    </Link>
                    <Link
                      to={`/teacher/students/${student.id}/progress`}
                      className="inline-flex items-center gap-1 rounded-xl bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition"
                    >
                      <TrendingUp className="h-3.5 w-3.5" />
                      <span>View Progress</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions & Recent Interventions */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900">Active Interventions</h2>
            <p className="mt-1 text-xs text-slate-500">Pending & active support plans</p>

            <div className="mt-4 space-y-3">
              {data?.pending_interventions?.length ? (
                data.pending_interventions.map((plan) => (
                  <div key={plan.id} className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 truncate">
                        {plan.student?.user?.name || "Student"}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        plan.status === 'in_progress' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {plan.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-purple-700 font-medium">Topic: {plan.topic?.name}</p>
                    <p className="mt-1 text-xs text-slate-600 line-clamp-2">{plan.identified_gap}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-4 text-center">No active interventions</p>
              )}
            </div>

            <Link
              to="/teacher/interventions"
              className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 py-2.5 text-center text-xs font-bold text-purple-700 hover:bg-purple-100 transition"
            >
              <span>Open Intervention Planner</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
