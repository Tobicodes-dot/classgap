import { useEffect, useState } from "react";
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
      console.error("Failed to load students:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await api.get("/classes");
      setClasses(response.data);
    } catch (error) {
      console.error("Failed to load classes:", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStudents();
    fetchClasses();
  }, []);

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
            student.id === editingId
              ? response.data
              : student
          )
        );

        setEditingId(null);
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

      setName("");
      setEmail("");
      setPassword("");
      setSchoolClassId("");
    } catch (error) {
      console.error("Failed to save student:", error);
    }
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
    setName(student.user.name);
    setEmail(student.user.email);
    setSchoolClassId(student.school_class_id);
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
    setEmail("");
    setPassword("");
    setSchoolClassId("");
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

        {!editingId && (
          <>
            <input
              type="email"
              placeholder="Student email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </>
        )}

        <select
          value={schoolClassId}
          onChange={(e) => setSchoolClassId(e.target.value)}
        >
          <option value="">Select class</option>

          {classes.map((schoolClass) => (
            <option key={schoolClass.id} value={schoolClass.id}>
              {schoolClass.name}
            </option>
          ))}
        </select>

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
                {student.user.name} — {student.user.email} —{" "}
                {student.school_class.name}
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