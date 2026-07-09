const fs = require("fs");
const path = require("path");
const envPath = path.join(__dirname, "..", ".env");

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  });
}

async function checkGallery() {
  const uri = process.env.MONGODB_URI;
  const mongoose = require("mongoose");
  try {
    await mongoose.connect(uri);
    const docs = await mongoose.connection.db.collection("galleries").find().toArray();
    console.log("Gallery Items in DB:", JSON.stringify(docs, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

checkGallery();
