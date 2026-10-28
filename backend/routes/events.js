const Event = require('../models/Event');
const express = require('express');
const router = express.Router();

//Get all events
router.get('/', async (req, res, next) => {
    try {
        const filters = req.query;
        const result = await Event.getAll(filters);
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});

//Get events by app id
router.get('/application/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await Event.getByApplication(id);
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});

//Get event with id
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await Event.getById(id);
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});

//Create new event
router.post('/', async (req, res, next) => {
    try {
        const result = await Event.create(req.body);
        return res.status(201).json(result);
    } catch (err) {
        next(err);
    }
});

//Updated an event with id
router.patch('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await Event.update(id, req.body);
        return res.status(200).json(result);       
    } catch (err) {
        next(err);
    }
});

//Delete an event
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        await Event.delete(id);
        return res.status(200).json('Event deleted.');
    } catch (err) {
        next(err);
    }
});

module.exports = router;