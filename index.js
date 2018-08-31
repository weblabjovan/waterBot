const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config/config');
const reminderCron = require('./helpers/reminderCron');

mongoose.connect(config.MONGO_URI);
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'pug');

require('./routes/botRoutes')(app);

app.get('/', (req, res) => {
    res.render('index')
})
require('./routes/messageRoutes')(app);
require('./routes/reminderRoutes')(app);

reminderCron.start();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log('AUTH listening to the port ' + PORT);
})