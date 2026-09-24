import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

function Students() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [schoolClassId, setSchoolClassId] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      const response = await api.get("/students");
      setStudents(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await api.get("/classes");
      setClasses(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStudents();
    fetchClasses();
  }, []);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setSchoolClassId("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !schoolClassId) return;

    try {
      if (editingId) {
        const response = await api.put(`/students/${editingId}`, {
          school_class_id: Number(schoolClassId),
        });

        setStudents(
          students.map((student) =>
            student.id === editingId ? response.data : student
          )
        );
      } else {
        if (!email.trim() || !password.trim()) return;

        const response = await api.post("/students", {
          name: name.trim(),
          email: email.trim(),
          password,
          school_id: 1,
          school_class_id: Number(schoolClassId),
        });

        setStudents([...students, response.data]);
      }

      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
    setName(student.user.name);
    setEmail(student.user.email);
    setSchoolClassId(student.school_class_id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this student?")) return;

    try {
      await api.delete(`/students/${id}`);
      setStudents(students.filter((student) => student.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <p className="text-sm font-medium text-indigo-600">Management</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Students</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage student accounts and class assignments.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-slate-900">
            {editingId ? "Edit Student" : "Add Student"}
          </h2>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <input
              type="text"
              placeholder="Student name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />

            {!editingId && (
              <>
                <input
                  type="email"
                  placeholder="Student email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />
              </>
            )}

            <select
              value={schoolClassId}
              onChange={(e) => setSchoolClassId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">Select class</option>

              {classes.map((schoolClass) => (
                <option key={schoolClass.id} value={schoolClass.id}>
                  {schoolClass.name}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                {editingId ? "Update Student" : "Add Student"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
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
            <h2 className="font-bold text-slate-900">All Students</h2>
            <p className="mt-1 text-sm text-slate-500">
              {students.length} students registered
            </p>
          </div>

          {loading ? (
            <div className="p-6 text-sm text-slate-500">Loading...</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between gap-4 px-6 py-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600">
                      {student.user.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-800">
                        {student.user.name}
                      </p>

                      <p className="truncate text-xs text-slate-400">
                        {student.user.email}
                      </p>

                      <span className="mt-1 inline-block rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-500">
                        {student.school_class.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <Link
                      to={`/admin/students/${student.id}/progress`}
                      className="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-100"
                    >
                      Progress
                    </Link>

                    <button
                      onClick={() => handleEdit(student)}
                      className="rounded-lg px-3 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(student.id)}
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

export default Students;