type Mode = "decreasing" | "increasing" | null | undefined;

export function checkRow(row: string[]) {
  let mode: Mode = null;
  const unsafeIndexes: number[] = [];
  row.forEach((num, i) => {
    const curr = Number(num);
    const next = Number(row[i + 1]);

    const { unsafe, mode: setMode } = checkTouple(curr, next, mode);
    mode = setMode;

    if (unsafe) {
      unsafeIndexes.push(i);
    }
  });

  return { safe: unsafeIndexes.length === 0, unsafeIndexes };
}

export function dampener(row: string[]): boolean {
  for (let i = 0; i < row.length; i++) {
    const dampenedRow = [...row];
    dampenedRow.splice(i, 1);

    const { safe } = checkRow(dampenedRow);
    if (safe) {
      return true;
    }
  }

  return false;
}

function checkTouple(
  curr: number,
  next: number,
  mode: Mode,
): { unsafe: boolean; mode?: Mode } {
  if (mode && mode === "decreasing" && curr < next) {
    return { unsafe: true };
  }

  if (mode && mode === "increasing" && curr > next) {
    return { unsafe: true };
  }

  if (!mode) {
    mode = curr > next ? "decreasing" : "increasing";
  }

  const distance = Math.abs(curr - next);
  if (distance > 3 || distance === 0) {
    return { unsafe: true };
  }

  return { unsafe: false, mode };
}
