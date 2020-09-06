

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
  Copy pasting is hard and prone to mistakes.<br/>
  Keeping your project file structure consistent is annoying.<br/>
  Sharing templates is too damn complicated!<br/>
  This is where Scaffolder come in.
  <br> 
</p>

---

**For a brief introduction and motivation for this tool, [read this](https://dev.to/galelmalah/what-is-scaffolder-and-how-you-can-use-it-to-increase-your-team-dev-velocity-558l).**

**check out the [vscode extension](https://github.com/galElmalah/scaffolder-vscode)**

---

### TOC

- [Getting started](#getting-started)
  * [Setup](#setup)
  * [Usage](#usage)
    + [Create a templates folder in your project root directory](#create-a-templates-folder-in-your-project-root-directory)
- [API](#api)
  * [**interactive, i**](#interactive-i)
  * [**create** _\<templateName>_](#create-templatename)
  * [**list**, **ls**](#list-ls)
  * [**show** _\<templateName>_](#show-templatename)
- [Sharing templates](#sharing-templates)
- [Scaffolder config file](#scaffolder-config-file)
  * [transformers](#transformers)
    + [Default transformers](#default-transformers)
  * [functions](#functions)
  * [parametersOptions](#parametersoptions)
    + [parameter options object](#parameter-options-object)
  * [context object](#context-object)
  * [templatesOptions](#templatesoptions)
    + [templates options object](#templates-options-object)
    + [hooks object](#hooks-object)
- [Motivation and globals](#motivation-and-globals)
  * [Why I wrote Scaffolder?](#why-i-wrote-scaffolder-)
  * [Why I didn’t use any existing solutions?](#why-i-didnt-use-any-existing-solutions-)
  * [My goals while writing this tool](#my-goals-while-writing-this-tool)

## Getting started

### Setup
Install scaffolder globally
```bash
npm i -g scaffolder-cli
```
this will make the `scaff` command available globally, you can now type `scaff i` in the terminal, to enter the cli in [interactive mode](#interactive-i).

You can also use `npx` for example `npx scaffolder-cli i` will start scaffolder in [interactive mode](#interactive-i).

### Usage

#### Create a templates folder in your project root directory

The templates folder should be named **scaffolder** and should contain a folders where each folder represents a different template and inside of that folder, there is the template structure you wish to create.  
> The templates available are the templates defined in the **scaffolder** folder.  

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

This could also be achieved using the interactive mode!
![](scaffolder.gif)

How cool is this, right?  
As you can see our params got injected to the right places and we created our template with little effort.  
Hooray!! :sparkles: :fireworks: :sparkler: :sparkles:


## API

### **interactive, i**

Run Scaffolder in interactive mode, meaning, it will prompt the user to choose a template and a value for each parameter.  
> This command is the most recommended one as it simplifies the process for the user a lot.

**options:**
- _--from-github_  
  Passing this flag will cause a prompt to appear, asking the user to enter a github repository (https/ssh) and consume the templates defined on that repository.  
  More info about [sharing templates](#sharing-templates).
- _--entry-point_ _\<absolutePath>_  
  Generate the template to a specified location.
- _--path-prefix_ _\<relativePath>_  
  Path that will be appended the the location the script is generated into.
- _--template_ _\<templateName>_  
  Start the interactive mode with a preselected template.

### **create** _\<templateName>_

_\<templateName>_: One of the templates defined in the **scaffolder** folder. <br/>
 
**options:**

- _--load-from_ _\<absolutePath>_  
  Load the templates from a specific location.
- _--entry-point_ _\<absolutePath>_  
  Generate the template to a specified location.
- _--path-prefix_ _\<relativePath>_  
  Path that will be appended the the location the script is generated into.
- _--folder, -f_ _\<folderName>_  
  _\<folderName>_: The name of the folder you want the template to be generated into. If none is supplied the template will be generated to the current working directory.
- _\<parameter>=\<value>_  
  _\<parameter>_: One of the parameters for a specific template  
  _\<value>_: The value you want the parameter to be replaced with.

### **list**, **ls**

Show the available templates from the current working directory.

### **show** _\<templateName>_

Show a specific template files  
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

## Motivation and goals
### Why I wrote Scaffolder?
Working on several big projects, I noticed that there a few time-consuming tasks that keep popping up. One of those tasks is creating folders and filling in all the boilerplate code while keeping the project structure consistent. After realizing that this process needs to be automated, I set out to find a solution and ended up creating my own CLI tool 🌈.

The first thing I had to do is to understand **WHY** it’s so annoying, and I realized that this happens for two reasons:

- Creating files and folders can be repetitive, annoying and a waste of time. Especially if some content repeats itself for every new file.
- Keeping a project file structure consistent is becoming more and more complex as the number of people working on that project increases — each team member has his preference for naming files and exposing functionality.

### Why I didn’t use any existing solutions?
***First***, came [Yeoman](https://yeoman.io/). I gave yeoman a try but found it too complex. Furthermore, I want the templates to be a part of the project (in some cases), and committed to git alongside the code. Thus, supporting template generation offline and tight coupling between the project and the templates. All of the above seemed too complex or not possible at all with yeoman, so one hour after trying it out I moved on to other prospects.

***Second***, came [boiler](https://github.com/tmrts/boilr), I did not like this one for the same reasons I did not like Yeoman. Also, the fact that it’s not managed with npm is a bit annoying.

***Third***, came frustration 😞. After trying two of the most popular solutions out there I realized that If I want something tailored to my needs I should just go ahead and write it myself.

Both of these tools are **AWESOME** but for my needs, they weren’t right.

### My goals while writing this tool
- making this process as easy and seamless as possible.

- Addressing the general problem. Meaning, it won’t be language-specific e.g only React or Vue templates. I could potentially create templates in any shape, structure, and language I want.

- Having the ability to create scoped templates. Meaning, creating project-specific templates that can be committed to git with the rest of the code.
- Having the ability to create “global” templates that will be available from anywhere.
- Managed with npm.
