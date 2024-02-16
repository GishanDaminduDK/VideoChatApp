// const express = require("express")
// const http = require("http")
// const app = express()
// const server = http.createServer(app)
// const io = require("socket.io")(server, {
// 	cors: {
// 		origin: "http://localhost:3000",
// 		methods: [ "GET", "POST" ]
// 	}
// })

// io.on("connection", (socket) => {
// 	socket.emit("me", socket.id)

// 	socket.on("disconnect", () => {
// 		socket.broadcast.emit("callEnded")
// 	})

// 	socket.on("callUser", (data) => {
// 		io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
// 	})

// 	socket.on("answerCall", (data) => {
// 		io.to(data.to).emit("callAccepted", data.signal)
// 	})
// })

// server.listen(5000, () => console.log("server is running on port 5000"))
// const express = require("express")
// const http = require("http")
// const app = express()
// const server = http.createServer(app)
// const io = require("socket.io")(server, {
// 	cors: {
// 		origin: "http://localhost:3000",
// 		methods: [ "GET", "POST" ]
// 	}
// })

// io.on("connection", (socket) => {
// 	socket.emit("me", socket.id)

// 	socket.on("disconnect", () => {
// 		socket.broadcast.emit("callEnded")
// 	})

// 	socket.on("callUser", (data) => {
// 		io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
// 	})

// 	socket.on("answerCall", (data) => {
// 		io.to(data.to).emit("callAccepted", data.signal)
// 	})
// })

// server.listen(5000, () => console.log("server is running on port 5000"))
// const express = require('express');
// const path = require('path');

// const app = express();

// // Define the directory where your React app's build files reside
// const reactAppDirectory = path.join(__dirname, '/frontend/build');

// // Serve static files from the specified directory
// app.use(express.static(reactAppDirectory));

// // Serve the index.html file for any other requests
// app.get('*', (req, res) => {
//   res.sendFile(path.join(reactAppDirectory, 'index.html'));
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Define the directory where your React app's build files reside
const reactAppDirectory = path.join(__dirname, '/frontend/build');

// Serve static files from the specified directory
app.use(express.static(reactAppDirectory));

// Serve the index.html file for any other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(reactAppDirectory, 'index.html'));
});

// io.on('connection', (socket) => {
//   socket.emit('me', socket.id);

//   socket.on('disconnect', () => {
//     socket.broadcast.emit('callEnded');
//   });

//   socket.on('callUser', (data) => {
//     io.to(data.userToCall).emit('callUser', {
//       signal: data.signalData,
//       from: data.from,
//       name: data.name
//     });
//   });

//   socket.on('answerCall', (data) => {
//     io.to(data.to).emit('callAccepted', data.signal);
//   });
// });

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("callUser", {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });

  socket.on("sendIceCandidate", (data) => {
    io.to(data.to).emit("receiveIceCandidate", {
      candidate: data.candidate,
    });
  });
});

server.listen(5000, () => console.log("server is running on port 5000"));

// const express = require('express');
// const http = require('http');
// const path = require('path');
// const socketIO = require('socket.io'); 

// const app = express();
// const server = http.createServer(app);
// const io = socketIO(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"]
//   }
// });

// // Define the directory where your React app's build files reside
// const reactAppDirectory = path.join(__dirname, '/frontend/build');

// // Serve static files from the specified directory
// app.use(express.static(reactAppDirectory));

// // Serve the index.html file for any other requests
// app.get('*', (req, res) => {
//   res.sendFile(path.join(reactAppDirectory, 'index.html'));
// });

// io.on('connection', (socket) => {
//   socket.emit('me', socket.id);

//   socket.on('disconnect', () => {
//     socket.broadcast.emit('callEnded');
//   });

//   socket.on('callUser', (data) => {
//     io.to(data.userToCall).emit('callUser', {
//       signal: data.signalData,
//       from: data.from,
//       name: data.name
//     });
//   });

//   socket.on('answerCall', (data) => {
//     io.to(data.to).emit('callAccepted', data.signal);
//   });
// });

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(Server is running on port ${PORT});
// });
// Import necessary modules
// const express = require('express');
// const http = require('http');
// const path = require('path');
// const socketIO = require('socket.io');

// // Create an Express application
// const app = express();

// // Create an HTTP server using Express app
// const server = http.createServer(app);

// // Initialize Socket.IO with the created server and configure CORS
// const io = socketIO(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"]
//   }
// });

// // Define the directory where your React app's build files reside
// const reactAppDirectory = path.join(__dirname, '/frontend/build');

// // Serve static files from the specified directory
// app.use(express.static(reactAppDirectory));

// // Serve the index.html file for any other requests
// app.get('*', (req, res) => {
//   res.sendFile(path.join(reactAppDirectory, 'index.html'));
// });

// // Socket.IO event listeners
// io.on('connection', (socket) => {
//   // Emit a 'me' event to the client with its socket ID
//   socket.emit('me', socket.id);

//   // Handle disconnection event
//   socket.on('disconnect', () => {
//     socket.broadcast.emit('callEnded'); // Broadcast callEnded event to all connected clients
//   });

//   // Handle callUser event
//   socket.on('callUser', (data) => {
//     // Emit callUser event to the specified user
//     io.to(data.userToCall).emit('callUser', {
//       signal: data.signalData,
//       from: data.from,
//       name: data.name
//     });
//   });

//   // Handle answerCall event
//   socket.on('answerCall', (data) => {
//     // Emit callAccepted event to the specified user
//     io.to(data.to).emit('callAccepted', data.signal);
//   });
// });

// // Define the port to listen on
// const PORT = process.env.PORT || 5000;

// // Start the server and listen on the defined port
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
