const Message = require("../models/Message");
const User = require("../models/User");
const Rooms = require("../models/Rooms");
const addMessage = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({ _id: req.payload.userId });
    if (!foundUser){
      return res
      .status(403)
      .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    }
  const {RoomId,text} = req.body;
  const room = await Rooms.findOne({ _id: RoomId }); 

  req.io.to(RoomId)
        .emit('send-message', {
          RoomId:RoomId ,text:text, sender: foundUser._id
        } )

  if(room.active == true){
    const savedMessage = await Message.create({ RoomId:RoomId ,text:text, sender: foundUser._id });
    return res.status(200).json(savedMessage);

  }


  res.status(401).json({message:"Không thể Gửi được tin nhắn"});
  } catch (err) {
    next(err)
  }
}
const cancelMessage = async (req, res, next) => {
    try {
      const foundUser = await User.findOne({ _id: req.payload.userId });
     if (!foundUser){
      return res
      .status(403)
      .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    }
        const message = await Message.findOne({
            _id: req.params.messageId
        });
        message.active = false;
        await message.save();
        res.status(200).json(message);
      } catch (err) {
        next(err)
      }
}
const getMessage = async (req, res, next) => {
    try {
      const foundUser = await User.findOne({ _id: req.payload.userId });
    if (!foundUser){
      return res
      .status(403)
      .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    }
        const messages = await Message.find({
            RoomId: req.params.RoomID,
        });
        res.status(200).json(messages);
      } catch (err) {
        next(err)
      }
}

module.exports = {
    addMessage,
    cancelMessage,
    getMessage}