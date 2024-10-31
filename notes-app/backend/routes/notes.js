const express = require('express');
const Note = require('../models/note');

const router = express.Router();

// Get all notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new note
router.post('/', async (req, res) => {
  const { title, content } = req.body;
  const newNote = new Note({ title, content });
  try {
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a note
router.put('/:id', async (req, res) => {
  const { title, content } = req.body;
  try {
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );
    res.json(updatedNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a note
router.delete('/:id', async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
