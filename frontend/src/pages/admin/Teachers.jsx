import { useEffect, useState } from "react";
import api from "../../api/axios";

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTeachers = async () => {
    try {
      const response = await api.get("/teachers");
      setTeachers(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTeachers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) return;

    try {
      if (editingId) {
        const response = await api.put(`/teachers/${editingId}`, {
          name: name.trim(),
          email: email.trim(),
        });

        setTeachers(
          teachers.map((teacher) =>
            teacher.id === editingId ? response.data : teacher
          )
        );

        setEditingId(null);
      } else {
        const response = await api.post("/teachers", {
          school_id: 1,
          name: name.trim(),
          email: email.trim(),
        });

        setTeachers([...teachers, response.data]);
      }

      setName("");
      setEmail("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (teacher) => {
    setEditingId(teacher.id);
    setName(teacher.name);
    setEmail(teacher.email);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this teacher?")) return;

    try {
      await api.delete(`/teachers/${id}`);
      setTeachers(teachers.filter((teacher) => teacher.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <p className="text-sm font-medium text-indigo-600">Management</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Teachers</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage teachers in your school.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-slate-900">
            {editingId ? "Edit Teacher" : "Add Teacher"}
          </h2>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <input
              type="text"
              placeholder="Teacher name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />

            <input
              type="email"
              placeholder="Teacher email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                {editingId ? "Update Teacher" : "Add Teacher"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setName("");
                    setEmail("");
                  }}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="font-bold text-slate-900">All Teachers</h2>
            <p className="mt-1 text-sm text-slate-500">
              {teachers.length} teachers registered
            </p>
          </div>

          {loading ? (
            <div className="p-6 text-sm text-slate-500">Loading...</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {teachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="flex items-center justify-between gap-4 px-6 py-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600">
                      {teacher.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-800">
                        {teacher.name}
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {teacher.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => handleEdit(teacher)}
                      className="rounded-lg px-3 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(teacher.id)}
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

export default Teachers;