const { injector, extractKey } = require("./index");
const {
  MissingKeyValuePairs,
  MissingTransformerImplementation,
} = require("../../Errors");

describe("templatesCreator -> injector", () => {
  it("should replace all keys matching the folllwing format {{ key }}", () => {
    const keys = {
      key1: "React",
      key2: "react",
    };
    const testTemplate = 'import {{key1}} from "{{key2}}"';
    const keysInjector = injector(keys);
    expect(keysInjector(testTemplate)).toBe('import React from "react"');
  });

  it("should ignore outer {} so this is also valid { {{}} }", () => {
    const keys = {
      key1: "The",
      key2: "Fuck",
    };
    const testTemplate = "What {{{ key1 }}} {{{key2}}}";
    const keysInjector = injector(keys);
    expect(keysInjector(testTemplate)).toBe("What {The} {Fuck}");
  });

  it("should throw MissingKeyValuePairs if there is no key matching one of the keys in the template", () => {
    const keys = {
      key1: "The",
      key2: "Fuck",
    };
    const testTemplate = "What {{{key1}}} {{{key2}}} {{key3}}";
    const keysInjector = injector(keys);
    expect(() => keysInjector(testTemplate)).toThrow(MissingKeyValuePairs);
  });

  it("should ignore white spaces around the keys", () => {
    const keys = {
      key1: "The",
      key2: "Fuck",
    };
    const testTemplate = "What {{{key1 }}} {{{  key2  }}} {{  key3 }}";
    const keysInjector = injector(keys);
    expect(() => keysInjector(testTemplate)).toThrow(MissingKeyValuePairs);
  });

  it("should handle a full template", () => {
    const keys = {
      key1: "yeah",
      key2: "whats",
      key3: "up",
    };
    const testTemplate = `
      {{key1}}{{key2}}{{key3}}
      const handleError = {{ key1 }} => {
        if ({{ key1 }}.getDisplayErrorMessage) {
          console.log({{ key1 }}.getDisplayErrorMessage());
        } else {
          console.error({{ key2 }});
        }
      };
      
      const generate{{key2}}Values = cmd =>
        cmd.parent.rawArgs
          .filter(arg => arg.includes('='))
          .map(keyValuePair => keyValuePair.split('='))
          .reduce(
            (accm, [{{key2}}, value]) => ({
              ...accm,
              [{{key2}}.trim()]: value.trim(),
            }),
            {}
          );
      
      `;
    const keysInjector = injector(keys);
    expect(keysInjector(testTemplate)).toBe(
      `
      ${keys.key1}${keys.key2}${keys.key3}
      const handleError = ${keys.key1} => {
        if (${keys.key1}.getDisplayErrorMessage) {
          console.log(${keys.key1}.getDisplayErrorMessage());
        } else {
          console.error(${keys.key2});
        }
      };
      
      const generate${keys.key2}Values = cmd =>
        cmd.parent.rawArgs
          .filter(arg => arg.includes('='))
          .map(keyValuePair => keyValuePair.split('='))
          .reduce(
            (accm, [${keys.key2}, value]) => ({
              ...accm,
              [${keys.key2}.trim()]: value.trim(),
            }),
            {}
          );
      
      `
    );
  });

  it("Extracts the key as expected", () => {
    const keysBeforeExtraction = [
      "{{ test }}",
      "{{ test}}",
      "{{test }}",
      "{{test}}",
    ];
    keysBeforeExtraction.forEach((key) => {
      expect(extractKey(key)).toBe("test");
    });
  });

  describe("applyTranformers", () => {
    it("should handle a full template and apply all transforamtions", () => {
      const keys = {
        key1: "YEAH",
        key2: "whats",
        key3: "up",
      };
      const testTemplate = `
        {{key1}}{{key2}}{{key3}}
        const handleError = {{ key1 | toLowerCase | repeat }} => {
          if ({{ key1 }}.getDisplayErrorMessage) {
            console.log({{ key1 }}.getDisplayErrorMessage());
          } else {
            console.error({{ key2 }});
          }
        };
        
        const generate{{key2}}Values = cmd =>
          cmd.parent.rawArgs
            .filter(arg => arg.includes('='))
            .map(keyValuePair => keyValuePair.split('='))
            .reduce(
              (accm, [{{key2}}, value]) => ({
                ...accm,
                [{{key2}}.trim()]: value.trim(),
              }),
              {}
            );
        
        `;

      const transformersMap = {
        toLowerCase: jest.fn().mockImplementation((key) => key.toLowerCase()),
        repeat: jest.fn().mockImplementation((key) => `${key}${key}`),
      };

      const keysInjector = injector(keys, transformersMap);

      const result = keysInjector(testTemplate);

      expect(transformersMap.toLowerCase).toHaveBeenCalledWith("YEAH");
      expect(transformersMap.repeat).toHaveBeenCalledWith("yeah");

      expect(result).toBe(
        `
        ${keys.key1}${keys.key2}${keys.key3}
        const handleError = ${
          keys.key1.toLowerCase() + keys.key1.toLowerCase()
        } => {
          if (${keys.key1}.getDisplayErrorMessage) {
            console.log(${keys.key1}.getDisplayErrorMessage());
          } else {
            console.error(${keys.key2});
          }
        };
        
        const generate${keys.key2}Values = cmd =>
          cmd.parent.rawArgs
            .filter(arg => arg.includes('='))
            .map(keyValuePair => keyValuePair.split('='))
            .reduce(
              (accm, [${keys.key2}, value]) => ({
                ...accm,
                [${keys.key2}.trim()]: value.trim(),
              }),
              {}
            );
        
        `
      );
    });

    it("should throw a 'MissingTransformerImplementation' error when there is no transformer defined for a specifc tranformer key", () => {
      const keys = {
        key1: "YEAH",
      };
      const testTemplate = `
        const handleError = {{ key1 | toLowerCase | repeat }} => {
        `;

      const transformersMap = {
        someTranformer: () => {},
      };

      const keysInjector = injector(keys, transformersMap);

      expect(() => keysInjector(testTemplate)).toThrowError(
        MissingTransformerImplementation
      );
    });
  });
});
