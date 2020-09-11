const {Storage} = require('@google-cloud/storage');
const {format} = require('util');
const { User } = require('../models/user');

const storage = new Storage({
  keyFilename: "./server_key.json",
});

let bucketName = "chatapp-414a5.appspot.com"

const bucket = storage.bucket(bucketName);

exports.uploadFile = (req, res, next) => {

  const userId = req.userId;

  console.log(req.file);

  if (!req.file) {
    res.status(400).send('No file uploaded.');
    return;
  }

  const blob = bucket.file(req.file.originalname);
  const blobStream = blob.createWriteStream();

  blobStream.on('error', (err) => {
    next(err);
  });

  blobStream.on('finish', () => {
    // The public URL can be used to directly access the file via HTTP.
    const publicUrl = format(
      `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${blob.name}?alt=media`
    );

    console.log(userId);
    User.findByIdAndUpdate(userId, {profileImageUrl: publicUrl}, (err, user) => {
      if (err) return res.status(500).send('Error on the server.');
      if (!user) return res.status(404).send("User not found");

      console.log(user);

      res.status(200).send(publicUrl);
    })
  });

  blobStream.end(req.file.buffer);
}