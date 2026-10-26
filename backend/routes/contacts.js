const Contact = require('../models/Contact');
const express = require('express');
const router = express.Router();

//Get all contacts
router.get('/', async (req, res, next) => {
    try {
        const filters = req.query;
        const result = await Contact.getAll(filters);
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});

//Get contacts by app id
router.get('/application/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await Contact.getByApplication(id);
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});

//Get contact with id
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await Contact.getById(id);
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});

//Create new contact
router.post('/', async (req, res, next) => {
    try {
        const result = await Contact.create(req.body);
        return res.status(201).json(result);
    } catch (err) {
        next(err);
    }
});

//Updated a contact with id
router.patch('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await Contact.update(id, req.body);
        return res.status(200).json(result);       
    } catch (err) {
        next(err);
    }
});

//Delete a contact
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        await Contact.delete(id);
        return res.status(200).json('Contact deleted.');
    } catch (err) {
        next(err);
    }
});

module.exports = router;
