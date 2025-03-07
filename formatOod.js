const fs = require("fs");

function formatOOD(oodText) {
    return oodText
        .replace(/\s*:\s*/g, " : ")  // Add spaces around colons
        .replace(/\(/g, "(\n")       // Add new line after opening brackets
        .replace(/\)/g, "\n)")       // Add new line before closing brackets
        .replace(/,\s*/g, ",\n")     // Add new line for lists
        .replace(/\n\s*\n/g, "\n");  // Remove extra blank lines
}

// Read OOD File
const filePath = process.argv[2];
if (!filePath) {
    console.error("❌ No file provided!");
    process.exit(1);
}

if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
}

const content = fs.readFileSync(filePath, "utf8");

// Format and Save
const formatted = formatOOD(content);
fs.writeFileSync(filePath, formatted);
console.log(`✅ OOD File Formatted: ${filePath}`);
