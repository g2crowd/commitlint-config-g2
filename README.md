# commitlint-config-g2
Common Commitlint Configuration for G2 Repositories.

The purpose of this package is to help bring [G2](https://www.g2.com/)'s common git commit standards to all repositories by installing hooks and checks that execute during the commit time and help the developer properly format the commit message as well as ensure that the code being committed passes the standard checks.

This package is intended to be used in tandem with [husky](https://github.com/typicode/husky) and [commitlint](https://commitlint.js.org/). Husky is responsible for installing and executing git commit hooks that make use of commitlint which, in turn, uses the G2-specific configuration provided by this package.

## Preparing a repository to use husky and commitlint

If your repository is not a [node](https://nodejs.org/) repository and does not have a `package.json` file at the top level, you will need to create one so you can install this package, as well as husky and commitlint and all of the related dependencies.

### Preparing the node-friendly environment

You can skip this section if your repo already supports node and has a `package.json` file in it.

The preferred way of installing node and managing its versions at G2 is via [ASDF](https://asdf-vm.com/). Please refer to the ASDF website for instructions on how to best install ASDF and keep it up to date on your platform.

Once ASDF is installed, you will need to install its [node plugin](https://github.com/asdf-vm/asdf-nodejs) by following the instructions from the linked page. Then, install a recent version of node by issuing the `asdf install nodejs <version>` command. The latest node version currently available is usually a safe choice; you can get the list of all node versions available via ASDF by issuing the `asdf list-all nodejs` command.

Finally, set the installed node version as the local node version for use by your repo, by `cd`ing into the directory where your repo is cloned, and issuing the `asdf local nodejs <version>` command.

You may also need to install [yarn](https://yarnpkg.com/) package manager which is the preferred way of managing [npm](https://www.npmjs.com/) packages at G2. There is an [ASDF plugin for yarn](https://github.com/twuni/asdf-yarn) as well.

Another useful tool that is widely adopted by G2 is [direnv](https://direnv.net/). It can be used for adding the local `node_modules/.bin` path to `$PATH` so that all of the local executables installed by various NPM packages become visible. Once you have direnv installed by following the instructions at the website linked above, you can add the `node_modules/.bin` path by creating (or editing an existing) `.envrc` file in your repo's root directory and adding the following line to it:
```
path_add PATH node_modules/.bin
```
(you will need to issue the `direnv allow` command afterwards to make direnv pick up the changes and put them into effect).

Since we will be installing node modules into the repo's `node_modules` directory (that may not exist yet but will be created during the next steps), it is a good idea to add the `/node_modules` path into your `.gitignore` so that the installed thirdparty modules don't end up accidentally checked in to your repo.

Now it is the time to create a `package.json` file. One easy way to do it is by issuing the `npm init` command which will ask a few simple questions and will create a new `package.json` file in the end. If you don't know how to answer some of the questions (e.g., author, license, etc.), find an existing G2 repo that is node-enabled and look at the values in its `package.json` as a reference.

### Installing and configuring packages

We will install a few node packages in this section to enable git hooks and automated linting. Please note that all of the packages will be installed as `development` dependencies by supplying the `--dev` flag to the `yarn add` commands.

First, install this package:
```
yarn add --dev @g2crowd/commitlint-config-g2
```

Now create a file at the root of your repo named `commitlint.config.js` with the following content:
```
module.exports = {
  extends: ['@g2crowd/commitlint-config-g2']
};
```

This will make commitlint use G2-specific configuration.

You will also need to install a few commitlint-related packages as well as [commitizen](https://commitizen-tools.github.io/commitizen/):
```
yarn add --dev @commitlint/cli @commitlint/cz-commitlint commitizen
```

Commitizen provides a command line interface for enforcing commit rules and it works well in conjunction with commitlint.
Once it is installed, a relevant `config` section needs to be added to `package.json` as follows:
```
  "config": {
    "commitizen": {
      "path": "@commitlint/cz-commitlint"
    }
  }
```
The `config` section should be at the top level of `package.json` (alongside `name`, `description`, etc.). Don't forget to insert a comma after it if it is not the last key in your `package.json`.

With these changes, you should now able to use the `git cz` command as a replacement for `git commit`. If you've followed all the steps above and configured everything properly, you will have an interactive commitizen session that will prompt you to choose the type of change, enter a description, reference any JIRA tickets affected by the change, and so on.

Another tool that needs to be installed to enable the new git hooks is husky:
```
yarn add --dev husky
```

Once the husky package is added, you will first need to initialize it by issuing the `install` command:
```
husky install
```
(if your shell cannot find the `husky` executable at this point, make sure you followed the direnv instructions above).

Now let's create a few husky hooks.

The first one will ensure that commit messages are formatted correctly and will abort any commit with the message that doesn't follow the convention:

```
husky add .husky/commit-msg 'commitlint --edit $1'
```

If you want your code staged for committing lint-checked before the commit goes through, you can install [lint-staged](https://github.com/okonet/lint-staged) together with an additional husky hook to invoke it:

```
yarn add --dev lint-staged
husky add .husky/pre-commit 'lint-staged'
```

Lint-staged requires a configuration file named `.lintstagedrc.yml` that needs to be placed in the root directory of your repo. The rules inside that file are language-specific, you can find examples for various languages below in the respective language-specific sections of this readme. To support better linting, various additional language-specific packages may need to be installed.

Husky git hooks can do much more than just linting of code and enforcing the format of commit messages. For example, G2's [ue](https://github.com/g2crowd/ue) repo contains examples of using a `pre-push` hook to enforce branch naming conventions and ensure that no direct pushes are done to the `main` branch. Refer to https://github.com/g2crowd/ue/blob/main/.husky/pre-push for more information on that.

### Rails-specific lint-staged configuration

Modern Rails versions rely on node for serving frontend assets so the example `.lintstagedrc.yml` configuration file below contains rules for both Ruby and Javascript code:

```
'*.js':
  - eslint
  - prettier --write

'*.rb':
  - rubocop --color

'*.scss':
  - stylelint

'*.slim':
  - slim-lint

'_*.{erb,slim}':
  - partial-instance-variables

'**/vendor_admin/**/*.{erb,slim}':
  - myg2-instance-variables

'*.svg':
  - svgo
```

This example relies on two ruby gems present in the project's `Gemfile` as part of the `development` group: `rubocop-g2` and `slim_lint`.

### Other language-specific lint-staged configurations.

Please contribute here after setting up your projects.
