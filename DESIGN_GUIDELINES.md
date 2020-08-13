# Design Guidelines

This repository is written entirely in vanilla [React](https://reactjs.org/), using [TypeScript](https://www.typescriptlang.org/) for components and modules and [Sass](https://sass-lang.com/) for stylesheets.

The purpose of this document is to provide information and guidelines for designing and writing code for this website in order to ensure consistency and clarity for all contributors, present and future.

As much as possible, the guidelines in this document are enforced by ESLint (for `.ts`. and `.tsx` files) and StyleLint (for `.scss` files).
As such, whenever you commit code, we recommend you run `yarn lint` to ensure that you're adhering to these guidelines.

## General Syntax and Format

* All lines must end in a semicolon.
* Component and interface names, imported assets, static functions, and static variables must be in PascalCase.
* Non-static functions, non-static variables, interface fields, and style classes must be in camelCase.
* Indentation uses two spaces.
* For multiline blocks, opening braces/brackets must be on the same line as the preceding code, while closing braces/brackets must be on their own line.
* For interfaces, JSON files, etc. the last field **must** have a trailing comma in order to have clean file diffs.
* Local `import` statements must use relative file paths.

## What Not to Touch

`src/index.tsx` creates the website's DOM and inserts the `App` component (see below).
As such, unless absolutely necessary, you should not modify this file---nor should you need to.

`src/global.scss` is the global stylesheet for the website, applied to `src/index.tsx`.
Here, too, you should try to avoid modifying this file, although in some cases it may be appropriate.

## Component Design

The `src/components/App.tsx` is the root component for the entire website.
Note that this is not to be confused with `src/index.tsx`, which creates the website's DOM and then inserts the `App` component.

### Adding a new component

All React component modules are to be created under the `src/components/` directory, with a filename `<ComponentName>.tsx`.

If you make multiple sub-component for a single top-level component, you may create a further sub-directory in which you include any relevant component files as well as an additional module named `<ComponentName>.tsx` which exports the top-level component.
The sub-directory's name should match the name of said top-level component.
Ensure that the sub-components' files follow the aforementioned naming convention.

This may be clearer with an example.
Suppose you are making a new component for a header named `Header` which consists of a logo and a series of navigation links, which you want to use as sub-components named `Logo` and `NavLink`, respectively.
In such a case, your file tree may look something like this:
```
src
├── components
│   ├── styles
│   │   ├── App.scss
│   │   └── Header.scss [see below]
│   ├── Header
│   │   ├── index.tsx
│   │   ├── Logo.tsx
│   │   └── NavLinks.tsx
│   └── App.tsx
├── global.scss
├── index.tsx
└── ...
```

### Writing a component module

For this website, we are using [*functional components*](https://reactjs.org/docs/components-and-props.html) and **not** class-based components.
This is because functional components allow us to use [React Hooks](https://reactjs.org/docs/hooks-intro.html), which allow greater flexibility and control over having to rely on rigid lifecycle methods such as `componentDidUpdate` and `componentWillMount`.

Component properties, if applicable, must have a corresponding `interface` with clearly-defined types for its fields.
This interface must appear in the same file as the component (or the corresponding top-level module) above the exported function.
The name of this `interface` must be `<ComponentName>Props`.
Optional properties (using the syntax `<propertyName>?: <type>`) are OK, but try to avoid using them unless you need to.

Refrain from adding extra functions to a component module outside of the component function itself.
If you want to include simple, brief functions within a component module, add them to the component function as named lambda expressions, like so:
```typescript
const someFunction = (arg1: <type>, arg2: <type>, ...): <return type> => {
  ...
};
```
This is primarily useful for functions that use JSX code.

For larger, more complex functions that don't use JSX code, consider including it in a separate utility module.
See [**Hooks and Utilites**](#styling) below for more information.

Following this, the general structure of a component module (for an imaginary component named `ComponentName`) will look something like this:
```typescript
import React from 'react';

interface ComponentNameProps {
  someField: number,
  anotherField?: string,
  ...
}

export default function ComponentName(props: ComponentNameProps) {
  ...

  return(
    ...
  );
}
```

## Styling

Styles for a component should be placed in `src/components/styles/`.
The stylesheet's file name, like the component's name, should be `<ComponentName>.tsx`.
If your component consists of multiple sub-components, you must use **one single** stylesheet for all these sub-components and the top-level component.
In this case, the stylesheet's file name will match the name of the top-level component.

As mentioned in [**General Syntax and Format**](#general-syntax-and-format) above, class and identifier names must be in camelCase.
All rules within a style must end with a semicolon.

Do **not** use `!important`.
Nine times out of ten, any problems solved by adding this to a rule can be solved by rearranging some code.
If you absolutely need to use `!important`, make sure you include a comment in your PR explaining why.

## Hooks and Utilities

If you make any functions or interfaces which are not directly linked to or are too large to be a lambda function member of a specific component, such as a utility function for performing a useful calculation or a custom React Hook, these must go inside the `src/utils/` directory.
To maintain structure, we recommend you adhere to the following file organization guidelines:

* Functions which perform a series of mathematical calculations or manipulations should go inside a file named `MathUtils.ts`.
* Complex functions used in a specific component should go inside a file named `<ComponentName>Utils.ts`.
* General, non-specific utilites should go inside a file named `Utils.ts`.
* Custom React Hooks should go inside a file named `Hooks.ts`.

## Assets

All assets must go inside the `src/assets/` directory.
As much as possible, use `.svg` files if you can.
To use an asset inside a component, you must import it like so (file path is just an example):
```typescript
import <AssetName> from '../../assets/<asset>.<ext>';
```

Remember from [**General Syntax and Format**](#general-syntax-and-format) above that imported asset names must be in PascalCase.
Apart from that, you may name the asset whatever you feel is appropriate.
