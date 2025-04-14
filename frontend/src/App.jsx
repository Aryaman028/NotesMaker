import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function NotesApp() {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingNote, setEditingNote] = useState(null);

  // Fetch all notes from the backend
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/notes");
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  // Create a new note
  const createNote = async () => {
    if (!title || !content) {
      alert("Both title and content are required");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/notes", {
        title,
        content,
      });
      setNotes([...notes, response.data]);
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  // Delete a note
  const deleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`);
      setNotes(notes.filter((note) => note.id !== id));
      window.location.reload();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  // Edit a note
  const editNote = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  // Update the note after editing
  const updateNote = async () => {
    if (!title || !content) {
      alert("Both title and content are required");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/notes/${editingNote._id}`,
        { title, content }
      );
      const updatedNotes = notes.map((note) =>
        note._id === editingNote._id ? response.data : note
      );
      setNotes(updatedNotes);
      setEditingNote(null);
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  // Filter notes based on the search term
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Navbar with logo and search bar */}
      <nav className="navbar">
        <div className="logo">NotesApp</div>
        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </nav>

      <div className="container">
        {/* Note Form */}
        <div className="note-card">
          <h2>{editingNote ? "Edit Note" : "Add Note"}</h2>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {editingNote ? (
            <button onClick={updateNote}>Update Note</button>
          ) : (
            <button onClick={createNote}>Create Note</button>
          )}
        </div>

        <h2>All Notes</h2>

        {/* Grid of Notes */}
        <div className="notes-grid">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <div className="note-card" key={note._id}>
                <h3>{note.title}</h3>
                <p>{note.content}</p>
                <button onClick={() => editNote(note)}>Edit</button>
                <button onClick={() => deleteNote(note._id)}>Delete</button>
              </div>
            ))
          ) : (
            <p>No notes found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotesApp;
