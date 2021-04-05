# Design Guidelines

This repository is written entirely in [Next.js](https://nextjs.org/), using
[TypeScript](https://www.typescriptlang.org/) for components and [Sass](https://sass-lang.com/) for 
stylesheets.

The purpose of this document is to provide information and guidelines for designing and writing code for this website in order to ensure consistency and clarity for all contributors, present and future.

As much as possible, the guidelines in this document are enforced by ESLint (for `.ts`. and `.tsx` files) and StyleLint (for `.scss` files).
As such, whenever you commit code, we recommend you run `yarn lint` to ensure that you're adhering to these guidelines.

- [General Syntax and Format](#General-Syntax-and-Format)
- [Repository Architecture](#Repository-Architecture)
  - [components/](#components/)
  - [pages/](#pages/)
  - [public/](#public/)
  - [scripts/](#scripts/)
  - [styles/](#styles/)
  - [utils/](#utils/)
- [Component Design](#Component-Design)
  - [Adding a new component](#adding-a-new-component)
  - [Writing a component module](#writing-a-component-module)
- [Styling](#Styling)
  - [Module based Styling](#module-based-styling/)
- [Utilities](#Hooks-and-Utilities)
- [Assets](#Assets)

## General Syntax and Format

* All lines must end in a semicolon.
* Indentation uses two spaces.
* Component and interface names, imported assets, static functions, and static variables must be in PascalCase.
* Non-static functions, non-static variables, interface fields, and style classes must be in camelCase.
* For multiline blocks, opening braces/brackets must be on the same line as the preceding code, while closing braces/brackets must be on their own line.
* For interfaces, JSON files, etc. the last field **must** have a trailing comma in order to have clean file diffs.
* Local `import` statements must use relative file paths.

## Repository Architecture

The respository architecture we utilize for `Sunshine` makes all types of files first class citizens.
Usually, in a `React` project, you would have a `src/` which branches into directories like `assets/`, `components/`, and `styles/`. One of the downloads to such a nested structure is that files are 
easily lost and duplication happens more frequently.

`Sunshine` is organized with different files segmented into first class directories.

```
sunshine/
├── .github/
├── components/
├── pages/
├── public/
├── scripts/
├── styles/
├── utils/
└── ...
```

### components/

Components are resuable and/or abstracted React Components used in our pages. Whether you are creating
a [`Layout`](components/Layout.tsx) to ensure consistency across webpages, or creating a
[`NavBar`](components/Navbar.tsx), they belong within the `components/` page.

For example, we use [`Layout.tsx`](components/Layout.tsx) to define the generic page layout for all
of our pages. This ensures consitency across pages and reduces future work in respect to creating 
pages.

### pages/

The `pages/` directory holds all of the pages of our website. Routing in `Next.js` is as easy as
creating a file in `pages/` that corresponds to the desired pathname.

For example, if I want to create a team page where the pathname to visit this page lies at `/team`.
I would go into `pages/` and create the file `team.tsx`.

> Notice how the pathname is identical to the file name! `path.tsx` ➡️ `/path`

### public/

The `public/` directory holds all of our public assets. Put all `svg`, `img`, `favicon`, etc here.

### scripts/

The `scripts/` directory stores any development or build time scripts. Anything that a user doesn't
interact with goes in this folder. Generally, if the script you are writing is for the benefit of a
developer as opposed to a user it belongs in this directory.

### styles/

The `styles/` directory is the home for all the stylsheets. These style sheets MUST follow
[CSS Modules](https://github.com/css-modules/css-modules).

### utils/

The `utils/` directory hosts all hooks, utility funcitons, and componentless objects. Utilities should
be organized by topic, NOT by the originating Component. Generally, components tend to share actions
and in those cases, it's better to quickly look up existing utilities by their topic than by Component
name.

## Component Design

Components are the core of what makes `React` great! In `Next.js` it might be confusing that the
components are not tightly bound to the pages themselves. However, the distinction between a Component
and a Page allows us to separate our concerns and allow us to quickly debug and even create new pages.

### Adding a new component

All React component modules are to be created under the `components/` directory, with a filename `<ComponentName>.tsx`.

> If the component you are trying to create requires a little more complexity, it might be a good idea to create subcomponents

To accomplish this:
- Create a directory within `components/` labeled `ComponentName/`
- Turn `<ComponentName>.tsx` into `ComponentName/index.tsx`
  - All your previous imports will still function properly
  ```ts
  import ComponentName from '../components/ComponentName';
  ```
- Create all the sub-components you need in `ComponentName/` to complete development

Suppose you are making a new component for a header named `Header` which consists of a logo and a series of navigation links, which you want to use as sub-components named `Logo` and `NavLink`, respectively. In such a case, your file tree may look something like this:
```
components
├── Header
│   ├── index.tsx
│   ├── Logo.tsx
│   └── NavLinks.tsx
├── Layout.tsx
└── ...
```

### Writing a component module

For this website, we are using [*functional components*](https://reactjs.org/docs/components-and-props.html) and **not** class-based components.
This is because functional components allow us to use [React Hooks](https://reactjs.org/docs/hooks-intro.html), which allow greater flexibility and control over having to rely on rigid lifecycle methods such as `componentDidUpdate` and `componentWillMount`.

* Component properties must have a corresponding `interface` with clearly-defined field types
* This `interface` must appear directly above the exported compoennt.
* The name of this `interface` must be `<ComponentName>Props`.
* Try to avoid optional properties (using the syntax `<propertyName>?: <type>`)

Refrain from adding extra functions to a component module outside of the component function itself.
If you want to include simple, brief functions within a component module, add them to the component function as named lambda expressions, like so:
```ts
const someFunction = (arg1: <type>, arg2: <type>, ...): <return type> => {
  ...
};
```
This is primarily useful for functions that use JSX code.

For larger, more complex functions that don't use JSX code, create a utility module!
See [**Hooks and Utilites**](#styling) below for more information.

The general structure of a component module:

```ts
import React from 'react';

interface ComponentNameProps {
  someField: number;
  anotherField?: string;
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

Styles for a component should be placed in `styles/`. The stylesheet's file name, like the component's name, should be `<ComponentName>.module.scss`.

> If your component consists of multiple sub-components, you must use **one single** stylesheet for all these sub-components and the top-level component. In this case, the stylesheet's file name will match the name of the top-level component.

As mentioned in [**General Syntax and Format**](#general-syntax-and-format) above, class and 
identifier names must be in camelCase. All rules within a style must end with a semicolon.

> Do **not** use `!important`.

Nine times out of ten, any problems solved by adding this to a rule can be solved by rearranging some 
code. If you absolutely need to use `!important`, make sure you include a comment in your PR 
explaining why.

### Module Based Styling

Next.js enforces module based styling. This means your files must be named with the `.module.scss` 
file extension AND they must be imported as the following:

```tsx
import styles from '../styles/[MyComponent].module.scss';

<div className={styles.container}/>
```

Module-based styling puts your styles in a local scope. Imagine if you had two different css files
where you declared the CSS class `.container`. Collisions are inevitable, especially when working
with team members on a big project. CSS modules lets you program without having to worry about 
collisions!

To read more about CSS Modules check out this [doc](https://github.com/css-modules/css-modules).

## Hooks and Utilities

If you make any functions or interfaces which are not directly linked to or are too large to be a lambda function member of a specific component, such as a utility function for performing a useful calculation or a custom React Hook, these must go inside the `utils/` directory.
To maintain structure, we recommend you adhere to the following file organization guidelines:

* Complex functions used in a specific component should go inside a file named `<utilityName>.ts`.
* General, non-specific utilites should go inside a file named `misc.ts`.
* Custom React Hooks should go inside a file named `hooks.ts`.

## Assets

All assets must go inside the `public/` directory.

> As much as possible, use `.svg` files if you can.

To use an asset inside a component, you must import it like so (file path is just an example):
```typescript
import <AssetName> from '../public/<asset>.<ext>';
```

Remember from [**General Syntax and Format**](#general-syntax-and-format) above that imported asset names must be in PascalCase.
