const { keyPatternString } = require("./index");
const wrap = (str) => `{{${str}}}`;
describe("key pattern regex", () => {
    it("should match words inside a key format", () => {
        const keyPatternrRegex = new RegExp(keyPatternString);
        const [first, keyWithLowerDash, keyWithHyphen, keyWithSpaces, keyWithTransformers,] = [
            "firstKey",
            "SECOND_KEY",
            "Another-key",
            "key with spaces",
            "key | with | spaces",
        ].map(wrap);
        expect(keyPatternrRegex.test(first)).toBe(true);
        expect(keyPatternrRegex.test(keyWithLowerDash)).toBe(true);
        expect(keyPatternrRegex.test(keyWithHyphen)).toBe(true);
        expect(keyPatternrRegex.test(keyWithSpaces)).toBe(true);
        expect(keyPatternrRegex.test(keyWithTransformers)).toBe(true);
    });
});
//# sourceMappingURL=keyPattern.spec.js.map