import { describe, expect, it } from "vitest";
import { sortBySeverity } from "./severity";
import { SeverityLevel } from "./types";

describe("sortBySeverity", () => {
  it("orders contraindicated > major > moderate > minor", () => {
    const items: { severity: SeverityLevel }[] = [
      { severity: "minor" },
      { severity: "contraindicated" },
      { severity: "moderate" },
      { severity: "major" },
    ];

    const sorted = sortBySeverity(items).map((i) => i.severity);

    expect(sorted).toEqual(["contraindicated", "major", "moderate", "minor"]);
  });

  it("does not mutate the input array", () => {
    const items: { severity: SeverityLevel }[] = [
      { severity: "minor" },
      { severity: "major" },
    ];
    const original = [...items];

    sortBySeverity(items);

    expect(items).toEqual(original);
  });

  it("returns an empty array for empty input", () => {
    expect(sortBySeverity([])).toEqual([]);
  });
});
