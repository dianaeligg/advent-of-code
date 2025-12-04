import * as fs from "fs";
import * as path from "path";
import * as readline from "readline/promises";
import { spawn } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = __dirname;

async function getDirectories(dir: string): Promise<string[]> {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory() && /^\d+$|^Day\d+$/.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => {
      const numA = parseInt(a.replace("Day", ""));
      const numB = parseInt(b.replace("Day", ""));
      return numA - numB;
    });
}

async function getSolutionFiles(dir: string): Promise<string[]> {
  const entries = await fs.promises.readdir(dir);
  return entries
    .filter((entry) => /^[12]\.(js|ts)$/.test(entry))
    .sort();
}

async function getInputFiles(dir: string): Promise<string[]> {
  const inputDir = path.join(dir, "input");
  if (!fs.existsSync(inputDir)) {
    return [];
  }
  const entries = await fs.promises.readdir(inputDir);
  // Filter for common input file patterns and sort with 'test' files first
  return entries
    .filter((entry) => /^(input|test|custom)/.test(entry) || entry.endsWith(".txt"))
    .sort((a, b) => {
      // Prioritize test files first for easy selection
      if (a.startsWith("test") && !b.startsWith("test")) return -1;
      if (!a.startsWith("test") && b.startsWith("test")) return 1;
      return a.localeCompare(b);
    });
}

function formatChoice(items: string[], selected: number): string {
  return items
    .map((item, i) => (i === selected ? `  \x1b[36m❯ ${item}\x1b[0m` : `    ${item}`))
    .join("\n");
}

async function selectWithArrows(
  rl: readline.Interface,
  prompt: string,
  items: string[]
): Promise<string> {
  let selected = 0;

  return new Promise((resolve) => {
    const render = () => {
      console.clear();
      console.log(`\x1b[1m\x1b[35m🎄 Advent of Code Runner\x1b[0m\n`);
      console.log(`\x1b[33m${prompt}\x1b[0m\n`);
      console.log(formatChoice(items, selected));
      console.log("\n\x1b[2m(↑/↓ to navigate, Enter to select, q to quit)\x1b[0m");
    };

    render();

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    const onKeypress = (key: string) => {
      if (key === "\u0003" || key === "q") {
        // Ctrl+C or q
        process.stdin.setRawMode(false);
        process.stdin.removeListener("data", onKeypress);
        console.clear();
        process.exit(0);
      } else if (key === "\u001b[A") {
        // Up arrow
        selected = selected > 0 ? selected - 1 : items.length - 1;
        render();
      } else if (key === "\u001b[B") {
        // Down arrow
        selected = selected < items.length - 1 ? selected + 1 : 0;
        render();
      } else if (key === "\r" || key === "\n") {
        // Enter
        process.stdin.setRawMode(false);
        process.stdin.removeListener("data", onKeypress);
        resolve(items[selected]);
      }
    };

    process.stdin.on("data", onKeypress);
  });
}

async function runFile(filePath: string, inputFile?: string): Promise<void> {
  const dir = path.dirname(filePath);
  
  console.clear();
  console.log(`\x1b[1m\x1b[35m🎄 Running: \x1b[0m\x1b[36m${filePath}\x1b[0m`);
  if (inputFile) {
    console.log(`\x1b[1m\x1b[35m📄 Input:   \x1b[0m\x1b[33m${inputFile}\x1b[0m`);
  }
  console.log("\n\x1b[2m" + "─".repeat(50) + "\x1b[0m\n");

  return new Promise((resolve, reject) => {
    const args = ["tsx", filePath];
    if (inputFile) {
      args.push(inputFile);
    }
    
    const child = spawn("npx", args, {
      cwd: dir,
      stdio: "inherit",
      shell: true,
    });

    child.on("close", (code) => {
      console.log("\n\x1b[2m" + "─".repeat(50) + "\x1b[0m");
      if (code === 0) {
        console.log(`\n\x1b[32m✓ Finished successfully\x1b[0m`);
      } else {
        console.log(`\n\x1b[31m✗ Exited with code ${code}\x1b[0m`);
      }
      resolve();
    });

    child.on("error", reject);
  });
}

async function findDayFolder(yearPath: string, dayArg: string): Promise<string | null> {
  const days = await getDirectories(yearPath);
  // Match either "Day7" or "7" format
  const match = days.find(
    (d) => d === dayArg || d === `Day${dayArg}` || d.replace("Day", "") === dayArg
  );
  return match || null;
}

async function findSolutionFile(dayPath: string, partArg: string): Promise<string | null> {
  const files = await getSolutionFiles(dayPath);
  // Match "1.ts", "1.js", or just "1"
  const match = files.find((f) => f.startsWith(`${partArg}.`));
  return match || null;
}

async function main() {
  const args = process.argv.slice(2);
  const [yearArg, dayArg, partArg, inputArg] = args;

  // If year, day, and part args provided, run directly without interactive mode
  if (yearArg && dayArg && partArg) {
    const yearPath = path.join(ROOT_DIR, yearArg);
    
    if (!fs.existsSync(yearPath)) {
      console.log(`\x1b[31mYear folder "${yearArg}" not found!\x1b[0m`);
      process.exit(1);
    }

    const dayFolder = await findDayFolder(yearPath, dayArg);
    if (!dayFolder) {
      console.log(`\x1b[31mDay folder "${dayArg}" not found in ${yearArg}!\x1b[0m`);
      process.exit(1);
    }

    const dayPath = path.join(yearPath, dayFolder);
    const solutionFile = await findSolutionFile(dayPath, partArg);
    if (!solutionFile) {
      console.log(`\x1b[31mPart ${partArg} not found in ${yearArg}/${dayFolder}!\x1b[0m`);
      process.exit(1);
    }

    const filePath = path.join(dayPath, solutionFile);
    
    // If no input arg provided, prompt for it
    let selectedInput = inputArg;
    if (!selectedInput) {
      const inputFiles = await getInputFiles(dayPath);
      if (inputFiles.length > 0) {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });
        try {
          selectedInput = await selectWithArrows(
            rl,
            `Select input file for ${yearArg}/${dayFolder}:`,
            inputFiles
          );
        } finally {
          rl.close();
        }
      }
    }
    
    await runFile(filePath, selectedInput);
    return;
  }

  // Interactive mode
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    // Get available years
    const years = await getDirectories(ROOT_DIR);
    if (years.length === 0) {
      console.log("No year folders found!");
      process.exit(1);
    }

    const selectedYear = yearArg && years.includes(yearArg) 
      ? yearArg 
      : await selectWithArrows(rl, "Select a year:", years);
    const yearPath = path.join(ROOT_DIR, selectedYear);

    // Get available days
    const days = await getDirectories(yearPath);
    if (days.length === 0) {
      console.log(`No day folders found in ${selectedYear}!`);
      process.exit(1);
    }

    let selectedDay: string;
    if (dayArg) {
      const dayFolder = await findDayFolder(yearPath, dayArg);
      selectedDay = dayFolder || await selectWithArrows(rl, `Select a day from ${selectedYear}:`, days);
    } else {
      selectedDay = await selectWithArrows(rl, `Select a day from ${selectedYear}:`, days);
    }
    const dayPath = path.join(yearPath, selectedDay);

    // Get available solution files
    const files = await getSolutionFiles(dayPath);
    if (files.length === 0) {
      console.log(`No solution files found in ${selectedYear}/${selectedDay}!`);
      process.exit(1);
    }

    const partLabels = files.map((f) => `Part ${f.charAt(0)} (${f})`);
    const selectedPartLabel = await selectWithArrows(
      rl,
      `Select a part from ${selectedYear}/${selectedDay}:`,
      partLabels
    );
    const selectedFile = files[partLabels.indexOf(selectedPartLabel)];
    const filePath = path.join(dayPath, selectedFile);

    // Select input file
    const inputFiles = await getInputFiles(dayPath);
    let selectedInput: string | undefined;
    if (inputFiles.length > 0) {
      selectedInput = await selectWithArrows(
        rl,
        `Select input file:`,
        inputFiles
      );
    }

    // Run the selected file
    await runFile(filePath, selectedInput);
  } finally {
    rl.close();
  }
}

main().catch(console.error);
