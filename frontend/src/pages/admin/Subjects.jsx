import { useEffect, useState } from "react";
import api from "../../api/axios";
import { BookOpen } from "lucide-react";

function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSubjects = async () => {
    try {
      const response = await api.get("/subjects");
      setSubjects(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSubjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      if (editingId) {
        const response = await api.put(`/subjects/${editingId}`, {
          name: name.trim(),
        });

        setSubjects(
          subjects.map((subject) =>
            subject.id === editingId ? response.data : subject
          )
        );

        setEditingId(null);
      } else {
        const response = await api.post("/subjects", {
          school_id: 1,
          name: name.trim(),
        });

        setSubjects([...subjects, response.data]);
      }

      setName("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this subject?")) return;

    try {
      await api.delete(`/subjects/${id}`);
      setSubjects(subjects.filter((subject) => subject.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <p className="text-sm font-medium text-indigo-600">Curriculum</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Subjects</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage subjects taught in your school.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-slate-900">
            {editingId ? "Edit Subject" : "Add Subject"}
          </h2>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <input
              type="text"
              placeholder="e.g. Mathematics"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />

            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              {editingId ? "Update Subject" : "Add Subject"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setName("");
                }}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600"
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        {loading ? (
          <div className="text-sm text-slate-500">Loading...</div>
        ) : (
          subjects.map((subject) => (
            <div
              key={subject.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <BookOpen className="h-5 w-5" />
                </div>

                <button
                  onClick={() => handleDelete(subject.id)}
                  className="text-xs font-semibold text-red-500"
                >
                  Delete
                </button>
              </div>

              <h2 className="mt-5 font-bold text-slate-900">
                {subject.name}
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Subject #{subject.id}
              </p>

              <button
                onClick={() => {
                  setEditingId(subject.id);
                  setName(subject.name);
                }}
                className="mt-5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
              >
                Edit Subject
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Subjects;