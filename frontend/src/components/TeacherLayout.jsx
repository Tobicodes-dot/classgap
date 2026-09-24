import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  CheckSquare,
  Zap,
  Target,
  TrendingUp,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navigation = [
  { name: "Overview", path: "/teacher/dashboard", icon: LayoutDashboard },
  { name: "Assessments & Tests", path: "/teacher/assessments", icon: CheckSquare },
  { name: "Learning Gaps", path: "/teacher/learning-gaps", icon: Zap },
  { name: "Intervention Plans", path: "/teacher/interventions", icon: Target },
  { name: "Student Progress", path: "/teacher/students", icon: TrendingUp },
];

export default function TeacherLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-lg font-bold text-white shadow-md shadow-purple-600/20">
            C
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">
              ClassGap
            </h1>
            <p className="text-xs text-purple-600 font-semibold">Teacher Portal</p>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-4 py-6">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Diagnostic & Teaching
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-purple-50 text-purple-700 font-semibold shadow-xs"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-slate-100 p-4 space-y-3">
          <div className="flex items-center gap-3 rounded-xl bg-purple-50/50 p-3 border border-purple-100">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white">
              {user?.name?.charAt(0) || "T"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-800">
                {user?.name || "Teacher"}
              </p>
              <p className="truncate text-[11px] text-purple-600 font-medium">Instructor</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50/50 px-3 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 hover:border-red-300 active:scale-98"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden lg:block">
            <p className="text-xs font-medium text-slate-400">Classroom Intelligence</p>
            <p className="font-semibold text-slate-800">
              Diagnostic & Intervention Hub
            </p>
          </div>

          <div className="ml-auto flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 border border-purple-200">
              <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
              Teacher Session
            </span>

            <div className="hidden h-6 w-px bg-slate-200 sm:block" />

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white shadow-xs">
                {user?.name?.charAt(0) || "T"}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-slate-800">
                  {user?.name || "Teacher"}
                </p>
                <p className="text-[11px] text-purple-600 font-medium">
                  Educator
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
