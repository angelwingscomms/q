const fs = require("fs");
const path = require("path");
const {
  patchDocument,
  PatchType,
  TextRun,
  Paragraph,
  Document,
  Packer,
} = require("docx");

// Logging utilities
function logBuffer(buffer, label) {
  console.log(`${label} Buffer Info:`);
  console.log(`  - Type: ${buffer.constructor.name}`);
  console.log(`  - Length: ${buffer.length} bytes`);
  console.log(`  - First 20 bytes: ${buffer.slice(0, 20).toString("hex")}`);
  console.log(`  - Last 20 bytes: ${buffer.slice(-20).toString("hex")}`);
}

// Verify file existence and size
function checkFile(filePath, label) {
  console.log(`\n=== Checking ${label} ===`);
  if (!fs.existsSync(filePath)) {
    console.error(`ERROR: ${label} does not exist at path: ${filePath}`);
    return false;
  }

  const stats = fs.statSync(filePath);
  console.log(`${label} exists - Size: ${stats.size} bytes`);

  if (stats.size < 1000) {
    console.warn(`WARNING: ${label} seems too small (${stats.size} bytes)`);
  }

  return true;
}

// Try different ways to write the file
async function writeFileMultipleWays(buffer, basePath) {
  const methods = [
    {
      name: "fs.writeFileSync (default)",
      fn: (path, data) => fs.writeFileSync(path, data),
    },
    {
      name: "fs.writeFileSync with 'binary' encoding",
      fn: (path, data) => fs.writeFileSync(path, data, { encoding: "binary" }),
    },
    {
      name: "fs.writeFileSync with null encoding",
      fn: (path, data) => fs.writeFileSync(path, data, { encoding: null }),
    },
    {
      name: "Buffer.from conversion",
      fn: (path, data) => {
        // Ensure we have a proper buffer
        const newBuffer = Buffer.from(data);
        fs.writeFileSync(path, newBuffer);
      },
    },
  ];

  for (const method of methods) {
    const outputPath = `${basePath}-${method.name.replace(/\s+/g, "-").toLowerCase()}.docx`;
    console.log(`\n=== Writing with ${method.name} to ${outputPath} ===`);

    try {
      method.fn(outputPath, buffer);
      checkFile(outputPath, `Output file (${method.name})`);
    } catch (error) {
      console.error(`ERROR with ${method.name}:`, error.message);
    }
  }
}

// Test using direct Document creation (not patching)
async function testDirectDocumentCreation() {
  console.log("\n=== Testing direct Document creation ===");

  try {
    // Create a simple document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun("This is a test document created directly"),
              ],
            }),
            new Paragraph({
              children: [new TextRun("without using the template patching.")],
            }),
          ],
        },
      ],
    });

    // Create output directory if it doesn't exist
    const outputDir = path.join(__dirname, "debug-output");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Get the document buffer
    const buffer = await Packer.toBuffer(doc);
    logBuffer(buffer, "Direct Creation");

    // Write it out
    const outputPath = path.join(outputDir, "direct-creation.docx");
    fs.writeFileSync(outputPath, buffer);

    checkFile(outputPath, "Direct Creation Output");
  } catch (error) {
    console.error("ERROR in direct document creation:", error);
  }
}

// Test document patching
async function testDocumentPatching() {
  console.log("\n=== Testing Document Patching ===");

  // Template paths to try
  const templatePaths = [
    "./files/template.docx",
    "./files/template-n.docx",
    "./files/template-cc.docx",
  ];

  // Create output directory if it doesn't exist
  const outputDir = path.join(__dirname, "debug-output");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const templatePath of templatePaths) {
    console.log(`\n=== Testing with template: ${templatePath} ===`);

    if (!checkFile(templatePath, "Template")) {
      continue; // Skip if template doesn't exist
    }

    try {
      // Read the template file in different ways and check
      console.log("\n=== Testing template reading methods ===");

      // Method 1: Read as buffer (regular fs)
      const templateBuffer = fs.readFileSync(templatePath);
      logBuffer(templateBuffer, "Template (fs.readFileSync)");

      // Method 2: Read as UTF-8 (this would be wrong for binary)
      try {
        const templateText = fs.readFileSync(templatePath, "utf8");
        console.log(
          `Template as UTF8: Length ${templateText.length} chars (THIS WOULD BE WRONG FOR BINARY)`,
        );
      } catch (e) {
        console.log(
          "Could not read template as UTF8 (this is expected for binary files)",
        );
      }

      // Method 3: Using FileManager.readBinaryFile mock
      try {
        // Mock FileManager.readBinaryFile
        const readBinaryFile = (filePath) => fs.readFileSync(filePath);
        const templateBinaryBuffer = readBinaryFile(templatePath);
        logBuffer(
          templateBinaryBuffer,
          "Template (FileManager.readBinaryFile)",
        );

        // Compare with regular fs.readFileSync
        console.log(
          `Binary read matches regular fs.readFileSync: ${templateBinaryBuffer.equals(templateBuffer)}`,
        );
      } catch (e) {
        console.error("Error reading with mock FileManager.readBinaryFile:", e);
      }

      // Try patching the document
      console.log("\n=== Patching document ===");

      // Mock FileManager.readBinaryFile
      const readBinaryFile = (filePath) => fs.readFileSync(filePath);
      const templateBinaryBuffer = readBinaryFile(templatePath);

      const doc = await patchDocument({
        data: templateBinaryBuffer, // Use the binary buffer (simulating FileManager.readBinaryFile)
        outputType: "nodebuffer",
        keepOriginalStyles: true,
        patches: {
          s: {
            type: PatchType.PARAGRAPH,
            children: [new TextRun("Debug Test Subject")],
          },
          g: {
            type: PatchType.PARAGRAPH,
            children: [new TextRun("Debug Grade")],
          },
          q: {
            type: PatchType.DOCUMENT,
            children: [
              new Paragraph({
                children: [new TextRun("Question 1: This is a test question")],
                spacing: { after: 9 },
              }),
              new Paragraph({
                children: [new TextRun("Question 2: Another test question")],
                spacing: { after: 9 },
              }),
            ],
          },
        },
      });

      logBuffer(doc, "Patched Document");

      // Write the document using different methods
      const baseOutputPath = path.join(
        outputDir,
        `patched-${path.basename(templatePath, ".docx")}`,
      );
      await writeFileMultipleWays(doc, baseOutputPath);
    } catch (error) {
      console.error(`ERROR patching with template ${templatePath}:`, error);
    }
  }
}

// Main function to run all tests
async function runTests() {
  console.log("=== DOCX Generation Debugging ===");
  console.log("Node.js version:", process.version);
  console.log("Platform:", process.platform);
  console.log("\n=== TESTING WITH FileManager.readBinaryFile FIX ===");

  try {
    // Check the docx package version
    const packageJson = require("./package.json");
    console.log("docx package version:", packageJson.dependencies.docx);
  } catch (e) {
    console.log("Could not determine docx package version");
  }

  // Run the direct document creation test
  await testDirectDocumentCreation();

  // Run the document patching test
  await testDocumentPatching();

  console.log("\n=== Debugging Complete ===");
  console.log(
    "CONCLUSION: Files should be read with FileManager.readBinaryFile and written with FileManager.writeBinaryFile",
  );
}

// Run the tests
runTests().catch((error) => {
  console.error("FATAL ERROR:", error);
});
