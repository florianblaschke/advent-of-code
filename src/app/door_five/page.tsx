import { promises as fs } from "fs";
import path from "path";

export default async function DoorOne() {
  const { validCount } = await readTxt();

  return <div className="p-8">Part 1: {validCount}</div>;
}

async function readTxt() {
  const currentPath = process.cwd();
  const pathToFile = path.join(currentPath, "/src/app/door_five/day_five.txt");

  const txt = await fs.readFile(pathToFile, "utf8");

  const lines = txt.split(/\r|\n|\r\n/g);

  const rulebook = lines
    .filter((entry) => entry.includes("|"))
    .map((entry) => entry.split("|"))
    .map((entry) => entry.map((string) => Number(string)));
  const updates = lines
    .filter((entry) => entry.includes(","))
    .map((entry) => entry.split(","))
    .map((entry) => entry.map((string) => Number(string)));

  function getRulesForUpdate(update: number[]) {
    return rulebook.filter(
      (entry) => update.includes(entry[0]) && update.includes(entry[1]),
    );
  }

  function correctUpdate(update: number[]) {
    const rules = getRulesForUpdate(update);

    for (let i = 0; i < update.length; i++) {
      const num = update[i];
      const rulesForIndex = rules.filter((rule) => rule.includes(num));

      rulesForIndex.forEach((rule) => {
        if (rule[0] === num) {
          const index = update.findIndex((upd) => upd === rule[1]);

          if (index < i) {
            swapElements(update, index, i);
          }
        }

        if (rule[1] === num) {
          const index = update.findIndex((upd) => upd === rule[0]);

          if (index > i) {
            swapElements(update, index, i);
          }
        }
      });
    }
    return update;
  }

  function checkUpdate(update: number[]) {
    const rules = getRulesForUpdate(update);
    let validUpdate = true;

    for (let i = 0; i < update.length; i++) {
      if (!validUpdate) {
        break;
      }

      const num = update[i];
      const rulesForIndex = rules.filter((rule) => rule.includes(num));

      rulesForIndex.forEach((rule) => {
        if (rule[0] === num) {
          const index = update.findIndex((upd) => upd === rule[1]);

          if (index < i) {
            validUpdate = false;
          }
        }

        if (rule[1] === num) {
          const index = update.findIndex((upd) => upd === rule[0]);

          if (index > i) {
            validUpdate = false;
          }
        }
      });
    }
    return validUpdate;
  }

  let validCount = 0;
  const invalidUpdates: number[][] = [];

  updates.forEach((update) => {
    const result = checkUpdate(update);
    if (result) {
      const middleIndex = Math.floor(update.length / 2);
      validCount += update[middleIndex];
    } else {
      invalidUpdates.push(update);
    }
  });
  let correctedCount = 0;

  invalidUpdates.forEach((update) => {
    const result = correctUpdate(update);
    const middleIndex = Math.floor(result.length / 2);
    correctedCount += update[middleIndex];
  });

  console.log("COUNT", validCount, "CORRECTED COUNT", correctedCount);

  return { validCount, correctedCount };
}

function swapElements(arr: number[], idx1: number, idx2: number) {
  [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
}
