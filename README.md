
<h3 align="center">CTF - Create Template Folder</h3>

<div align="center">

   [![npm version](https://badge.fury.io/js/ctf-cli.svg)](https://badge.fury.io/js/ctf-cli)

</div>

---

  <p align="center"> CTF lets you create dynamic templates and increase your project velocity. :shipit:.
  With CTF you can define custom file structre template and link them to specifc commands which then can be used to create them in a few easy steps!
    <br> 
</p>

## API

### Commands

- create _\<commandName>_  
  _\<commandName>_: One of the commands defined in the **ctf** folder.
- list, ls
  Show the available commands from the current working directory.

### Options

- --folder, -f _\<folderName>_  
  _\<folderName>_: The name of the folder you want the template to be generated into. If none is supplied the template will be generated to the current working directory.

- _\<key>=\<value>_
  _\<key>_: One of the keys for a specific template  
  _\<value>_: The value you want the key to be replaced with.  
  **Must come after the create \<commandName>**

## Getting started

### install ctf globaly

```npm
npm i -g ctf-cli
```

### Create a commands folder in your project root directory

The commands folder should be named **ctf** and it should contain a folder with each folder representing a different command and inside of that folder, there is the template you wish to create.  
The commands available are the commands defined in the **ctf** folder.  
If you have more ctf folders in the current file system hierarchy then all of them will be included with precedence to the nearest **ctf** folder.  
**For example:**  
In our current project root

```bash
ctf
├── component
│   ├── index.js
│   ├── {{componentName}}.js
│   └── {{componentName}}.spec.js
└── index
    └── index.js
```

In our desktop

```bash
ctf
├── component
│   ├── index.js
│   ├── {{lol}}.js
│   └── {{wattt}}.spec.js
└── coolFile
    └── coolFile.sh
```

From the above structure, we will have three commands **component** (from the project ctf), **index** (from the project ctf) and **coolFile** (from the desktop ctf).  
Lets look at the content of **{{componentName}}.js** and **{{componentName}}.spec.js**.
**{{componentName}}.js** from the current project **ctf** folder.

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
ctf create component componentName=CoolAFComponent --folder MyCoolComp
```

A new folder will be created under our currently working folder, let's look at what we got.

```bash
MyCoolComp
├── CoolAFComponent.js
├── CoolAFComponent.spec.js
└── index.js
```

**CoolAFComponent.js**

```javascript
import React from 'react';

export const CoolAFComponent = props => {
  return <div>Such a cool component</div>;
};
```

**CoolAFComponent.spec.js**

```javascript
import React from 'react';
import { mount } from 'enzyme';
import { CoolAFComponent } from './CoolAFComponent';

describe('CoolAFComponent', () => {
  it('should have a div', () => {
    const wrapper = mount(<CoolAFComponent />);
    expect(wrapper.find('div').exists()).toBeTruthy();
  });
});
```

How cool is this, right?  
As you can see our params got injected to the right places and we created our template with little effort.  
Horray!! :sparkles: :fireworks: :sparkler: :sparkles:

## TODO

1. Support global settings. DONE
2. Support templates packages so there would be abillity to install templates via npm.
