# Git Mirror

NPM package for importing public and private repos directly in Node.js.

## Key Features

- Importing private repos
- Auto update when changes are made to repos
- Save backups incase of failure
- Delete repo folders on process exit
- Customizable

## Installing

```console
$ npm i git-mirror
```

**Please ensure you have Git installed on your system before using.**

## API

### `new GitInstance(options: GitInstanceOptions)`

Creates a new GitInstance.

**Parameters:**
- `options` (GitInstanceOptions)
    - `token` (string): Personal access token to access private repos.
    - `host` (string): Host URL where the repo is located. (default `github.com`)
    - `autoUpdate` (boolean): Enable auto-update on changes (default: `true`)
    - `updateInterval` (number: milliseconds): How long will it wait before checking for changes (default: `60_000 // One minute` )
    - `overrideExistingFolders` (boolean): Override folders that interfere with cloning a repo
    - `saveBackups` (boolean): Will it save backups of existing folders incase of failure when cloning a repo (`overrideExistingFolders` required to use).
    - `deleteOnProcessExit` (boolean): Will all repos you mirrored be delete upon process exit (recommend to save space)

**Example:**
```javascript
const { GitInstance } = require('git-mirror');

const gitInstance = new GitInstance({
    token: process.env.TOKEN, // Keep this secret, see "Making a Token" for instructions
    host: "github.com",
    autoUpdate: true,
    updateInterval: 60_000, // 1 minute, keep this over 30 seconds
    overrideExistingFolders: true,
    saveBackups: true, // Recommended
    deleteOnProcessExit: true // Saves space
})
```

### Methods

#### `.getOptions(): GitInstanceOptions`
Returns options.

#### `.setOptions(options: GitInstanceOptions): GitInstanceOptions`
Sets options to provided options.

#### `.updateOptions(partialOptions: Partial<GitInstanceOptions>): GitInstanceOptions`
Updates options.

#### `.getRepos(): string[]`
Returns repos.

#### `.getToken(): string | undefined`
Returns token.

#### `.setToken(token: string)`
Sets token to provided token.

#### `async .mirrorRepo(RepoInfo): { ...RepoInfo, async update(), remove() }` 
Clones repo and returns repo info along with update and remove functions.

#### `async mirrorRepo().update()`
Updates repo with most recent version.

#### `mirrorRepo().remove()`
Removes repo folder and stops auto updating.

## Making a Token

1. Start by [Creating a Classic Token](https://github.com/settings/tokens/new) and set the note to something along the lines of **"git-mirror Token."**
2. For hobby projects, set the expiration date to a set amount, otherwise it is recommended to set it to never expire (not as safe if it gets leaked).
3. Make sure you click the following permissions: `repos`, `admin:org` (required for organization repos).
4. Press create and copy the token, you will not be able to access it again.
5. In a `.env` file, write `TOKEN={your-token}`.
6. Use a package like `dotenv` to add the token to your code and access it with `process.env.TOKEN`.
### OR
Go to our [Website](https://cascadesroblox.github.io/git-mirror/token) and follow the instructions there.
