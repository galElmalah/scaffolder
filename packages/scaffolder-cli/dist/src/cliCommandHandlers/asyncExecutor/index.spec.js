var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { asyncExecutor } = require('./index.js');
describe('asyncExecutor', () => {
    it('should call the function passes to it an await if the returned value is a promise', () => __awaiter(this, void 0, void 0, function* () {
        let value;
        const fn = jest.fn().mockResolvedValue(7);
        yield asyncExecutor(fn).then(v => {
            value = v;
        });
        expect(value).toBe(7);
        expect(fn).toHaveBeenCalled();
    }));
    it('should return the function value even if its not a promise', () => __awaiter(this, void 0, void 0, function* () {
        let value;
        const fn = jest.fn().mockReturnValue(7);
        yield asyncExecutor(fn).then(v => {
            value = v;
        });
        expect(value).toBe(7);
        expect(fn).toHaveBeenCalled();
    }));
    it('should catch a promise rejection', () => __awaiter(this, void 0, void 0, function* () {
        const fn = jest.fn(() => Promise.reject('error'));
        yield asyncExecutor(fn);
        expect(fn).toHaveBeenCalled();
    }));
    it('should catch errors from the executed function', () => __awaiter(this, void 0, void 0, function* () {
        const fn = jest.fn(() => { throw new Error(); });
        yield asyncExecutor(fn);
        expect(fn).toHaveBeenCalled();
    }));
    it('should pass all arguments to the passed function', () => __awaiter(this, void 0, void 0, function* () {
        const fn = jest.fn();
        const args = [1, 2, 3];
        yield asyncExecutor(fn, '', '', ...args);
        expect(fn).toHaveBeenCalledWith(...args);
    }));
    it('should call the successMsg if its of type function', () => __awaiter(this, void 0, void 0, function* () {
        const successMsg = jest.fn();
        yield asyncExecutor(() => { }, successMsg, '');
        expect(successMsg).toHaveBeenCalled();
    }));
    it('should call the errorMsg if its of type function and pass it the error', () => __awaiter(this, void 0, void 0, function* () {
        const errorMsg = jest.fn();
        const err = new Error('test');
        yield asyncExecutor(() => { throw err; }, '', errorMsg);
        expect(errorMsg).toHaveBeenCalledWith(err);
    }));
});
//# sourceMappingURL=index.spec.js.map