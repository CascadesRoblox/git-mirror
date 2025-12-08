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
- `options` (object)
    - `repos` (array): Array of repository URLs to mirror
    - `baseDir` (string): Directory to store mirrored repos
    - `autoUpdate` (boolean): Enable auto-update on changes (default: `true`)
    - `backup` (boolean): Create backups before updates (default: `true`)
    - `interval` (number): Update check interval in milliseconds (default: `60000`)

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