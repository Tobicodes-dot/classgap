import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  CheckCircle2,
  Plus,
  Trash2,
  Edit3,
  Settings,
  X,
  FileQuestion,
} from "lucide-react";

export default function TeacherAssessments() {
  const [assessments, setAssessments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);

  // Form states
  const [title, setTitle] = useState("");
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [type, setType] = useState("diagnostic");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Question modal state
  const [activeAssessment, setActiveAssessment] = useState(null);
  const [questionText, setQuestionText] = useState("");
  const [questionTopicId, setQuestionTopicId] = useState("");
  const [questionMaxScore, setQuestionMaxScore] = useState("10");
  const [addingQuestion, setAddingQuestion] = useState(false);

  const fetchData = async () => {
    try {
      const [assessmentRes, classRes, subjectRes, topicRes] = await Promise.all([
        api.get("/assessments"),
        api.get("/classes"),
        api.get("/subjects"),
        api.get("/topics"),
      ]);

      setAssessments(assessmentRes.data);
      setClasses(classRes.data);
      setSubjects(subjectRes.data);
      setTopics(topicRes.data);
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
        const response = await api.put(`/assessments/${editingId}`, payload);
        setAssessments(
          assessments.map((a) => (a.id === editingId ? response.data : a))
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
    if (!confirm("Delete this assessment and its associated questions?")) return;
    try {
      await api.delete(`/assessments/${id}`);
      setAssessments(assessments.filter((a) => a.id !== id));
      if (activeAssessment?.id === id) setActiveAssessment(null);
    } catch (error) {
      console.error("Failed to delete assessment:", error);
    }
  };

  // Open question manager for specific assessment
  const handleManageQuestions = async (assessment) => {
    try {
      const response = await api.get(`/assessments/${assessment.id}`);
      setActiveAssessment(response.data);
      setQuestionTopicId("");
      setQuestionText("");
      setQuestionMaxScore("10");
    } catch (error) {
      console.error("Failed to fetch assessment details:", error);
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!questionText.trim() || !questionTopicId || !activeAssessment) return;

    setAddingQuestion(true);
    try {
      const response = await api.post("/assessment-questions", {
        assessment_id: activeAssessment.id,
        topic_id: Number(questionTopicId),
        question: questionText.trim(),
        max_score: Number(questionMaxScore) || 10,
      });

      const updatedQuestions = [...(activeAssessment.questions || []), response.data];
      const updatedAssessment = { ...activeAssessment, questions: updatedQuestions };
      setActiveAssessment(updatedAssessment);

      // Update in main list as well
      setAssessments(
        assessments.map((a) => (a.id === activeAssessment.id ? updatedAssessment : a))
      );

      setQuestionText("");
      setQuestionTopicId("");
      setQuestionMaxScore("10");
    } catch (error) {
      console.error("Failed to add question:", error);
    } finally {
      setAddingQuestion(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!confirm("Delete this question?")) return;
    try {
      await api.delete(`/assessment-questions/${questionId}`);
      const updatedQuestions = activeAssessment.questions.filter((q) => q.id !== questionId);
      const updatedAssessment = { ...activeAssessment, questions: updatedQuestions };
      setActiveAssessment(updatedAssessment);

      setAssessments(
        assessments.map((a) => (a.id === activeAssessment.id ? updatedAssessment : a))
      );
    } catch (error) {
      console.error("Failed to delete question:", error);
    }
  };

  // Filter topics for the active assessment's subject
  const availableTopics = activeAssessment
    ? topics.filter((t) => t.subject_id === activeAssessment.subject_id)
    : topics;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
          Curriculum Assessments
        </span>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Assessments & Question Builder
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Design baseline diagnostic tests and post-intervention follow-up tests mapped to syllabus topics.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Create/Edit Assessment Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs h-fit">
          <h2 className="text-base font-bold text-slate-900">
            {editingId ? "Edit Assessment" : "Create Assessment"}
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Set assessment scope, class, and evaluation phase.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                Assessment Title
              </label>
              <input
                type="text"
                placeholder="e.g. JSS 2 Mathematics Diagnostic"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                Class
              </label>
              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-100"
              >
                <option value="">Select target class</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
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
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-100"
              >
                <option value="">Select subject</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                Assessment Phase Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-100"
              >
                <option value="diagnostic">Diagnostic (Initial Baseline / Gap Discovery)</option>
                <option value="follow_up">Follow-up (Post-Intervention Measurement)</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-purple-600/20 transition hover:bg-purple-700 active:scale-98"
              >
                {editingId ? "Update Assessment" : "Save Assessment"}
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

        {/* Assessment List */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Assessment Library ({assessments.length})
              </h2>
              <p className="text-xs text-slate-500">
                Click "Manage Questions" to build test items mapped to syllabus topics.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-sm text-slate-400">Loading assessments...</div>
          ) : assessments.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-400">
              No assessments created yet. Use the form to start.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {assessments.map((assessment) => (
                <div key={assessment.id} className="p-5 transition hover:bg-slate-50 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg font-bold ${
                        assessment.type === "follow_up"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-purple-100 text-purple-700"
                      }`}>
                        <CheckCircle2 className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate font-bold text-slate-900">
                          {assessment.title}
                        </h3>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {assessment.school_class?.name || "Class"} · {assessment.subject?.name || "Subject"}
                        </p>

                        <div className="mt-2 flex items-center gap-2">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                              assessment.type === "follow_up"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-purple-50 text-purple-700 border border-purple-200"
                            }`}
                          >
                            {assessment.type === "follow_up" ? "Follow-up Test" : "Diagnostic Test"}
                          </span>

                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                            {assessment.questions?.length || 0} questions
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap shrink-0 gap-2">
                      <button
                        onClick={() => handleManageQuestions(assessment)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-3 py-2 text-xs font-bold text-white shadow-xs hover:bg-purple-700 transition"
                      >
                        <Settings className="h-3.5 w-3.5" />
                        <span>Questions ({assessment.questions?.length || 0})</span>
                      </button>

                      <button
                        onClick={() => handleEdit(assessment)}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(assessment.id)}
                        className="rounded-xl border border-red-200 bg-red-50/50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
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

      {/* Modal / Drawer for Assessment Questions */}
      {activeAssessment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase text-purple-600">
                  Question Manager
                </span>
                <h2 className="text-lg font-bold text-slate-900">
                  {activeAssessment.title}
                </h2>
                <p className="text-xs text-slate-400">
                  {activeAssessment.school_class?.name} · {activeAssessment.subject?.name}
                </p>
              </div>

              <button
                onClick={() => setActiveAssessment(null)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Add question form */}
            <form onSubmit={handleAddQuestion} className="mt-5 rounded-2xl bg-purple-50/50 p-4 border border-purple-100 space-y-3">
              <h3 className="text-xs font-bold uppercase text-purple-900">Add Test Question</h3>
              
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Question Prompt
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Calculate 3/4 + 1/8 and show your working."
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Curriculum Topic
                  </label>
                  <select
                    value={questionTopicId}
                    onChange={(e) => setQuestionTopicId(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-purple-500"
                  >
                    <option value="">Select Topic</option>
                    {availableTopics.map((topic) => (
                      <option key={topic.id} value={topic.id}>
                        {topic.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Maximum Score (Marks)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={questionMaxScore}
                    onChange={(e) => setQuestionMaxScore(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={addingQuestion}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-purple-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-purple-700 transition"
              >
                <Plus className="h-4 w-4" />
                <span>{addingQuestion ? "Adding..." : "Add Question to Assessment"}</span>
              </button>
            </form>

            {/* Questions list */}
            <div className="mt-6 space-y-3">
              <h3 className="text-xs font-bold uppercase text-slate-600">
                Questions in this Test ({activeAssessment.questions?.length || 0})
              </h3>

              {!activeAssessment.questions?.length ? (
                <p className="text-center py-6 text-xs text-slate-400">
                  No questions added yet. Use the form above to add test questions.
                </p>
              ) : (
                <div className="space-y-2">
                  {activeAssessment.questions.map((q, idx) => (
                    <div
                      key={q.id}
                      className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 p-3.5 bg-white hover:bg-slate-50"
                    >
                      <div className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-slate-900">{q.question}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-700">
                              {q.topic?.name || "Topic"}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              Max Score: {q.max_score} pts
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="text-xs font-semibold text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end border-t border-slate-100 pt-4">
              <button
                onClick={() => setActiveAssessment(null)}
                className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
