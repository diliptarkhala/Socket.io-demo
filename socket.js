module.exports = (server) => {
  //We will store all the users in this socket
  let onlineUsers = {};
  var io = require("socket.io")(server);
  io.of("/chat").on("connection", (socket) => {
    //In comming events
    socket.on("online", (user) => {
      onUserConnects(user);
    });
    socket.on("disconnect", (reason) => {
      onUserDisconnects();
    });
    socket.on("send_personal_message", function (data) {
      io.of("/chat").to(onlineUsers[data.sender]).to(onlineUsers[data.receiver]).emit("new_message", data);
    });
    socket.on("broadcast_message", function (data) {
      io.of("/chat").emit("new_message", data);
    });
    socket.on("send_message_to_selected", function (data) {
      //data.receiver.push(sender)
      sendMessageToSelectedUsers(data.receiver, data);
    });

    var sendMessageToSelectedUsers = (users, data) => {
      users.concat(data.sender).map((user) => {
        console.log(user);
        io.of("/chat").to(onlineUsers[user]).emit("new_message", data);
      });
    };
    //In comming events //

    /**
     * When user disconnects  that user will be deleted from our onlineUsers
     */
    var onUserDisconnects = () => {
      Object.keys(onlineUsers).map((key) => {
        if (onlineUsers[key] === socket.id) {
          delete onlineUsers[key];
        }
        onlineUsersChanged();
      });
    };

    /**
     * @param {object} user
     * When user connects socket we will store that user in our onlineUsers
     * this should be called when user connects websocket
     */
    var onUserConnects = (user) => {
      console.log(`User conected with username '${user.username}'`);
      onlineUsers[user.username] = socket.id;
      socket.join(socket.id);
      socket.emit("connection_success", user);
      onlineUsersChanged();
    };

    /**
     * When any user connects or disconnects this function will emit  an event to all users of chat that users has changed
     */
    var onlineUsersChanged = () => {
      io.of("/chat").emit("online_users_changed", Object.keys(onlineUsers));
    };
    /**
     * Send message to selected users
     * @param {Array} users list of users you want to send message
     * @param {Array} message message data
     */
  });
};
