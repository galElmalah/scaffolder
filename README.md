

<div align="center">

![Scaffolder logo](scaffolder-logo.png)  

</div>

<h3 align="center">Scaffolder</h3>

<div align="center">

[![npm version](https://badge.fury.io/js/scaffolder-cli.svg)](https://badge.fury.io/js/scaffolder-cli)
[![GalElmalah](https://circleci.com/gh/galElmalah/scaffolder.svg?style=svg)](https://app.circleci.com/pipelines/github/galElmalah/scaffolder)

</div>

---

<p align="center"> 
  Scaffolder lets you create dynamic templates and increase your development velocity. :shipit:.        <br/>
  With Scaffolder you can define custom file structre template and link them to specifc commands which can then be used to create them in a few easy steps!
  <br> 
</p>

---

**For a brief introduction and motivation for this tool, [read this](https://dev.to/galelmalah/what-is-scaffolder-and-how-you-can-use-it-to-increase-your-team-dev-velocity-558l).**

**check out the [vscode extension](https://github.com/galElmalah/scaffolder-vscode)**

---

### TOC

- [API](#api)
  - [interactive, i](#interactive-i)
  - [create _\<commandName>_](#create-commandname)
  - [list, ls](#list-ls)
  - [show _\<commandName>_](#show-commandname)
- [Sharing templates](#sharing-templates)
- [Scaffolder config file](#scaffolder-config-file)
  - [transformers](#transformers)
    - [default transformers](#default-transformers)
  - [functions](#functions)
  - [parametersOptions](#parametersoptions)
    - [parameter options object](#parameter-options-object)
  - [context object](#context-object)  
  - [templatesOptions](#templatesoptions)
    - [templates options object](#templates-options-object)
    - [hooks object](#hooks-object)
- [Getting started](#getting-started)
  - [install scaffolder globally](#install-scaffolder-globally)
  - [Create a commands folder in your project root directory](#create-a-commands-folder-in-your-project-root-directory)

## API

### **interactive, i**

Run the scaffolder in an interactive mode, meaning, it will prompt the user to choose a template and a value for each parameter.
This command is the most recommended one as it simplifies the process for the user a lot.

**options:**
- _--from-github_  
  Passing this flag will cause a prompt to appear, asking the user to enter a github repository (https/ssh) and consume the templates defined on that repository.  
  More info about [sharing templates](#sharing-templates).
- _--entry-point_ _\<absolutePath>_  
  Generate the template to a specified location.

### **create** _\<commandName>_

_\<commandName>_: One of the commands defined in the **scaffolder** folder. <br/>
 
**options:**

- _--load-from_ _\<absolutePath>_  
  Load the templates from a specific location.
- _--entry-point_ _\<absolutePath>_  
  Generate the template to a specified location.
- --folder, -f _\<folderName>_  
  _\<folderName>_: The name of the folder you want the template to be generated into. If none is supplied the template will be generated to the current working directory.
- _\<parameter>=\<value>_  
  _\<parameter>_: One of the parameters for a specific template  
  _\<value>_: The value you want the parameter to be replaced with.

### **list**, **ls**

Show the available commands from the current working directory.

### **show** _\<commandName>_

Show a specific command template files  
 **options:**

- _--show-content_  
  Also show the full content of the template files.

---

## Sharing templates  
Often you find yourself wanting to share a template while not making every consumer of that template to save it on his machine.  

In order to address that problem, Scaffolder lets you consume templates from Github repositories that have a **scaffolder** folder at their root.  
For example, you can see this [repository](https://github.com/galElmalah/scaffolder-templates-example) which contains 3 templates and a config file.
To generate one of those templates you can run `npx scaff i --from-github` and enter `https://github.com/galElmalah/scaffolder-templates-example.git` and you'll be promoted to choose one of those templates.   
> Any improvement suggestions? go ahead and [open an issue](https://github.com/galElmalah/scaffolder/issues)!

---

## Scaffolder config file

Scaffolder lets you extend and define all sorts of things via a config file.  
the config file should be placed inside the **scaffolder** folder that the template you are generating is defined in and named `scaffolder.config.js`.

Through the `scaffolder.config.js` file you can extend and customize scaffolder in several ways.  
Example config file

```javascript
module.exports = {
  transformers: {
    toLowerCase: (parameterValue, context) => parameterValue.toLowerCase(),
  },
  functions: {
    date: (context) => Date.now(),
  },
  parametersOptions: {
    someParameter: {
      question:
        "this text will be shown to the user in the interactive mode when he will be asked to enter the value for 'someParameter'",
    },
  },
   templatesOptions: {
      someTemplate: {
        hooks: {
          preTemplateGeneration: (context) => {
          // do something before generating a template
          },
          postTemplateGeneration: (context) => {
          // do something after generating a template
          }
      }
    },
  },
};
```

### transformers

Transformers can be used to transform a parameter value.  
For example, you can write the following:
`{{ someParameter | toLowerCase | someOtherTransformer }}`
and the value that will be injected in your template will be the value after all of the transformations.

- Transformers can be chained together.
- Transformers are invoked with the value supplied for that parameter as the first argument and the [context](#context-object) object as the second argument.

#### Default transformers
You can use the following transformers without defining anything in your config file  
  1. toLowerCase
  2. 	toUpperCase
  3. 	capitalize - capitalize each word in your parameter value
  4. 	toCamelCase - takes Kebab or snake case and transform them to camelCase format
  5. 	camelCaseToSnakeCase
  6. 	camelCaseToKebabCase

### functions

functions are very similar to transformations, but they are unary, meaning, they are invoked without any parameter value supplied to them.  
For example, you can write the following:
`{{date()}}` and the value returned from are date function (defined in our config file) will be injected to the template.

### parametersOptions

parametersOptions is a map from parameters to their options.  
For example, lets say we have a parameter named myReactComponentName and we want to show a custom question to the user when he is asked to enter a value for that parameter, we can add the following to our config file:

```javascript
{
  ...
  ...
  parametersOptions: {
    myReactComponentName: {
      question: "Enter a name for your react component:",
       validation: (value) => value.length > 3 ? true : "The component name must be longer than 3 chars" 
    }
  }
}
```
#### parameter options object
| property        | type                                                        | description                                                                                            |
| :-------------- | :---------------------------------------------------------- | :----------------------------------------------------------------------------------------------------- |
| question    | string                                     | The question that will be shown to the user when he will enter a value for the matching parameter             |
| validation    | (value: string): string \| true                                                      | this function will be invoked to validate the user input.<br/>Return a string  if the value is invalid, this string will be shown to the user as an error message. Return true if the value is valid.                                                              |




### context object

| property        | type                                                        | description                                                                                            |
| :-------------- | :---------------------------------------------------------- | :----------------------------------------------------------------------------------------------------- |
| parametersValues | Object<string, string>                                      | Key value pairs containing each parameter and his associated value in the current template.                  |
| templateName    | string                                                      | The name of the template being generated.                                                              |
| templateRoot    | string                                                      | Absolute path to the template being generated.                                                         |
| targetRoot      | string                                                      | Absolute path to the location the template is being generated into.                                    |
| currentFilePath | string                                                      | The path to the file being created.                                                                    |
| type            | string, one of: `"FILE_NAME"`, `"FILE_CONTENT"`, `"FOLDER"` | The current type being operated upon - file/folder/content.                                            |
| fileName        | string                                                      | The name of the file being operated upon. Available only if the type is "FILE_NAME" or "FILE_CONTENT". |

---

### templatesOptions
templatesOptions is a map from templates names to their options.  
Currently there is only support for hooks but this will probably change in the future as more and more features will be supported.


#### templates options object
| property        | type                                                        | description                                                                                            |
| :-------------- | :---------------------------------------------------------- | :----------------------------------------------------------------------------------------------------- |
| hooks    | [hooks object](#hooks-object)                                     | Hooks are functions to be executed at some point throughout the template generation process.             |

#### hooks object
If an hook function returns a Promise then it will be awaited and only then the template generation process will continue .

| property        | type                                                        | description                                                                                            |
| :-------------- | :---------------------------------------------------------- | :----------------------------------------------------------------------------------------------------- |
| preTemplateGeneration    | ([context](#context-object)): any \| Promise\<any>                                    | Executed before the template is generated.             |
| postTemplateGeneration    | ([context](#context-object)): any \| Promise\<any>                                    | Executed after the template is generated.             |


## Getting started

### install scaffolder globally

```npm
npm i -g scaffolder-cli
```

### Create a commands folder in your project root directory

The commands folder should be named **scaffolder** and it should contain a folder with each folder representing a different command and inside of that folder, there is the template you wish to create.  
The commands available are the commands defined in the **scaffolder** folder.  
If you have more scaffolder folders in the current file system hierarchy then all of them will be included with precedence to the nearest **scaffolder** folder.  
**For example:**  
In our current project root

```bash
scaffolder
├── component
│   ├── index.js
│   ├── {{componentName}}.js
│   └── {{componentName}}.spec.js
└── index
    └── index.js
```

In our desktop

```bash
scaffolder
├── component
│   ├── index.js
│   ├── {{lol}}.js
│   └── {{wattt}}.spec.js
└── coolFile
    └── coolFile.sh
```

From the above structure, we will have three commands **component** (from the project scaffolder), **index** (from the project scaffolder) and **coolFile** (from the desktop scaffolder).  
Lets look at the content of **{{componentName}}.js** and **{{componentName}}.spec.js**.
**{{componentName}}.js** from the current project **scaffolder** folder.

```javascript
import React from 'react'

export const {{componentName}} = (props) => {
  return (
    <div>
      Such a cool component
    </div>
  )
}
```

**{{componentName}}.spec.js**

```javascript
import React from 'react';
import { mount } from 'enzyme';
import { {{componentName}} } from './{{componentName}}';

describe('{{componentName}}', () => {
  it('should have a div', () => {
    const wrapper = mount(
      <{{componentName}} />
    );
   expect(wrapper.find('div').exists()).toBeTruthy()
  });
});
```

Now let's run the following command somewhere in our project

```bash
scaff create component componentName=CoolAFComponent --folder MyCoolComp
```

A new folder will be created under our current working directory, let's look at what we got.

```bash
MyCoolComp
├── CoolAFComponent.js
├── CoolAFComponent.spec.js
└── index.js
```

**CoolAFComponent.js**

```javascript
import React from "react";

export const CoolAFComponent = (props) => {
  return <div>Such a cool component</div>;
};
```

**CoolAFComponent.spec.js**

```javascript
import React from "react";
import { mount } from "enzyme";
import { CoolAFComponent } from "./CoolAFComponent";

describe("CoolAFComponent", () => {
  it("should have a div", () => {
    const wrapper = mount(<CoolAFComponent />);
    expect(wrapper.find("div").exists()).toBeTruthy();
  });
});
```

This could also be achived using the interactive mode!
![](scaffolder.gif)

How cool is this, right?  
As you can see our params got injected to the right places and we created our template with little effort.  
Hooray!! :sparkles: :fireworks: :sparkler: :sparkles:
