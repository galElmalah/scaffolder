const { execSync } = require("child_process");
const { existsSync, readFileSync, readdirSync } = require("fs");
var rimraf = require("rimraf");

const execOnTestDir = (cmd) =>
  execSync(`node ../../cli.js ${cmd}`, { stdio: "inherit", cwd: __dirname });

const cleanUp = (folder) => rimraf.sync(`${__dirname}/${folder}`);

const isFolderExists = (folder) => existsSync(`${__dirname}/${folder}`);

const isFileContainsText = (path, content) =>
  readFileSync(path, "utf-8").includes(content);

const hasFileWithName = (path, fileName) =>
  readdirSync(path).some((name) => name.includes(fileName));

describe("e2e", () => {
  it("should create the template with the right values as keys", () => {
    execOnTestDir("create not-nested key1=awesome --folder not-nested");
    expect(isFolderExists("not-nested")).toBeTruthy();
    expect(
      isFileContainsText(`${__dirname}/not-nested/awesome.js`, "awesome")
    ).toBeTruthy();
    expect(
      hasFileWithName(`${__dirname}/not-nested`, "awesome.js")
    ).toBeTruthy();
    cleanUp("not-nested");
  });

  it("runs all of the commands without throwing", () => {
    execOnTestDir("list");
    execOnTestDir("show not-nested");
  });
});
