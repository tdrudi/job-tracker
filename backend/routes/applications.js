const Application = require('../models/Application');
const express = require('express');
const router = express.Router();

//Get all applications
router.get('/', async (req, res, next) => {
    try {
        const filters = req.query;
        const result = await Application.getAll(filters);
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});

//Get applocation with id
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await Application.getById(id);
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});


//Create new application
router.post('/', async (req, res, next) => {
    try {
        const result = await Application.create(req.body);
        return res.status(201).json(result);
    } catch (err) {
        next(err);
    }
});

//Updated an application with id
router.patch('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await Application.update(id, req.body);
        return res.status(200).json(result);       
    } catch (err) {
        next(err);
    }
});

//Delete an application
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        await Application.delete(id);
        return res.status(200).json('Contact deleted.');

    } catch (err) {
        next(err);
    }
});

module.exports = router;