const express = require('express');
const cors = require('cors');

const app = express();

const appRoutes = require('./routes/applications');
const contactRoutes = require('./routes/contacts');
const outreachRoutes = require('./routes/outreach');
const eventRoutes = require('./routes/events');
const noteRoutes = require('./routes/notes');
const notifRoutes = require('./routes/notifications');


//Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Job App Tracker API running successfully' });
});

//App routes
app.use('/applications', appRoutes);
app.use('/contacts', contactRoutes);
app.use('/outreach', outreachRoutes);
app.use('/events', eventRoutes);
app.use('/notes', noteRoutes);
app.use('/notifications', notifRoutes);



// Global error handler
app.use((err, req, res, next) => {
    const status = err.status || 500;
    return res.status(status).json({
        error: err.message
    });
});

module.exports = app;