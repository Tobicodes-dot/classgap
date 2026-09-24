import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/axios";
import {
  Target,
  Save,
  Clock,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Zap,
} from "lucide-react";

export default function TeacherInterventions() {
  const [students, setStudents] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [topicId, setTopicId] = useState("");
  const [identifiedGap, setIdentifiedGap] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [activity, setActivity] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const initData = async () => {
      try {
        const [studentsRes, topicsRes] = await Promise.all([
          api.get("/students"),
          api.get("/topics"),
        ]);
        setStudents(studentsRes.data);
        setTopics(topicsRes.data);

        const urlStudentId = searchParams.get("student_id");
        const urlTopicId = searchParams.get("topic_id");

        if (urlStudentId) {
          setSelectedStudentId(urlStudentId);
        } else if (studentsRes.data.length > 0) {
          setSelectedStudentId(String(studentsRes.data[0].id));
        }

        if (urlTopicId) {
          setTopicId(urlTopicId);
        }
      } catch (error) {
        console.error("Failed to load initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [searchParams]);

  const fetchStudentInterventions = async (studentId) => {
    if (!studentId) return;
    try {
      const response = await api.get(`/students/${studentId}/interventions`);
      setInterventions(response.data);
    } catch (error) {
      console.error("Failed to load interventions:", error);
      setInterventions([]);
    }
  };

  useEffect(() => {
    if (selectedStudentId) {
      fetchStudentInterventions(selectedStudentId);
    }
  }, [selectedStudentId]);

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    if (!selectedStudentId || !topicId || !identifiedGap.trim()) return;

    setSubmitting(true);
    try {
      const response = await api.post(`/students/${selectedStudentId}/interventions`, {
        topic_id: Number(topicId),
        identified_gap: identifiedGap.trim(),
        recommendation: recommendation.trim() || "Targeted practice and visual demonstration.",
        activity: activity.trim() || "Worksheet exercises and individual tutoring.",
      });

      // Update interventions list
      const updated = [response.data, ...interventions.filter((p) => p.id !== response.data.id)];
      setInterventions(updated);

      // Reset form fields
      setIdentifiedGap("");
      setRecommendation("");
      setActivity("");
    } catch (error) {
      console.error("Failed to save intervention plan:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (planId, newStatus) => {
    try {
      const response = await api.put(`/interventions/${planId}/status`, {
        status: newStatus,
      });

      setInterventions(
        interventions.map((p) => (p.id === planId ? response.data : p))
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const selectedStudent = students.find((s) => String(s.id) === String(selectedStudentId));

  const statusConfig = {
    pending: { label: "Pending", bg: "bg-slate-100 text-slate-700 border-slate-200" },
    in_progress: { label: "In Progress", bg: "bg-amber-50 text-amber-700 border-amber-200" },
    completed: { label: "Completed", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
            Targeted Remediation
          </span>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Intervention Planner
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Draft structured intervention strategies and assign practice activities for discovered learning gaps.
          </p>
        </div>

        {/* Student selector */}
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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Create Intervention Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs h-fit">
          <h2 className="text-base font-bold text-slate-900">
            Create Intervention Plan
          </h2>
          <p className="mt-0.5 text-xs text-slate-400">
            For {selectedStudent?.user?.name || "selected student"}
          </p>

          <form onSubmit={handleCreatePlan} className="mt-5 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                Target Topic
              </label>
              <select
                value={topicId}
                onChange={(e) => setTopicId(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-100"
              >
                <option value="">Select Curriculum Topic</option>
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                Identified Learning Gap (Diagnosis)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Struggles with finding common denominators when adding unlike fractions."
                value={identifiedGap}
                onChange={(e) => setIdentifiedGap(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                Teacher Recommendation
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Use visual fraction strips and step-by-step LCM drills."
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                Action Activity / Practice Tasks
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Complete 15 fraction exercises and review solutions in small group."
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 text-xs font-bold text-white shadow-md shadow-purple-600/20 hover:bg-purple-700 transition active:scale-98"
            >
              <Save className="h-4 w-4" />
              <span>{submitting ? "Saving Plan..." : "Save Intervention Plan"}</span>
            </button>
          </form>
        </div>

        {/* List of Active & Past Interventions */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Intervention Records ({interventions.length})
              </h2>
              <p className="text-xs text-slate-400">
                Active plans and progress statuses for {selectedStudent?.user?.name}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-sm text-slate-400">Loading intervention plans...</div>
          ) : interventions.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-400">
              No intervention plans recorded for this student yet. Use the form on the left to create one.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {interventions.map((plan) => (
                <div key={plan.id} className="p-6 transition hover:bg-slate-50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                        <Target className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          Topic: {plan.topic?.name}
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          Created {new Date(plan.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Status Dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-medium">Status:</span>
                      <select
                        value={plan.status}
                        onChange={(e) => handleUpdateStatus(plan.id, e.target.value)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold border outline-none cursor-pointer ${
                          statusConfig[plan.status]?.bg || "bg-slate-100"
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3 text-xs">
                    <div className="rounded-xl bg-red-50/50 p-3.5 border border-red-100">
                      <div className="flex items-center gap-1.5 font-bold text-red-800">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <span>Identified Gap</span>
                      </div>
                      <p className="mt-1.5 text-slate-700 leading-relaxed">{plan.identified_gap}</p>
                    </div>

                    <div className="rounded-xl bg-blue-50/50 p-3.5 border border-blue-100">
                      <div className="flex items-center gap-1.5 font-bold text-blue-800">
                        <Lightbulb className="h-3.5 w-3.5" />
                        <span>Recommendation</span>
                      </div>
                      <p className="mt-1.5 text-slate-700 leading-relaxed">{plan.recommendation}</p>
                    </div>

                    <div className="rounded-xl bg-emerald-50/50 p-3.5 border border-emerald-100">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                        <Zap className="h-3.5 w-3.5" />
                        <span>Practice Activity</span>
                      </div>
                      <p className="mt-1.5 text-slate-700 leading-relaxed">{plan.activity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
