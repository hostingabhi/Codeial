module.exports.chatSockets = function (socketServer) {
  let io = require('socket.io')(socketServer, {
      cors: {
          origin: "https://chat-application-c61e.onrender.com",
          methods: ["GET", "POST"],
          allowedHeaders: ['my-custom-header'],
          credentials: true
      }
  });

  // Initialize an object to store room details
  let userSocketMap = {};

  io.sockets.on('connection', (socket) => {
      console.log("New connection received!", socket.id);

      socket.on('disconnect', function () {
          // Remove user from the room when disconnected
          if (userSocketMap[socket.id]) {
              const { chat_room, user } = userSocketMap[socket.id];
              socket.to(chat_room).broadcast.emit('user_left', { user });
              delete userSocketMap[socket.id];
          }

          console.log("Socket Disconnected!");
      });

      // Handle join_room event
      socket.on('join_room', function (data) {
          console.log('Joining the requested room', data);

          // Join the chatroom if it exists else it's created
          socket.join(data.chat_room);

          // Store user details
          userSocketMap[socket.id] = {
              chat_room: data.chat_room,
              user: data.user
          };

          // Emit a confirmation to the user that they have joined
          io.in(data.chat_room).emit('user_joined', data);
      });

      // Handle send_message event
      socket.on('send_message', function (data) {
          // Emit the received message to all users in the chat room
          io.in(data.chat_room).emit('receive_message', data);
      });
  });
};
