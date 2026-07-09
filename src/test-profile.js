// Load .env manually
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

async function testProfile() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set!");
    return;
  }

  const mongoose = require("mongoose");
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB.");

    const email = "neelaakhilharish@gmail.com";
    console.log("Searching for assistant email:", email);
    
    const assistant = await mongoose.connection.db.collection("assistantadmins").findOne({ email });
    console.log("Result using raw driver:", assistant);

    const schema = new mongoose.Schema({
      name: String,
      email: String,
      passwordHash: String
    });
    
    // Use model
    const Model = mongoose.models.AssistantAdmin || mongoose.model("AssistantAdmin", schema, "assistantadmins");
    const doc = await Model.findOne({ email }).lean();
    console.log("Result using Mongoose:", doc);

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
  }
}

testProfile();
