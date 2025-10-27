const express = require("express");
const ytdl = require("ytdl-core");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// frontend serve karega
app.use(express.static(path.join(__dirname, "public")));

// 🔹 Download route (for video or audio)
app.get("/download", async (req, res) => {
  const videoURL = req.query.url;
  const format = req.query.format; // "mp3" or "mp4"

  if (!videoURL) {
    return res.status(400).send("Error: No YouTube URL provided");
  }

  try {
    const info = await ytdl.getInfo(videoURL);
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, "");

    if (format === "mp3") {
      res.header("Content-Disposition", `attachment; filename="${title}.mp3"`);
      ytdl(videoURL, { filter: "audioonly", quality: "highestaudio" }).pipe(res);
    } else {
      res.header("Content-Disposition", `attachment; filename="${title}.mp4"`);
      ytdl(videoURL, { quality: "highest" }).pipe(res);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Download failed. Invalid YouTube URL?");
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
