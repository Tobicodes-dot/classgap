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
      console.error("Failed to load classes:", error);
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
          classes.map((schoolClass) =>
            schoolClass.id === editingId
              ? response.data
              : schoolClass
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
      console.error("Failed to save class:", error);
    }
  };

  const handleEdit = (schoolClass) => {
    setEditingId(schoolClass.id);
    setName(schoolClass.name);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/classes/${id}`);

      setClasses(
        classes.filter((schoolClass) => schoolClass.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete class:", error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setName("");
  };

  return (
    <div>
      <h1>Classes</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="e.g. JSS 3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button type="submit">
          {editingId ? "Update Class" : "Add Class"}
        </button>

        {editingId && (
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </form>

      {loading ? (
        <p>Loading classes...</p>
      ) : classes.length === 0 ? (
        <p>No classes found.</p>
      ) : (
        <div>
          {classes.map((schoolClass) => (
            <div key={schoolClass.id}>
              <span>{schoolClass.name}</span>

              <button onClick={() => handleEdit(schoolClass)}>
                Edit
              </button>

              <button onClick={() => handleDelete(schoolClass.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Classes;