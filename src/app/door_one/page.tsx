import { promises as fs } from "fs";
import path from "path";

export default async function DoorOne() {
  const { column_one, column_two, distances, totalDistance, similarityScore } =
    await readTxt();

  return (
    <div className="p-8">
      <h1 className="text-xl pb-4">Door 1 – {totalDistance}</h1>
      <h2 className="text-lg pb-4">Total Distance – {totalDistance}</h2>
      <h3 className="text-lg pb-8">Similarity Score – {similarityScore}</h3>
      <section className="flex gap-8">
        <article>
          <h2>Column One</h2>
          <ul className="flex flex-col gap-2">
            {column_one.map((c) => (
              <li key={c + 1 + Math.random()}>{c}</li>
            ))}
          </ul>
        </article>
        <article>
          <h2>Column Two</h2>
          <ul className="flex flex-col gap-2">
            {column_two.map((c) => (
              <li key={c + 2 + Math.random()}>{c}</li>
            ))}
          </ul>
        </article>
        <article>
          <h2>Distance</h2>
          <ul className="flex flex-col gap-2">
            {distances.map((c) => (
              <li key={c + 3 + Math.random()}>{c}</li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}

async function readTxt() {
  const currentPath = process.cwd();

  const pathToFile = path.join(currentPath, "src/app/door_one/input.txt");
  const txt = await fs.readFile(pathToFile, "utf8");

  const coordinates = txt
    .replace(/(\r\n|\n|\r)/gm, " ")
    .split(" ")
    .filter((entry) => entry !== "");
  const column_one: number[] = [];
  const column_two: number[] = [];

  coordinates.forEach((coord, i) => {
    if (i % 2 === 0) {
      column_one.push(Number(coord));
    } else {
      column_two.push(Number(coord));
    }
  });

  column_one.sort((a, b) => a - b);
  column_two.sort((a, b) => a - b);

  const distances: number[] = [];
  const similarity: number[] = [];

  column_one.forEach((num, i) => {
    distances.push(Math.abs(num - column_two[i]));

    const duplicates = column_two.filter((entry) => entry === num);
    similarity.push(num * duplicates.length);
  });

  const totalDistance = distances.reduce((acc, curr) => acc + curr, 0);
  const similarityScore = similarity.reduce((acc, curr) => acc + curr, 0);

  return { column_one, column_two, distances, totalDistance, similarityScore };
}
