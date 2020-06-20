const fs = require("fs");
const TemplatesBuilder = require("./index");
const { join } = require("../createTemplateStructure");
const { FolderAlreadyExists } = require("../../Errors");
jest.mock("fs");

describe("TemplatesBuilder", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("when invoking inAFolder a new folder is created", () => {
    const folder = "MyFolder";
    fs.existsSync.mockReturnValue(false);
    const templateBuilder = new TemplatesBuilder([]);
    templateBuilder.inAFolder(folder).build();
    expect(fs.mkdirSync).toBeCalledWith(join(process.cwd(), folder));
  });

  it("if a folder with the same name exists in the path then a FolderAlreadyExists error is thrown", () => {
    const folder = "MyFolder";
    fs.existsSync.mockReturnValue(true);
    const templateBuilder = new TemplatesBuilder();
    expect(() => templateBuilder.inAFolder(folder).build()).toThrow(
      FolderAlreadyExists
    );
    expect(fs.mkdirSync).not.toHaveBeenCalled();
  });

  it("when invoking create an array of promises is returned", () => {
    const templates = [
      { name: "gal", content: "what" },
      { name: "gal1", content: "what1" },
      { name: "gal2", content: "what2" },
    ];
    const templateBuilder = new TemplatesBuilder(templates);
    const result = templateBuilder.build();
    expect(result).toHaveLength(3);
    result.forEach((p) => {
      expect(p).toBeInstanceOf(Promise);
    });
  });
});
