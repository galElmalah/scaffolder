var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const defaultSuccessMessage = 'Successfully executed';
const defaultErrorMessage = 'Error in asyncExecutor';
const asyncExecutor = (fn, successMsg = defaultSuccessMessage, errMsg = defaultErrorMessage, ...args) => __awaiter(this, void 0, void 0, function* () {
    if (fn) {
        try {
            const successMessage = typeof successMsg === 'function' ? successMsg() : successMsg;
            const fnResult = fn(...args);
            const resolvedValue = fnResult instanceof Promise ? yield fnResult : fnResult;
            console.log(successMessage);
            return resolvedValue;
        }
        catch (e) {
            const errorMessage = typeof errMsg === 'function' ? errMsg(e) : errMsg;
            console.log(errorMessage);
        }
    }
});
module.exports = {
    asyncExecutor
};
//# sourceMappingURL=index.js.map