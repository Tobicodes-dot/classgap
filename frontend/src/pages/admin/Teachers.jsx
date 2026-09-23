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
      console.error("Failed to load teachers:", error);
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
            teacher.id === editingId
              ? response.data
              : teacher
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
      console.error("Failed to save teacher:", error);
    }
  };

  const handleEdit = (teacher) => {
    setEditingId(teacher.id);
    setName(teacher.name);
    setEmail(teacher.email);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/teachers/${id}`);

      setTeachers(
        teachers.filter((teacher) => teacher.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete teacher:", error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setName("");
    setEmail("");
  };

  return (
    <div>
      <h1>Teachers</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Teacher name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Teacher email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit">
          {editingId ? "Update Teacher" : "Add Teacher"}
        </button>

        {editingId && (
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </form>

      {loading ? (
        <p>Loading teachers...</p>
      ) : teachers.length === 0 ? (
        <p>No teachers found.</p>
      ) : (
        <div>
          {teachers.map((teacher) => (
            <div key={teacher.id}>
              <span>
                {teacher.name} — {teacher.email}
              </span>

              <button onClick={() => handleEdit(teacher)}>
                Edit
              </button>

              <button onClick={() => handleDelete(teacher.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Teachers;