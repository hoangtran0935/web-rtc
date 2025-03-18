const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const SERVER_URL = "wss://web-rtc-c3gc.onrender.com";

// Cấu hình CORS
app.use(cors({
  origin: SERVER_URL,
  methods: ["GET", "POST"],
  credentials: true
}));

const io = new Server(server, {
  cors: {
    origin: SERVER_URL,
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("offer", (offer) => {
    socket.broadcast.emit("offer", offer);
  });

  socket.on("answer", (answer) => {
    socket.broadcast.emit("answer", answer);
  });

  socket.on("new-ice-candidate", (candidate) => {
    socket.broadcast.emit("new-ice-candidate", candidate);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`✅ Server đang chạy trên cổng ${PORT}`);
});

// ===================== CLIENT-SIDE =====================

// WebRTC + Socket.io client
const ioClient = require("socket.io-client");
const socket = ioClient(SERVER_URL, {
  secure: true,
  transports: ["websocket"]
});

// Cấu hình ICE Servers
const iceServers = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    {
      urls: "turn:relay1.expressturn.com:3478",
      username: "your-username", // Thay bằng username của TURN server nếu có
      credential: "your-password" // Thay bằng password
    }
  ]
};

let peerConnection = null;

function setupPeerConnection() {
  if (peerConnection) return peerConnection;

  peerConnection = new RTCPeerConnection(iceServers);

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("new-ice-candidate", event.candidate);
    }
  };

  peerConnection.onconnectionstatechange = () => {
    console.log("Peer Connection State:", peerConnection.connectionState);
  };

  peerConnection.ontrack = (event) => {
    console.log("Nhận stream video:", event.streams[0]);
  };

  return peerConnection;
}

// Xử lý WebRTC nhận offer
socket.on("offer", async (offer) => {
  const peerConnection = setupPeerConnection();
  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  socket.emit("answer", answer);
});

// Xử lý khi nhận ICE Candidate mới từ server
socket.on("new-ice-candidate", async (candidate) => {
  try {
    const peerConnection = setupPeerConnection();
    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  } catch (error) {
    console.error("Lỗi khi thêm ICE Candidate:", error);
  }
});
