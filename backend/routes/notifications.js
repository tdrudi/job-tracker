const Notification = require('../models/Notification');
const express = require('express');
const router = express.Router();

//Get all Notifications
router.get('/', async (req, res, next) => {
    try {
        const result = await Notification.getAll();
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});

//Get all upcoming notifications
router.get('/upcoming', async (req, res, next) => {
    try {
        const result = await Notification.getUpcoming();
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});


//Get Notification with id
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await Notification.getById(id);
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});


//Create new Notification
router.post('/', async (req, res, next) => {
    try {
        const result = await Notification.create(req.body);
        return res.status(201).json(result);
    } catch (err) {
        next(err);
    }
});

//Updated a Notification with id
router.patch('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await Notification.update(id, req.body);
        return res.status(200).json(result);       
    } catch (err) {
        next(err);
    }
});

//Delete a Notification
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        await Notification.delete(id);
        return res.status(200).json('Notification deleted.');
    } catch (err) {
        next(err);
    }
});

module.exports = router;
