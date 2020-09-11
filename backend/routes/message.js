const { User, toDto } = require('../models/user');
const validateParams = require('../util/validator');
const { Message } = require('../models/message');
const {getIds} = require('../util/helper');


/**
 * GET /user/inbox
 * Get user inbox
 */
exports.getInbox = (req, res, next) => {
  const userId = req.userId;

  User.findById(userId, async (err, user) => {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send("User not found");

    let ids = getIds(user.inbox);

    let data = [];

    for (const friendId of ids) {

      const friend = await User.findById(friendId, (err) => {
        if (err) return res.status(500).send('err');
      });

      if (!friend) {
        return res.status(404).send("User not found");
      }

      const msg = await Message.findOne({ $or: [{ from: userId, to: friendId }, { from: friendId, to: userId }] }, (err) => {
        if (err) return res.status(500).send('err');
      }).sort({ createdAt: -1 });

      if (!msg) {
        return;
      }

      data.push({
        friend: toDto(friend),
        msg
      });
    }

    return res.status(200).send(data);
  })

}

/**
 * GET /user/inbox/id
 * Get user chat with friend
 */
exports.getSingleChat = (req, res, next) => {
  const userId = req.userId;
  const friendId = req.params.id;

  const pageOptions = {
    page: parseInt(req.query.page, 10) || 0,
    size: parseInt(req.query.size, 10) || 10
  }

  User.findById(userId, async (err, user) => {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send("User not found");


    Message.find({ $or: [{ from: userId, to: friendId }, { from: friendId, to: userId }] }, (err, msgs) => {
      if (err) return res.status(500).send("Error on the server.");

      return res.status(200).send(msgs);

    })
    .sort({createdAt: 1})
    .skip(pageOptions.page * pageOptions.size)
    .limit(pageOptions.limit);

  })

}

/**
 * POST /user/message
 * Send message
 */
exports.sendMessage = (req, res, next) => {
  const userId = req.userId;

  let {friendId, message} = req.body;

  validateParams({friendId, message}, res);


  User.findById(userId, async (err, user) => {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send("User not found");

    if (!user.inbox.includes(friendId)) {
      user.inbox.push(friendId);
    }

    User.findById(friendId, async (err, friend) => {
      if (err) return res.status(500).send('Error on the server.');
      if (!user) return res.status(404).send("User not found");
  
      if (!friend.inbox.includes(userId)) {
        friend.inbox.push(userId);
      }
  

      user.save();
      friend.save();
      
      let msg = new Message({from: userId, to: friendId, value: message});
      msg.save();
  
      return res.status(200).send(msg);
    })


  })

}
