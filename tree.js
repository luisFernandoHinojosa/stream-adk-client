import fs from "fs";
import path from "path";

const rootDir = path.join(process.cwd(), "src");

function printTree(dir, prefix = "") {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  files.forEach((file, index) => {
    const isLast = index === files.length - 1;
    const connector = isLast ? "└── " : "├── ";
    console.log(prefix + connector + file.name);

    if (file.isDirectory()) {
      const newPrefix = prefix + (isLast ? "    " : "│   ");
      printTree(path.join(dir, file.name), newPrefix);
    }
  });
}

console.log("📂 src");
printTree(rootDir);
