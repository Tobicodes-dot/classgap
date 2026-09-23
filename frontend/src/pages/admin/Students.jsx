import { useEffect, useState } from "react";
import api from "../../api/axios";

function Students() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [classId, setClassId] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      const response = await api.get("/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Failed to load students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    try {
      if (editingId) {
        const response = await api.put(`/students/${editingId}`, {
          name: name.trim(),
          class_id: classId,
        });

        setStudents(
          students.map((student) =>
            student.id === editingId ? response.data : student
          )
        );

        setEditingId(null);
      } else {
        const response = await api.post("/students", {
          school_id: 1,
          class_id: classId,
          name: name.trim(),
        });

        setStudents([...students, response.data]);
      }

      setName("");
      setClassId(1);
    } catch (error) {
      console.error("Failed to save student:", error);
    }
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
    setName(student.name);
    setClassId(student.class_id);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/students/${id}`);

      setStudents(
        students.filter((student) => student.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete student:", error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setName("");
    setClassId(1);
  };

  return (
    <div>
      <h1>Students</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Student name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Class ID"
          value={classId}
          onChange={(e) => setClassId(Number(e.target.value))}
        />

        <button type="submit">
          {editingId ? "Update Student" : "Add Student"}
        </button>

        {editingId && (
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </form>

      {loading ? (
        <p>Loading students...</p>
      ) : students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <div>
          {students.map((student) => (
            <div key={student.id}>
              <span>
                {student.name} — Class {student.class_id}
              </span>

              <button onClick={() => handleEdit(student)}>
                Edit
              </button>

              <button onClick={() => handleDelete(student.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Students;