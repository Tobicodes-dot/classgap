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
      console.error("Failed to load topics:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await api.get("/subjects");
      setSubjects(response.data);
    } catch (error) {
      console.error("Failed to load subjects:", error);
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
      console.error("Failed to save topic:", error);
    }
  };

  const handleEdit = (topic) => {
    setEditingId(topic.id);
    setName(topic.name);
    setSubjectId(topic.subject_id);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/topics/${id}`);

      setTopics(
        topics.filter((topic) => topic.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete topic:", error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setName("");
    setSubjectId("");
  };

  return (
    <div>
      <h1>Topics</h1>

      <form onSubmit={handleSubmit}>
        <select
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
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
          placeholder="e.g. Algebra"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button type="submit">
          {editingId ? "Update Topic" : "Add Topic"}
        </button>

        {editingId && (
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </form>

      {loading ? (
        <p>Loading topics...</p>
      ) : topics.length === 0 ? (
        <p>No topics found.</p>
      ) : (
        <div>
          {topics.map((topic) => (
            <div key={topic.id}>
              <span>
                {topic.name} — {topic.subject.name}
              </span>

              <button onClick={() => handleEdit(topic)}>
                Edit
              </button>

              <button onClick={() => handleDelete(topic.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Topics;