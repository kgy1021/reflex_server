const express = require("express");
const cors = require("cors");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());

/* ---------------------- STATIC FILE SERVING ---------------------- */
// index.html, CSS, JS 등 모든 정적 파일 제공
app.use(express.static(__dirname));

// 기본 라우트 GET / → index.html 불러오기
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

/* ---------------------- SUPABASE CLIENT SETUP ---------------------- */
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

/* ---------------------- API: GET RANKING ---------------------- */
app.get("/ranking", async (req, res) => {
  const { data, error } = await supabase
    .from("ranking")
    .select("*")
    .order("time", { ascending: true })
    .limit(10);

  if (error) {
    console.error("Supabase Select Error:", error);
    return res.status(400).json({ error });
  }

  res.json(data);
});

/* ---------------------- API: POST RANKING ---------------------- */
app.post("/ranking", async (req, res) => {
  const { nickname, time } = req.body;

  const { data, error } = await supabase
    .from("ranking")
    .insert([{ nickname, time }]);

  if (error) {
    console.error("Supabase Insert Error:", error);
    return res.status(400).json({ error });
  }

  res.json({ message: "Saved!", ranking: data });
});

/* ---------------------- SERVER START (Render Port) ---------------------- */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
