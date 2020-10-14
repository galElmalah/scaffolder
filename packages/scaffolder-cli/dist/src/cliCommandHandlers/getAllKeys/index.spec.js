const { getAllKeys } = require('.');
const data = require('./testData.json');
describe('getAllKeys', () => {
    it('should get all of the key without duplicates', () => {
        const set = new Set();
        expect(getAllKeys(data, set)).toEqual(['{{testKey}}',
            '{{compName}}',
            '{{componentName}}',
            '{{test}}', '{{keyF}}', '{{nested}}']);
    });
});
//# sourceMappingURL=index.spec.js.map