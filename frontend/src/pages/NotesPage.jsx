import { useEffect, useMemo, useState } from 'react';
import api from '../services/api.js';

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/notes', {
        params: { status: filter, q: query }
      });
      setNotes(response.data.data.notes);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [filter, query]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title || !content) return;
    setLoading(true);
    setError(null);

    try {
      if (editId) {
        await api.put(`/api/notes/${editId}`, { title, content });
      } else {
        await api.post('/api/notes', { title, content });
      }
      setTitle('');
      setContent('');
      setEditId(null);
      await loadNotes();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save note');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditId(note._id);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/notes/${id}`);
      await loadNotes();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete note');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (note) => {
    setLoading(true);
    setError(null);
    try {
      await api.put(`/api/notes/${note._id}`, { completed: !note.completed });
      await loadNotes();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update note');
    } finally {
      setLoading(false);
    }
  };

  const filteredNotes = useMemo(
    () => notes,
    [notes]
  );

  return (
    <section className="notes-page">
      <div className="notes-header">
        <div>
          <h1>Your Notes</h1>
          <p>Manage notes with search and filters.</p>
        </div>
        <div className="notes-actions">
          <input
            type="search"
            placeholder="Search notes"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      <form className="note-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>{editId ? 'Update Note' : 'Create Note'}</button>
      </form>

      {error && <div className="alert">{error}</div>}
      {loading && <div className="loader">Loading notes…</div>}

      <div className="notes-grid">
        {filteredNotes.length === 0 && !loading ? (
          <div className="empty-state">No notes found.</div>
        ) : (
          filteredNotes.map((note) => (
            <article key={note._id} className={`note-card ${note.completed ? 'completed' : ''}`}>
              <div className="note-meta">
                <span>{note.createdAt ? new Date(note.createdAt).toLocaleDateString() : ''}</span>
                <button onClick={() => handleToggleStatus(note)}>
                  {note.completed ? 'Mark Pending' : 'Mark Done'}
                </button>
              </div>
              <h2>{note.title}</h2>
              <p>{note.content}</p>
              <div className="note-footer">
                <button onClick={() => handleEdit(note)}>Edit</button>
                <button className="danger" onClick={() => handleDelete(note._id)}>Delete</button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
};

export default NotesPage;
