"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiColors = exports.bold = exports.path = exports.boldGreen = exports.error = void 0;
var chalk_1 = __importDefault(require("chalk"));
exports.error = chalk_1.default.bold.red;
exports.boldGreen = chalk_1.default.green.bold;
exports.path = chalk_1.default.blue.underline.bold;
exports.bold = chalk_1.default.bold;
exports.multiColors = function (word) {
    var colors = [
        chalk_1.default.greenBright,
        chalk_1.default.yellowBright,
        chalk_1.default.redBright,
        chalk_1.default.magentaBright,
        chalk_1.default.cyanBright,
    ];
    var colorful = word
        .split('')
        .reduce(function (accm, char, i) { return accm + colors[i % 5](char); }, '');
    return colorful;
};
//# sourceMappingURL=colors.js.map