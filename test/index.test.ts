import { describe, expect, it } from "vitest";


describe("require-top-level-describe", () => {
    it("should not allow lowercase test case name", () => {
        expect(true).toBe(true);
    });
});
