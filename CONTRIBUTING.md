# Contributing Guidelines

Thanks for your interest in contributing to the Creative Labs website, aka Sunshine! ❤️

These guidelines describe how to set up your environment and submit your own contributions! Please read it 
carefully and, if there is anything that isn't up-to-date, feel free to submit a PR with your corrections 🙃

- [Getting Started](#Getting-Started)
- [Contribution Workflow](#Contribution-Workflow)
  - [Step 1: Open an Issue](#Step-1:-Open-an-Issue)
  - [Step 2: Design](#Step-2:-Design)
  - [Step 3: Beep Boop](#Step-3:-Beep-Boop)
  - [Step 4: Commit](#Step-4:-Commit)
  - [Step 5: Pull Request](#Step-5:-Pull-Request)
  - [Step 6: Merge](#Step-6:-Merge)
- [Tools](#Tools)
  - [ESLint](#ESLint)
  - [StyleLint](#StyleLint)
- [Pipeline](#Pipeline)
  - [Mergify](#Mergify)
  - [Netlify](#Netlify)

## Getting Started

We use [`yarn`](https://classic.yarnpkg.com/en/docs/install#mac-stable) as our package manager.

The basic commands to get this repository and start are:

```
$ git clone https://github.com/UCLA-Creative-Labs/sunshine.git
$ cd sunshine
$ yarn install
```

To expedite local development, run locally:

```
$ yarn start
```

To test the production build, run:

```
$ yarn build
$ cd dist
$ python3 -m http.server
```

## Contribution Workflow

The following should be the general workflow of your pull requests. We have protected `master` so no one can 
push directly to master. We also use [`mergify`](https://mergify.io/) to automate our merging process. No one 
should be merging directly to `master`. Check out our [`.mergify.yml`](.mergify.yml) file for our conditions.

### Step 1: Open an Issue

If there isn't an existing issue, open an issue describing what you intend to contribute. Communicating visual and 
code design proactively leads to less overhead for everyone and allows for collaboration. 

### Step 2: Design

Always reference a visual design when developing and make sure to link that design in the discussion. In terms of 
code design, make sure to read through the [design guidelines](DESIGN_GUIDELINES.md) for general patterns we follow. 

### Step 3: Beep Boop

Beep boop. Beep boop. Here are some general guidelines:

- In general, follow the style of code around you
- Coding Style (Abridged)
  - 2 space indentation
  - 120 characters width
  - files and React components must follow PascalCasing (i.e. FooBar.tsx)
  - objects and variables must follow camelCasing (i.e. fooBar )
- Try to maintain a single bug or feature per PR. It's a okay to prune as you go, but bear in mind that code
  code reviews start to get fatigueing after 5 files.

We use [eslint](.eslintrc.js) for `.ts` and `.tsx` files and [stylelint](.stylelintrc.json) for `.css` and `.scss` files. 
Make sure your changes follow the linter rules as they can not be merged if thats the case.
If there are any improvements that you wish to make to our linters, feel free to make an issue and PR to suggest changes!


### Step 4: Commit 

Create a commit with your changes.

- Commit titles should be lowercased and follow [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/#specification)
- Beginning of commit titles ([Abridged](.github/semantic.yml))  
  - `feat: `
  - `fix: `
  - `refactor: `
  - `chore: `
- Commit messages should describe the motivation or design decision you made. It's always good to keep the code 
  reviewer in mind when writing out the commit message.
- Commit message should link to the issue(s) are fixed: `fixes #<issue>` or `closes #<issue>`.
- Give shoutouts to collaborators 🥳

### Step 5: Pull Request

- Push to a GitHub fork or to a branch (naming convention: <user>/<feature-bug-name>)
- All PRs are checked against a linter, netlify deploy, and conventional commits
- Submit a Pull Request on GitHub. The maintainers will assign a reviewer.
- Iterate until you get at least one “Approve”. When iterating, push new commits to the same branch. 
- Most PR's will be squashed when you merge to master. If you want to disable squashing, request to add the label `pr/no-squash`

### Step 6: Merge

We have a pipeline to ensure that our production code will always build.

- Semantic Pull Request will check the PR title to make sure it follows conventional commits
- Netlify will build a preview of the website. Make sure to check it out and confirm your changes.
- Netfliy will also check the headers, redirects, mixed content etc.
- We require at least 1 approver

## Tools

We recommend using Visual Studio Code to work on `Sunshine`. Be sure to install the [eslint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) as we have strict linting rules that will prevent your code from merging. The combination of VSCode and this extension will allow you to automatically fix linter issues with a `Ctrl-` when hovering linter issues.

We use both [ESLint](https://eslint.org/) and [StyleLint](https://stylelint.io/) for two different functions that will be explained below.

### ESLint

We use ESLint for our TypeScript files (`**/*.ts` and `**/*.tsx`). ESLint has really fantastic functionality for linting JavaScript code so naturally we picked it as our linter for our code.

Notable Linter Rules:
- no-console: dont litter 🗑
- single quotes: uniformity is key 
- 2 space indentation: we like skinny, readable code
- max line length 120: ^ 👍

See our documented [`.eslintrc.js`](.eslintrc.js) file for more info.

**Note:** We dont run `yarn lint` on `build` or `start`. This means you can avoid our linting rules during development (console logging 👀), and clean up your code when you make a pull request.

### StyleLint

We use StyleLint for our styled components (`**/*.css` and `**/*.scss`). Our linter rules for our style files are generic at the moment. We use the [standard configuration](https://github.com/stylelint/stylelint-config-standard), however if there are any edits that you think should be made, feel free to make a PR for it!

See our [`.stylelintrc.json`](.stylelintrc.json) file for more info.

## Pipeline

`Sunshine` is configured to use a pipeline to merge changes to `master`. Humans aren't perfect, so we abstracted all our merging to a pipeline managed by a bot, [Mergify](https://mergify.io/). 

### Mergify

Mergify is a great tool for managing production code. The idea is to rely on maintainers to validate and approve pull requests and let Mergify handle production. This way, no one directly touches `master`. 

Key Aspects:
- Mergify checks to see if the title follows conventional commits
- Mergify, by default, will squash merge changes onto master
- Mergify automatically merges Dependatbots PRs
- Mergify automatically dismisses stale reviews

See our [`.mergify.yml`](.mergify.yml) file for more info.

### Netlify

We use [Netlify](https://www.netlify.com/) to host our website. Netlify has a really cool feature that let's you see a preview of the your changes. Make sure to reference the feature or bug fixes in your commit description so that reviewers can verify and test your changes.

Follow this [blog post](https://www.netlify.com/blog/2016/07/20/introducing-deploy-previews-in-netlify/) for more information. 