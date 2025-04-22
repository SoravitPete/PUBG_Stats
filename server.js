const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');

//load env
dotenv.config({ path: './config.env'})

const app = express();

app.use(cors());

// Dev logging
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//Profile routes
app.use('/api/v1/profile', require('./routes/profile'))
app.use('/api/v1/history', require('./routes/history')) // return history that match from 2 players
app.use('/api/v1/matchDetail', require('./routes/matchDetail'))

const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(` Server runiing in ${process.env.NODE_ENV} mode on port ${port}`);
});
