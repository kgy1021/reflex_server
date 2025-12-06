const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

// 임시 랭킹 저장소 (서버 재시작 시 초기화됨)
let ranking = [];

// 랭킹 조회 (GET)
app.get("/ranking", (req, res) => {
  res.json(ranking);
});

// 랭킹 저장 (POST)
app.post("/ranking", (req, res) => {
  const { nickname, time } = req.body;

  if (!nickname || time === undefined) {
    return res.status(400).json({ error: "Missing fields: nickname or time" });
  }

  ranking.push({ nickname, time });

  // 시간 순으로 정렬 (작을수록 상위)
  ranking.sort((a, b) => a.time - b.time);

  // 상위 10명만 유지
  ranking = ranking.slice(0, 10);

  res.json({ message: "Saved!", ranking });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
