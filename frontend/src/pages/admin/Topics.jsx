import { useEffect, useState } from "react";
import api from "../../api/axios";

function Topics() {
  const [topics, setTopics] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [name, setName] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTopics = async () => {
    try {
      const response = await api.get("/topics");
      setTopics(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await api.get("/subjects");
      setSubjects(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTopics();
    fetchSubjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !subjectId) return;

    try {
      if (editingId) {
        const response = await api.put(`/topics/${editingId}`, {
          name: name.trim(),
        });

        setTopics(
          topics.map((topic) =>
            topic.id === editingId ? response.data : topic
          )
        );

        setEditingId(null);
      } else {
        const response = await api.post("/topics", {
          subject_id: Number(subjectId),
          name: name.trim(),
        });

        setTopics([...topics, response.data]);
      }

      setName("");
      setSubjectId("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this topic?")) return;

    try {
      await api.delete(`/topics/${id}`);
      setTopics(topics.filter((topic) => topic.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <p className="text-sm font-medium text-indigo-600">Curriculum</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Topics</h1>
        <p className="mt-1 text-sm text-slate-500">
          Organize learning topics under each subject.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-slate-900">
            {editingId ? "Edit Topic" : "Add Topic"}
          </h2>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
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

            <input
              type="text"
              placeholder="e.g. Fractions"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />

            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              {editingId ? "Update Topic" : "Add Topic"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setName("");
                  setSubjectId("");
                }}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600"
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="font-bold text-slate-900">Learning Topics</h2>
            <p className="mt-1 text-sm text-slate-500">
              {topics.length} topics available
            </p>
          </div>

          {loading ? (
            <div className="p-6 text-sm text-slate-500">Loading...</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {topics.map((topic) => (
                <div
                  key={topic.id}
                  className="flex items-center justify-between gap-4 px-6 py-4"
                >
                  <div>
                    <p className="font-semibold text-slate-800">
                      {topic.name}
                    </p>

                    <span className="mt-1 inline-block rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-600">
                      {topic.subject.name}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingId(topic.id);
                        setName(topic.name);
                        setSubjectId(topic.subject_id);
                      }}
                      className="rounded-lg px-3 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(topic.id)}
                      className="rounded-lg px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
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

export default Topics;