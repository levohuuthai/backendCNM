const User = require("../models/User");
const Rooms = require("../models/Rooms");
const mongoose = require("mongoose");

const addRoom = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({ _id: req.payload.userId });
    if (!foundUser) {
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    }
    const name = req.body.NameGroup;
    const ListUsers = req.body.ListUsers;
    let users = [];
    for (let i = 0; i < ListUsers.length; i++) {
      users.push(mongoose.Types.ObjectId(ListUsers[i]));
    }
    users.push(foundUser._id);
    const newRoom = new Rooms({
      name,
      users,
      group: true,
      roomMaster: foundUser._id,
    });
    const saveRoom = await newRoom.save();
    res.status(200).json(saveRoom);
  } catch (err) {
    next(err);
  }
};
const getRoomAfterLogin = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({ _id: req.payload.userId });
    if (!foundUser) {
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    }
    const Room = await Rooms.find({
      users: { $in: [foundUser._id] },
    });
    res.status(200).json(Room);
  } catch (err) {
    next(err);
  }
};
const getRoomFriend = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({ _id: req.payload.userId });
    if (!foundUser) {
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    }
    const Room = await Rooms.find({
      users: { $in: [foundUser._id] },
      group: false,
    });
    res.status(200).json(Room);
  } catch (err) {
    next(err);
  }
};
const getRoomGroup = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({ _id: req.payload.userId });
    if (!foundUser) {
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    }
    const Room = await Rooms.find({
      users: { $in: [foundUser._id] },
      group: true,
    });
    res.status(200).json(Room);
  } catch (err) {
    next(err);
  }
};
const getRoomByUserId = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({ _id: req.payload.userId });
    if (!foundUser) {
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    }
    if (foundUser._id == req.params.userId) {
      const Room = await Rooms.find({
        users: { $in: [foundUser._id] },
      });
      res.status(200).json(Room);
    } else {
      const Room = await Rooms.find({
        users: { $in: [foundUser._id] },
      });
      res.status(200).json(Room);
    }
  } catch (err) {
    next(err);
  }
};
const getRoomById = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({ _id: req.payload.userId });
    if (!foundUser) {
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    }
    const roomId = req.params.RoomID;
    const Room = await Rooms.findOne({
      _id: roomId,
    });
    res.status(200).json(Room);
  } catch (err) {
    next(err);
  }
};
const getAllRooms = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({ _id: req.payload.userId });
    if (!foundUser) {
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    }
    const rooms = await Rooms.find({});
    res.status(200).json({ rooms });
  } catch (error) {
    next(error);
  }
};
const deleteRoom = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({ _id: req.payload.userId });
    if (!foundUser) {
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    }
    const roomId = req.params.RoomID;
    const Room = await Rooms.deleteOne({
      _id: roomId,
      roomMaster: foundUser._id,
    });
    if (Room) {
      return res.status(200).json({ message: "Room đã được xóa", Room });
    }
    res.status(403).json({ message: "Chỉ chủ phòng mới được phép xóa" });
  } catch (err) {
    next(err);
  }
};
const exitRoom = async (req, res, next) => {
  try {
    const id = req.body.id;
    const foundUser = await User.findOne({ _id: req.payload.userId });
    if (!foundUser) {
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    }
    await Rooms.findOneAndUpdate(
      {
        _id: id,
        users: { $in: [foundUser._id] },
      },
      {
        $pull: {
          users: { $in: [foundUser._id] },
        },
      }
    );
    const room = await Rooms.findOne({ _id: id });
    res.status(200).json({ message: "Thoát khỏi Room thành công", room });
  } catch (err) {
    next(err);
  }
};
const updateRoom = async (req, res, next) => {
  try {
    const id = req.params.RoomID;
    const name = req.body.name;
    const avatar = req.body.avatar;
    const foundUser = await User.findOne({ _id: req.payload.userId });
    if (!foundUser) {
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    }
    await Rooms.findOneAndUpdate(
      {
        _id: id,
        users: { $in: [foundUser._id] },
      },
      {
        name: name,
        avatar: avatar,
      }
    );
    const room = await Rooms.findOne({ _id: id });
    res.status(200).json({ message: "Room đã được cập nhật ", room });
  } catch (err) {
    next(err);
  }
};
const addMember = async (req, res, next) => {
  try {
    const id = req.body.id;
    const list_user_id = req.body.list_user_id;

    let list_user = [];
    for (let i = 0; i < list_user_id.length; i++) {
      list_user.push(mongoose.Types.ObjectId(list_user_id[i]));
    }
    const foundUser = await User.findOne({ _id: req.payload.userId });
    if (!foundUser) {
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    }
    const findRoom = await Rooms.findOne({
      _id: id,
      users: { $in: [list_user] },
    });
    if (findRoom) {
      return res
        .status(403)
        .json({ error: { message: "Người này đã có trong group rồi" } });
    }
    await Rooms.findOneAndUpdate(
      {
        _id: id,
        users: { $in: [foundUser._id] },
      },
      {
        $addToSet: {
          users: {
            $each: list_user,
          },
        },
      }
    );
    const room = await Rooms.findOne({ _id: id });
    res.status(200).json({ message: "Thêm Thành viên thành công", room });
  } catch (err) {
    next(err);
  }
};
const removeMember = async (req, res, next) => {
  try {
    const { id, userWantRemove } = req.body;
    const foundUser = await User.findOne({ _id: req.payload.userId });
    if (!foundUser) {
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    }
    await Rooms.findOneAndUpdate(
      {
        _id: id,
        roomMaster: foundUser._id,
      },
      {
        $pull: {
          users: { $in: [userWantRemove] },
        },
      }
    );
    const room = await Rooms.findOne({ _id: id });
    res.status(200).json({ message: "Thoát khỏi Room thành công", room });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  getRoomAfterLogin,
  getRoomByUserId,
  addMember,
  exitRoom,
  getRoomFriend,
  getRoomGroup,
  removeMember,
};
