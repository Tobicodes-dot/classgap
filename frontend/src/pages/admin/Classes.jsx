import { useEffect, useState } from "react";
import api from "../../api/axios";

function Classes() {
  const [classes, setClasses] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchClasses = async () => {
    try {
      const response = await api.get("/classes");
      setClasses(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchClasses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      if (editingId) {
        const response = await api.put(`/classes/${editingId}`, {
          name: name.trim(),
        });

        setClasses(
          classes.map((item) =>
            item.id === editingId ? response.data : item
          )
        );

        setEditingId(null);
      } else {
        const response = await api.post("/classes", {
          school_id: 1,
          name: name.trim(),
        });

        setClasses([...classes, response.data]);
      }

      setName("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setName(item.name);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this class?")) return;

    try {
      await api.delete(`/classes/${id}`);
      setClasses(classes.filter((item) => item.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <p className="text-sm font-medium text-indigo-600">Management</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Classes</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage the classes in your school.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-slate-900">
            {editingId ? "Edit Class" : "Add Class"}
          </h2>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <input
              type="text"
              placeholder="e.g. JSS 3"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                {editingId ? "Update Class" : "Add Class"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setName("");
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
            <h2 className="font-bold text-slate-900">All Classes</h2>
            <p className="mt-1 text-sm text-slate-500">
              {classes.length} classes registered
            </p>
          </div>

          {loading ? (
            <div className="p-6 text-sm text-slate-500">Loading...</div>
          ) : classes.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-500">
              No classes found.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {classes.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div>
                    <p className="font-semibold text-slate-800">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      Class ID #{item.id}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="rounded-lg px-3 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
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

export default Classes;