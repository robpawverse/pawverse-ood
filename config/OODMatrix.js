/**
 * 🔹 Define OOD Inheritance Rules
 * - Developers can easily modify this file to adjust inheritance structures.
 */
const fs = require("fs");
const OODParser = require("./OODParser"); // ✅ Existing parser

const oodText = fs.readFileSync("OODMatrix.ood", "utf8");
const oodMatrix = OODParser.parse(oodText);

console.log("✅ Loaded OOD Matrix:", oodMatrix);

