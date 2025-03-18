const SERVER_URL = "https://web-rtc-c3gc.onrender.com"; // Thay bằng URL của bạn trên Render

// Khởi tạo kết nối WebSocket
let socket = io.connect(SERVER_URL, { secure: true });

// Cấu hình ICE Servers cho WebRTC
const iceServers = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    {
      urls: "turn:relay1.expressturn.com:3478",
      username: "your-username", // Nếu dùng TURN Server riêng, hãy cập nhật username
      credential: "your-password" // Cập nhật password nếu cần
    }
  ]
};

// Định nghĩa hàm kết nối WebRTC
function setupPeerConnection() {
  const peerConnection = new RTCPeerConnection(iceServers);

  // Xử lý sự kiện khi có ICE Candidate mới
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("new-ice-candidate", event.candidate);
    }
  };

  // Khi kết nối thành công
  peerConnection.onconnectionstatechange = () => {
    console.log("Peer Connection State: ", peerConnection.connectionState);
  };

  return peerConnection;
}

// Lắng nghe tin nhắn WebSocket từ server
socket.on("offer", async (offer) => {
  const peerConnection = setupPeerConnection();
  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

  // Tạo câu trả lời (answer)
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  // Gửi answer về server
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

// Cấu hình CORS nếu backend là Express.js
const cors = require("cors");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: { origin: "https://web-rtc-c3gc.onrender.com", credentials: true }
});

app.use(cors({ origin: "https://web-rtc-c3gc.onrender.com", credentials: true }));

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Khởi chạy server trên Render
const PORT = process.env.PORT || 8080;
http.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});
