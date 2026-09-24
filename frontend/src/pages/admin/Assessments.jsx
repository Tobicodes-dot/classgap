import { useEffect, useState } from "react";
import api from "../../api/axios";
import { CheckSquare, CheckCircle2 } from "lucide-react";

function Assessments() {
  const [assessments, setAssessments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [title, setTitle] = useState("");
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [type, setType] = useState("diagnostic");

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [assessmentRes, classRes, subjectRes] = await Promise.all([
        api.get("/assessments"),
        api.get("/classes"),
        api.get("/subjects"),
      ]);

      setAssessments(assessmentRes.data);
      setClasses(classRes.data);
      setSubjects(subjectRes.data);
    } catch (error) {
      console.error("Failed to load assessments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setTitle("");
    setClassId("");
    setSubjectId("");
    setType("diagnostic");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !classId || !subjectId) return;

    try {
      const payload = {
        school_class_id: Number(classId),
        subject_id: Number(subjectId),
        title: title.trim(),
        type,
      };

      if (editingId) {
        const response = await api.put(
          `/assessments/${editingId}`,
          payload
        );

        setAssessments(
          assessments.map((assessment) =>
            assessment.id === editingId
              ? response.data
              : assessment
          )
        );
      } else {
        const response = await api.post("/assessments", payload);

        setAssessments([...assessments, response.data]);
      }

      resetForm();
    } catch (error) {
      console.error("Failed to save assessment:", error);
    }
  };

  const handleEdit = (assessment) => {
    setEditingId(assessment.id);
    setTitle(assessment.title);
    setClassId(assessment.school_class_id);
    setSubjectId(assessment.subject_id);
    setType(assessment.type || "diagnostic");
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this assessment?")) return;

    try {
      await api.delete(`/assessments/${id}`);

      setAssessments(
        assessments.filter((assessment) => assessment.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete assessment:", error);
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-medium text-indigo-600">
          Academic Assessment
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          Assessments
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Create assessments and measure student understanding.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="font-bold text-slate-900">
              {editingId ? "Edit Assessment" : "Create Assessment"}
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Set up an assessment for a class and subject.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                Assessment title
              </label>

              <input
                type="text"
                placeholder="e.g. JSS 2 Mathematics Diagnostic"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                Class
              </label>

              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">Select class</option>

                {classes.map((schoolClass) => (
                  <option key={schoolClass.id} value={schoolClass.id}>
                    {schoolClass.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                Subject
              </label>

              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">Select subject</option>

                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                Assessment type
              </label>

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              >
                <option value="diagnostic">Diagnostic</option>
                <option value="follow_up">Follow-up</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                {editingId ? "Update Assessment" : "Create Assessment"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Assessment list */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="font-bold text-slate-900">
                Assessment Library
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {assessments.length} assessments
              </p>
            </div>

            <div className="hidden rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 sm:block">
              Academic
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-sm text-slate-500">
              Loading assessments...
            </div>
          ) : assessments.length === 0 ? (
            <div className="p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <CheckSquare className="h-6 w-6" />
              </div>

              <p className="mt-4 font-semibold text-slate-800">
                No assessments yet
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Create your first assessment using the form.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {assessments.map((assessment) => (
                <div
                  key={assessment.id}
                  className="p-5 transition hover:bg-slate-50 sm:p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-slate-900">
                          {assessment.title}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {assessment.school_class?.name} ·{" "}
                          {assessment.subject?.name}
                        </p>

                        <div className="mt-2">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                              assessment.type === "follow_up"
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-indigo-50 text-indigo-600"
                            }`}
                          >
                            {assessment.type === "follow_up"
                              ? "Follow-up"
                              : "Diagnostic"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <button
                        onClick={() => handleEdit(assessment)}
                        className="rounded-lg px-3 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(assessment.id)}
                        className="rounded-lg px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
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

export default Assessments;