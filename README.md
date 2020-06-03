<h3 align="center">Scaffolder - Creating Template Folder</h3>

<div align="center">

[![npm version](https://badge.fury.io/js/ctf-cli.svg)](https://badge.fury.io/js/scaffolder-cli)

</div>

---

<p align="center"> 
  Scaffolder lets you create dynamic templates and increase your project velocity. :shipit:.        <br/>
  With Scaffolder you can define custom file structre template and link them to specifc commands which then can be used to create them in a few easy steps!
  <br> 
</p>

## API

### Commands

- **interactive, i**: run the tool in interactive mod, meaning, it will prompt the user to choose a template and a value for each key and in the end will ask if the template should be generated in a folder.  
  this command is the most recommended one as it simplified the process for the user a lot.

- **create** _\<commandName>_  
   _\<commandName>_: One of the commands defined in the **scaffolder** folder. <br/>**options:**
  - _--load-from_  
    Load the templates from a specific location _\<absolutePath>_.
  - _--entry-point_  
    Generate the template to a specified location _\<absolutePath>_.
  - --folder, -f _\<folderName>_  
    _\<folderName>_: The name of the folder you want the template to be generated into. If none is supplied the template will be generated to the current working directory.
  - _\<key>=\<value>_  
    _\<key>_: One of the keys for a specific template  
    _\<value>_: The value you want the key to be replaced with.
- **list**, **ls**  
  Show the available commands from the current working directory.
- **show** _\<commandName>_  
  Show a specific command template files  
  **options:**
  - _--show-content_  
    Also show the full content of the template files.

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
scaffolder create component componentName=CoolAFComponent --folder MyCoolComp
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
![](ctf-comp.gif)

How cool is this, right?  
As you can see our params got injected to the right places and we created our template with little effort.  
Horray!! :sparkles: :fireworks: :sparkler: :sparkles:
