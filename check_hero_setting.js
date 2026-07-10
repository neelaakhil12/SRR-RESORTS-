const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// Manually parse env file
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value;
    }
  }
}

async function check() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI not found");
    return;
  }
  await mongoose.connect(uri);
  console.log("Connected to MongoDB.");
  
  const SiteSettingSchema = new mongoose.Schema(
    {
      key: { type: String, required: true, unique: true },
      value: mongoose.Schema.Types.Mixed,
    },
    { collection: "sitesettings" }
  );
  
  const SiteSetting = mongoose.models.SiteSetting || mongoose.model("SiteSetting", SiteSettingSchema);
  
  const heroSetting = await SiteSetting.findOne({ key: "hero" });
  if (heroSetting) {
    console.log("Database 'hero' setting value:", JSON.stringify(heroSetting.value, null, 2));
  } else {
    console.log("No database 'hero' setting found.");
  }
  
  await mongoose.disconnect();
}

check().catch(console.error);
