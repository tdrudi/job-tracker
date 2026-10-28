const express = require('express');
const router = express.Router();
const Outreach = require('../models/Outreach');

// Get all outreach records
router.get('/', async (req, res, next) => {
  try {
    const result = await Outreach.getAll();
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// Get all outreach records for a specific application ID
router.get('/application/:applicationId', async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const result = await Outreach.getByApplicationId(applicationId);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// Get single outreach record with id
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Outreach.getById(id);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// Create new outreach record
router.post('/', async (req, res, next) => {
  try {
    const result = await Outreach.create(req.body);
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

// Update an outreach record with id
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Outreach.update(id, req.body);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// Delete an outreach record with id
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Outreach.delete(id);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;