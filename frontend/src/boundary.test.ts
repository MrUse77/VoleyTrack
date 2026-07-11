import { describe, expect, it } from "vitest";
import { findBoundaryViolations } from "./boundary";

describe("application boundary", () => {
  it("keeps application source local-only", () => {
    expect(findBoundaryViolations()).toEqual([]);
  });
});
