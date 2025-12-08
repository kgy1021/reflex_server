const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ----------------------------------
// Supabase 클라이언트 생성  ← 추가 위치
// ----------------------------------
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);
// ----------------------------------

// GET: 랭킹 조회 (상위 5명)
app.get("/ranking", async (req, res) => {
  const { data, error } = await supabase
    .from("ranking")
    .select("*")
    .order("time", { ascending: true })
    .limit(5);

  if (error) {
    console.error(error);
    return res.status(400).json({ error });
  }

  res.json(data);
});

// POST: 랭킹 저장
app.post("/ranking", async (req, res) => {
  const { nickname, time } = req.body;

  const { data, error } = await supabase
    .from("ranking")
    .insert([{ nickname, time }]);

  if (error) {
    console.error(error);
    return res.status(400).json({ error });
  }

  res.json({ message: "Saved!", data });
});

// Render 포트 적용
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
