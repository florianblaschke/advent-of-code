import { promises as fs } from "fs";
import path from "path";

export default async function DoorOne() {
  const result = await readTxt();

  return <div className="p-8">Failed first Answer: {result}</div>;
}

async function readTxt() {
  const currentPath = process.cwd();
  const pathToFile = path.join(currentPath, "/src/app/door_four/day_four.txt");

  const txt = await fs.readFile(pathToFile, "utf8");

  const lines = txt.split(/\r|\n|\r\n/g);
  lines.pop();

  const DIRECTIONS = [
    [-1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
  ];

  const xmas = ["X", "M", "A", "S"];
  let xmasCount = 0;
  const rows = lines.length;
  const cols = lines[0].length;

  function dfs(
    row: number,
    col: number,
    dir: number[],
    index: number,
  ): boolean {
    if (index === 4) return true;

    const newRow = row + dir[0];
    const newCol = col + dir[1];

    if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols)
      return false;

    if (lines[newRow][newCol] === xmas[index]) {
      return dfs(newRow, newCol, dir, index + 1);
    }

    return false;
  }

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (lines[i][j] === "X") {
        for (const dir of DIRECTIONS) {
          if (dfs(i, j, dir, 1)) {
            xmasCount++;
          }
        }
      }
    }
  }

  function checkMAS(i: number, j: number) {
    if (
      i - 1 < 0 ||
      i + 1 >= lines.length ||
      j - 1 < 0 ||
      j + 1 >= lines[0].length
    ) {
      return false;
    }

    const topRight = lines[i - 1][j + 1];
    const topLeft = lines[i - 1][j - 1];
    const bottomRight = lines[i + 1][j + 1];
    const bottomLeft = lines[i + 1][j - 1];

    let firstDiagonal = false;
    let secondDiagonal = false;

    if (
      (topRight === "M" && bottomLeft === "S") ||
      (topRight === "S" && bottomLeft === "M")
    ) {
      firstDiagonal = true;
    }
    if (
      (topLeft === "M" && bottomRight === "S") ||
      (topLeft === "S" && bottomRight === "M")
    ) {
      secondDiagonal = true;
    }

    return firstDiagonal && secondDiagonal;
  }

  let masCount = 0;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (lines[i][j] === "A") {
        const result = checkMAS(i, j);
        if (result) {
          masCount++;
        }
      }
    }
  }

  console.log("XMASCOUNT", xmasCount, "MASCOUNT", masCount);

  return xmasCount;
}
