import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  Users,
  GraduationCap,
  Layers,
  BookOpen,
  CheckSquare,
  AlertTriangle,
  Target,
} from "lucide-react";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api
      .get("/admin/dashboard")
      .then((response) => setData(response.data))
      .catch((error) => console.error(error));
  }, []);

  const stats = [
    {
      label: "Students",
      value: data?.students_count ?? 0,
      icon: Users,
      bg: "bg-blue-50",
      color: "text-blue-600",
    },
    {
      label: "Teachers",
      value: data?.teachers_count ?? 0,
      icon: GraduationCap,
      bg: "bg-purple-50",
      color: "text-purple-600",
    },
    {
      label: "Classes",
      value: data?.classes_count ?? 0,
      icon: Layers,
      bg: "bg-emerald-50",
      color: "text-emerald-600",
    },
    {
      label: "Subjects",
      value: data?.subjects_count ?? 0,
      icon: BookOpen,
      bg: "bg-orange-50",
      color: "text-orange-600",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div>
        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-indigo-600">
          Executive Overview
        </p>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Welcome, School Administrator
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Here is what is happening across your school curriculum and student learning gaps.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">
                  Active
                </span>
              </div>

              <p className="mt-4 text-xs font-medium text-slate-500">
                {stat.label}
              </p>

              <p className="mt-1 text-3xl font-extrabold text-slate-900">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">
                Learning Intelligence Metrics
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Monitor student performance and identify diagnostic learning gaps.
              </p>
            </div>

            <div className="rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600">
              ClassGap Analytics
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 shrink-0">
                <CheckSquare className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Assessments</p>
                <p className="text-2xl font-black text-slate-900">
                  {data?.assessments_count ?? 0}
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-red-50 p-4 border border-red-100 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600 shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-red-600 font-semibold">Learning Gaps</p>
                <p className="text-2xl font-black text-slate-900">
                  {data?.topics_count ? Math.min(2, data.topics_count) : 0}
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-100 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 shrink-0">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-emerald-600 font-semibold">Interventions</p>
                <p className="text-2xl font-black text-slate-900">
                  {data?.interventions_count ?? 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-indigo-600 p-6 text-white shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-indigo-200 uppercase tracking-wider">
              ClassGap Insight
            </span>

            <h2 className="mt-2 text-xl font-bold">
              Turn assessment results into targeted action.
            </h2>

            <p className="mt-2 text-xs leading-relaxed text-indigo-100">
              Identify where students struggle, create targeted interventions,
              and track improvement over time.
            </p>
          </div>

          <div className="mt-6 rounded-xl bg-white/10 p-3.5 border border-white/10 backdrop-blur-xs">
            <p className="text-[11px] text-indigo-200 font-medium">Curriculum Focus</p>
            <p className="mt-0.5 text-sm font-bold">
              JSS 2 Mathematics & English
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}