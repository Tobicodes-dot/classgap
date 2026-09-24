import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import {
  Target,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Lightbulb,
  Zap,
} from "lucide-react";

export default function StudentInterventionsView() {
  const { user } = useAuth();
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);

  const studentId = user?.student?.id || 1;

  useEffect(() => {
    const fetchInterventions = async () => {
      try {
        const response = await api.get(`/students/${studentId}/interventions`);
        setInterventions(response.data || []);
      } catch (error) {
        console.error("Failed to load interventions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterventions();
  }, [studentId]);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
          Personalized Support
        </span>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          My Learning Plan & Guidance
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Tailored learning recommendations and practice activities crafted by your teacher.
        </p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-400">
          Loading your learning plan...
        </div>
      ) : interventions.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500 flex items-center justify-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <span>No active intervention plans. You're doing great across all topics!</span>
        </div>
      ) : (
        <div className="space-y-4">
          {interventions.map((plan) => {
            const isCompleted = plan.status === "completed";
            return (
              <div
                key={plan.id}
                className={`rounded-3xl border p-6 sm:p-8 transition ${
                  isCompleted
                    ? "bg-white border-emerald-200 shadow-xs"
                    : "bg-white border-amber-200 shadow-xs"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                      <Target className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Topic: {plan.topic?.name}
                      </h3>
                      <p className="text-xs text-slate-400">
                        Assigned on {new Date(plan.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                      isCompleted
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <Clock className="h-3.5 w-3.5" />
                    )}
                    <span>{isCompleted ? "Plan Completed" : "In Progress"}</span>
                  </span>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-red-50/60 p-4 border border-red-100">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-red-800 uppercase tracking-wider">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>Focus Area</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-700 leading-relaxed font-medium">
                      {plan.identified_gap}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-blue-50/60 p-4 border border-blue-100">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-800 uppercase tracking-wider">
                      <Lightbulb className="h-3.5 w-3.5" />
                      <span>Teacher Recommendation</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-700 leading-relaxed font-medium">
                      {plan.recommendation}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-emerald-50/60 p-4 border border-emerald-100">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                      <Zap className="h-3.5 w-3.5" />
                      <span>Practice Activity</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-700 leading-relaxed font-medium">
                      {plan.activity}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
