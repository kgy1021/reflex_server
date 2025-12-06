const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const filePath = path.join(__dirname, "ranking.json");

// 파일 없으면 생성
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, "[]", "utf8");
}

// GET 랭킹 조회
app.get("/ranking", (req, res) => {
  const data = fs.readFileSync(filePath, "utf8");
  res.send(JSON.parse(data));
});

// POST 랭킹 저장
app.post("/ranking", (req, res) => {
  const { nickname, time } = req.body;

  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  data.push({ nickname, time });

  data.sort((a, b) => a.time - b.time);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");

  res.send({ message: "Saved!", ranking: data });
});

// Render에서 PORT 환경변수 사용
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
