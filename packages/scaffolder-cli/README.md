

<div align="center">

![Scaffolder logo](../../images/scaffolder-logo.png)  

</div>

<h3 align="center">Scaffolder</h3>

<div align="center">

[![npm version](https://badge.fury.io/js/scaffolder-cli.svg)](https://badge.fury.io/js/scaffolder-cli)
[![GalElmalah](https://circleci.com/gh/galElmalah/scaffolder.svg?style=svg)](https://app.circleci.com/pipelines/github/galElmalah/scaffolder)

</div>

---

<p align="center"> 
 Scaffolder CLI
  <br> 
</p>

---

**For a brief introduction and motivation for this tool, [read this](https://dev.to/galelmalah/what-is-scaffolder-and-how-you-can-use-it-to-increase-your-team-dev-velocity-558l).**

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
  
 ---
 
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

The templates folder should be named **scaffolder** and should contain folders where each folder represents a different template and inside of that folder, there is the template structure you wish to create.  
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

