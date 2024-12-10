import { promises as fs } from "fs";
import path from "path";

export default async function DoorOne() {
  await readTxt();

  return <div className="p-8"></div>;
}

async function readTxt() {
  const currentPath = process.cwd();

  const pathToFile = path.join(currentPath, "src/app/door_three/day_three.txt");
  const txt = await fs.readFile(pathToFile, "utf8");

  const regex = new RegExp(/mul(\((\d+),(\d+)\))/g);

  const cleanData = txt.replace(/\r|\n|\r\n/gm, " ").trim();

  const results = [...cleanData.matchAll(regex)];

  const allValues = results
    .map((res) => {
      const [, , numOne, numTwo] = res;

      return Number(numOne) * Number(numTwo);
    })
    .reduce((acc, curr) => acc + curr, 0);

  const regexTwo = new RegExp(/(?:(?:^|do\(\))[^d]*)mul\((\d+),(\d+)\)/g);
  const resultsPartTwo = [...cleanData.matchAll(regexTwo)];

  const doString = resultsPartTwo
    .map((res) => {
      const [match] = res;
      return match;
    })
    .join();

  const resultsDoString = [...doString.matchAll(regex)];

  const allDoValues = resultsDoString
    .map((res) => {
      const [, , numOne, numTwo] = res;

      return Number(numOne) * Number(numTwo);
    })
    .reduce((acc, curr) => acc + curr, 0);

  console.log("ALL", allValues, "DO", allDoValues, allValues > allDoValues);
}
