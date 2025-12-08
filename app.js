const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const hookRoutes = require('./routes/hook.routes');
const eventsRoutes = require('./routes/events.routes');
const clientRoutes = require('./routes/client.routes');
const documentRoutes = require('./routes/document.routes');
const erpRoutes = require('./routes/erp.routes');
const livraisonRoutes = require('./routes/livraison.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true,
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Content-type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/hooks', hookRoutes);
app.use('/events', eventsRoutes);
app.use('/client', clientRoutes);
app.use('/document-type', documentRoutes);
app.use('/erp', erpRoutes);
app.use('/livraison', livraisonRoutes);
app.use('/custom-interop-team', adminRoutes);

module.exports = app;
