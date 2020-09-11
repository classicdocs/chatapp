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


// mongoose.connection.once('open', () => {
//   console.log("Connected to MongoDB");

//   var user1 = new User({
//     email: "user1@gmail.com", firstName: "firstName1",
//     lastName: "lastName1",  password: bcrypt.hashSync("123", 8)
//   })

//   user1.save((err, user) => {
//     if (err) return console.error(err);
//     console.log("USER " + user1.id);

//     var user2 = new User({
//       email: "user2@gmail.com", firstName: "firstName2",
//       lastName: "lastName2", password: bcrypt.hashSync("123", 8), friends: [user1.id]
//     })

//     user2.inbox.push(user1.id);


//     user2.save((err, user) => {
//       if (err) return console.error(err);
//       console.log("USER " + user2.id);

//       user1.friends.push(user2.id);
//       user1.inbox.push(user2.id)

//       user1.save();

//       let msg1 = new Message({from: user1.id, to: user2.id, value: "Cao "});
//       msg1.save();
//       let msg2 = new Message({from: user2.id, to: user1.id, value: "Ejj "});
//       msg2.save();
//       let msg3 = new Message({from: user1.id, to: user2.id, value: "Kako si ?"});
//       msg3.save();
//       let msg4 = new Message({from: user2.id, to: user1.id, value: "Dobro. Ti? "});
//       msg4.save();


//     })

//   })

//   var user3 = new User({
//     email: "user3@gmail.com", firstName: "firstName3",
//     lastName: "lastName3", password: bcrypt.hashSync("123", 8)
//   })

//   user3.save((err, user) => {
//     if (err) return console.error(err);
//     console.log("USER " + user3.id);
//   })
// })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// for parsing multipart/form-data

app.use(cors());

app.use(function (err, req, res, next) {
  console.log('This is the invalid field ->', err.field)
  console.log(res);
  next(err)
})

require("./routes/index")(app);




// const storage = new Storage({
//   keyFilename: "./server_key.json",
// });

// let bucketName = "chatapp-414a5.appspot.com"

// let filename = './test.txt';

// // Testing out upload of file
// const uploadFile = async() => {


//   // Uploads a local file to the bucket
//   await storage.bucket(bucketName).upload(filename, {
//       // Support for HTTP requests made with `Accept-Encoding: gzip`
//       gzip: true,
//       // By setting the option `destination`, you can change the name of the
//       // object you are uploading to a bucket.
//       metadata: {
//           // Enable long-lived HTTP caching headers
//           // Use only if the contents of the file will never change
//           // (If the contents will change, use cacheControl: 'no-cache')
//           cacheControl: 'public, max-age=31536000',
//       },
// });

// console.log(`${filename} uploaded to ${bucketName}.`);
// }

// uploadFile();



app.listen(port, () => {
  console.log('%s App is running at http://localhost:%d', chalk.green('✓'), port);
})

module.exports = app;