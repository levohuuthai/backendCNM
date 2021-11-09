const User = require("./models/User");
const Room = require("./models/Rooms")
const { ObjectId } = require('mongodb');
module.exports = (io) => {
  io
  .on("connection",  (socket) => {
    
    if (io.req) {
      console.log("Chưa đăng nhập nè")
      if(io.req.payload){
        console.log(io.req.payload.userId + "VInh Vinh VInh Vinh VInh Vinh ")
        const userIdLogin = io.req.payload.userId
        addSocketIdInDB(socket.id, userIdLogin);
    
        let rooms =  getAllRoomById(userIdLogin)
        
        rooms.then(function(result) {
          //console.log(result) // "Rooms here"
          for(let i=0;i<result.length;i++){
            const idRoom = result[i]._id.toString();
            socket.join(idRoom)
          }
          //console.log(socket.adapter.rooms)
        })
        socket.on("disconnect", () => {
          console.log("disconnect !!!!" + userIdLogin);
          
          removeSocketIdInDB(userIdLogin);
          
        });
      }
      
      
      
    }
  });
};

async function addSocketIdInDB(socket_id, user_id) {
  const user = await User.findById(user_id);
  if (socket_id) {
    user.socketId = socket_id;
    
  }
  await user.save();
}
async function removeSocketIdInDB(user_id){
  const user = await User.findById(user_id)
  user.socketId = "";
  await user.save()
}

async function getAllRoomById(user_id){
    
    const _id = ObjectId(user_id);
    const rooms = await Room.find({
      users: { $in: [_id] },
    });
    return rooms;  
}