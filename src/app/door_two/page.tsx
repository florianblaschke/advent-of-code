import { promises as fs } from "fs";
import path from "path";
import { checkRow, dampener } from "./checkRow";

export default async function DoorOne() {
  const { overview, safeCount } = await readTxt();

  return (
    <div className="p-8">
      <h1 className="text-xl pb-4">Door 2</h1>
      <h2 className="text-xl pb-4">Total: {safeCount}</h2>
      <section className="flex gap-8">
        <article>
          <h2>Rows – {safeCount}</h2>
          <ul className="flex flex-col gap-2">
            {overview.map((row) => (
              <article
                key={row.rowId + "rowId"}
                className="flex items-center gap-8"
              >
                <h2>Row {row.rowId}</h2>
                <ul className="flex items-center gap-2">
                  {row.row.map((digit, i) => (
                    <li key={i + "digitId"}>{digit}</li>
                  ))}
                </ul>
                <span>{row.safe ? "true" : "false"}</span>
                <p>
                  {row.unsafeIndexes.map((entry) => (
                    <span key={entry}>{entry},</span>
                  ))}
                </p>
              </article>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}

// Rules:
// 1. Need to decrease or increase consistently
// 2. Differ no more than 3
// How many reports are safe?

async function readTxt() {
  const currentPath = process.cwd();
  const pathToFile = path.join(currentPath, "src/app/door_two/day_two.txt");
  const text = await fs.readFile(pathToFile, "utf8");

  const regex = new RegExp(/(\r\n|\r|\n)/gm);
  const rows = text
    .split(/(\r\n|\r|\n)/gm)
    .filter((row) => !row.match(regex))
    .map((row) => row.split(" "))
    .slice(0, -1);

  let safeCount = 0;

  type Overview = {
    rowId: number;
    row: string[];
    safe: boolean;
    unsafeIndexes: number[];
  };

  const overview: Overview[] = [];

  rows.forEach((row, index) => {
    const { unsafeIndexes, safe } = checkRow(row);

    if (safe) {
      safeCount++;
    }
    const result: Overview = { rowId: index, row, safe, unsafeIndexes };

    overview.push(result);
  });

  const unsafeRows = overview
    .filter((entry) => !entry.safe)
    .map((entry) => entry.row);
  let dampenedCount = 0;

  unsafeRows.forEach((row) => {
    const safe = dampener(row);

    if (safe) {
      dampenedCount++;
    }
  });

  console.log(
    "SAFE",
    safeCount,
    "DAMPENED",
    dampenedCount,
    "TOTAL",
    safeCount + dampenedCount,
  );
  return { rows, safeCount, overview };
}
