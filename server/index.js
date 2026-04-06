require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const hackathonsRouter = require("./routes/hackathons");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// Hackathons endpoint (Apify integration)
app.use("/api/hackathons", hackathonsRouter);

app.get("/", (req, res) =>
  res.json({ status: "ok", service: "hackmate-server (Apify only)" }),
);

app.listen(PORT, () =>
  console.log(`Server listening on http://localhost:${PORT}`),
);
