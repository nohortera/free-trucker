require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const apiRouter = express.Router()
const authRouter = require('./routers/authRouter');
const truckRouter = require('./routers/truckRouter');
const profRouter = require('./routers/profRouter');
const loadRouter = require('./routers/loadRouter');

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', '*');
    res.append('Access-Control-Allow-Methods', '*');
    res.append('Access-Control-Allow-Headers', '*');
    next();
});
app.use('/api', apiRouter);

apiRouter.use('/auth', authRouter);
apiRouter.use('/trucks', truckRouter);
apiRouter.use('/users', profRouter);
apiRouter.use('/loads', loadRouter);


const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://admin:a1d2m3i4n5@cluster0.fpbgv.mongodb.net/uber_clone?retryWrites=true&w=majority');
        app.listen(PORT, () => {
            console.log(`Server has been started on port ${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
};

start();
