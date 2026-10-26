const Note = require('../models/Note');
const express = require('express');
const router = express.Router();

//Get all events
router.get('/', async (req, res, next) => {
    try {
        const result = await Note.getAll();
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});

//Get all notes with app id
router.get('/application/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await Note.getByApplication(id);
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});

//Create new note
router.post('/', async (req, res, next) => {
    try {
        const result = await Note.create(req.body);
        return res.status(201).json(result);
    } catch (err) {
        next(err);
    }
});

//Get note with id
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await Note.getById(id);
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});


//Updated a note with id
router.patch('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await Note.update(id, req.body);
        return res.status(200).json(result);       
    } catch (err) {
        next(err);
    }
});

//Delete a note
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        await Note.delete(id);
        return res.status(200).json('Note deleted.');
    } catch (err) {
        next(err);
    }
});

module.exports = router;
