const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const chalk = require('chalk');
const config = require('./config');
var cors = require('cors')

dotenv.config({ path: '.env' });

const app = express();
const port = 8080;
const db = config.MONGODB_URI;

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(db);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

var {User} = require('./models/user');

mongoose.connection.once('open', () => {
  console.log("Connected to MongoDB");

  var user = new User({email: "user1@gmail.com", firstName: "firstName1",
  lastName: "lastName1", password: "123"})

  user.save((err, user) => {
    if (err) return console.error(err);
    console.log("USER " + user.id);
  })
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

require("./routes/index")(app);

app.listen(port, () => {
  console.log('%s App is running at http://localhost:%d', chalk.green('✓'), port);
})

module.exports = app;