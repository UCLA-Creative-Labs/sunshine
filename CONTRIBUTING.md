# Contributing Guidelines

Thanks for thinking about contributing to the Creative Labs website, aka Sunshine! ❤️

These guidelines describe how to set up your environment and submit your own contributions! Please read it 
carefully and, if there is anything that isn't up-to-date, feel free to submit a PR with your corrections 🙃

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
$ yarn install
```

To test the production build, run:

```
$ yarn build
$ cd dist
$ python3 -m http.server
```

## Pull Requests

The following should be the general workflow of your pull requests. We have protected `master` so no one can 
push directly to master. We also use [`mergify`](https://mergify.io/) to automate our merging process. No one 
should be merging directly to `master`. Check out our [`.mergify.yml` file](.mergify.yml) for our conditions.

### Step 1: Open an Issue

If there isn't an existing issue, open an issue describing what you intend to contribute. Communicating visual and 
code design proactively leads to less overhead for everyone and allows for collaboration. 

### Step 2: Design

Always reference a visual design when developing and make sure to link that design in the discussion. In terms of 
code design, make sure to read through the [design guidelines](DESIGN_GUIDELINES.md) for general patterns we follow. 

### Step 3: Coding Wizardry

Beep boop. Beep boop. Here are some general guidelines:

- In general, follow the style of code around you
- Coding Style (Abridged)
  - 2 space indentation
  - 120 characters width
  - files should be lowercased and kebab cased (i.e. foo-bar.ts)
  - objects and variables should be camel cased (i.e. fooBar )
- Try to maintain a single bug or feature per PR. It's a okay to prune as you go, but bear in mind that code
  code reviews start to get fatigueing after 5 files. 

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
- Submit a Pull Request on GitHub. The maintainers will assign a reviewer.
- Iterate until you get at least one “Approve”. When iterating, push new commits to the same branch. 
- Most PR's will be squashed when you merge to master. If you want to disable squashing, request to add the label `pr/no-squash`

### Step 6: Merge

We have a pipeline to ensure that our production code will always build.

- Semantic Pull Request will check the PR title to make sure it follows conventional commits
- Netlify will build a preview of the website. Make sure to check it out and confirm your changes.
- Netfliy will also check the headers, redirects, mixed content etc.
- We require at least 1 approver