import { useEffect, useState } from "react";
import api from "../../api/axios";

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
      console.error("Failed to load subjects:", error);
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
      console.error("Failed to save subject:", error);
    }
  };

  const handleEdit = (subject) => {
    setEditingId(subject.id);
    setName(subject.name);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/subjects/${id}`);

      setSubjects(
        subjects.filter((subject) => subject.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete subject:", error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setName("");
  };

  return (
    <div>
      <h1>Subjects</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="e.g. Mathematics"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button type="submit">
          {editingId ? "Update Subject" : "Add Subject"}
        </button>

        {editingId && (
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </form>

      {loading ? (
        <p>Loading subjects...</p>
      ) : subjects.length === 0 ? (
        <p>No subjects found.</p>
      ) : (
        <div>
          {subjects.map((subject) => (
            <div key={subject.id}>
              <span>{subject.name}</span>

              <button onClick={() => handleEdit(subject)}>
                Edit
              </button>

              <button onClick={() => handleDelete(subject.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Subjects;