const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const chalk = require('chalk');
const config = require('./config');
const bcrypt = require('bcryptjs');
const cors = require('cors')
const { User } = require('./models/user');
const {Message} = require('./models/message');
const {Storage} = require('@google-cloud/storage');

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


mongoose.connection.once('open', () => {
  console.log("Connected to MongoDB");

  var user1 = new User({
    email: "user1@gmail.com", firstName: "firstName1",
    lastName: "lastName1",  password: bcrypt.hashSync("123", 8),
    profileImageUrl: "https://firebasestorage.googleapis.com/v0/b/chatapp-414a5.appspot.com/o/pexels-avonne-stalling-3916455.jpg?alt=media"
  })

  user1.save((err, user) => {
    if (err) return console.error(err);
    console.log("USER " + user1.id);

    var user2 = new User({
      email: "user2@gmail.com", firstName: "firstName2",
      lastName: "lastName2", password: bcrypt.hashSync("123", 8), friends: [user1.id],
      profileImageUrl: "https://firebasestorage.googleapis.com/v0/b/chatapp-414a5.appspot.com/o/pexels-filipi-escudine-3802823.jpg?alt=media"
    })

    user2.inbox.push(user1.id);


    user2.save((err, user) => {
      if (err) return console.error(err);
      console.log("USER " + user2.id);

      user1.friends.push(user2.id);
      user1.inbox.push(user2.id)

      user1.save();

      let msg1 = new Message({from: user1.id, to: user2.id, value: "Cao "});
      msg1.save();
      let msg2 = new Message({from: user2.id, to: user1.id, value: "Ejj "});
      msg2.save();
      let msg3 = new Message({from: user1.id, to: user2.id, value: "Kako si ?"});
      msg3.save();
      let msg4 = new Message({from: user2.id, to: user1.id, value: "Dobro. Ti? "});
      msg4.save();


    })

  })

  var user3 = new User({
    email: "user3@gmail.com", firstName: "firstName3",
    lastName: "lastName3", password: bcrypt.hashSync("123", 8),
    profileImageUrl: "https://firebasestorage.googleapis.com/v0/b/chatapp-414a5.appspot.com/o/pexels-mentatdgt-937481.jpg?alt=media"
  })

  user3.save((err, user) => {
    if (err) return console.error(err);
    console.log("USER " + user3.id);
  })
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// for parsing multipart/form-data

app.use(cors());

require("./routes/index")(app);

app.listen(port, () => {
  console.log('%s App is running at http://localhost:%d', chalk.green('✓'), port);
})

module.exports = app;