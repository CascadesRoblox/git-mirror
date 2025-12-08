import fs from "fs";
import path from "path";
import { simpleGit } from "simple-git";
import type { SimpleGit } from "simple-git";
import { update, startUpdating } from "./update.js";
import { GitInstanceOptionsSchema, RepoInfoSchema } from "./types.js";
import type { GitInstanceOptions, RepoInfo } from "./types.js";

const git: SimpleGit = simpleGit();

export class GitInstance {
    constructor(options: GitInstanceOptions) {
        try {
            this.options = GitInstanceOptionsSchema.parse(options);
        } catch (e) {
            throw new Error(`Invalid GitInstance options: ${(e as Error).message}`);
        }

        process.on("SIGINT", () => {
            if (!this.options.deleteOnProcessExit) return;
            
            this.repos.forEach(repo => {
                fs.rmSync(repo, { recursive: true, force: true });
            })

            process.exit(0);
        })

        process.on("exit", () => {
            process.emit("SIGINT");
        })
    }

    private options: GitInstanceOptions;

    private repos: string[] = [];

    public getOptions() {
        return this.options;
    }

    public setOptions(options: GitInstanceOptions) {
        try {
            this.options = GitInstanceOptionsSchema.parse(options);
        } catch (e) {
            throw new Error(`Invalid GitInstance options: ${(e as Error).message}`);
        }
    }

    public updateOptions(partialOptions: Partial<GitInstanceOptions>) {
        this.options = { ...this.options, ...GitInstanceOptionsSchema.partial().parse(partialOptions) };

        return this.options;
    }

    public getRepos() {
        return this.repos;
    }

    public getToken() {
        return this.options.token;
    }

    public setToken(token: string) {
        if (typeof token != "string") {
            throw new Error("Token must be a string");
        }

        this.options.token = token;
    }

    public async mirrorRepo(repoInfo: RepoInfo) {
        try {
            repoInfo = RepoInfoSchema.parse(repoInfo);
        } catch (e) {
            throw new Error(`Invalid RepoInfo: ${(e as Error).message}`);
        }

        if (repoInfo.isPrivate && !this.options.token) {
            throw new Error("Token is required for private repositories");
        }

        const repoUrl = repoInfo.isPrivate ? `https://${this.options.token}@${this.options.host}/${repoInfo.owner}/${repoInfo.name}.git` : `https://${this.options.host}/${repoInfo.owner}/${repoInfo.name}.git`;
        let backedUp = false;

        try {
            if (this.options.overrideExistingFolders && this.options.saveBackups && fs.existsSync(path.join(repoInfo.destination, repoInfo.folder || repoInfo.name))) {
                backedUp = true;
                fs.cpSync(path.join(repoInfo.destination, repoInfo.folder || repoInfo.name), path.join(repoInfo.destination, (repoInfo.folder || repoInfo.name) + ".backup"), { recursive: true });
                fs.rmSync(path.join(repoInfo.destination, repoInfo.folder || repoInfo.name), { recursive: true, force: true });
            }

            await git.clone(repoUrl, path.join(repoInfo.destination, repoInfo.folder || repoInfo.name), ["--branch", repoInfo.branch!]);
            this.repos.push(path.join(repoInfo.destination, repoInfo.folder || repoInfo.name));

            if (backedUp) {
                fs.rmSync(path.join(repoInfo.destination, (repoInfo.folder || repoInfo.name) + ".backup"), { recursive: true, force: true });
            }
        } catch (e) {
            if (backedUp) {
                fs.cpSync(path.join(repoInfo.destination, (repoInfo.folder || repoInfo.name) + ".backup"), path.join(repoInfo.destination, repoInfo.folder || repoInfo.name), { recursive: true });
                fs.rmSync(path.join(repoInfo.destination, (repoInfo.folder || repoInfo.name) + ".backup"), { recursive: true, force: true });
            }

            throw new Error(`Failed to clone repository: ${(e as Error).message}`);
        }

        if (this.options.autoUpdate) {
            startUpdating(this, repoUrl, path.join(repoInfo.destination, repoInfo.folder || repoInfo.name), this.options.updateInterval!);
        }

        return {
            ...repoInfo,
            update: async () => await update(path.join(repoInfo.destination, repoInfo.folder || repoInfo.name)),
            remove: () => {
                fs.rmSync(path.join(repoInfo.destination, repoInfo.folder || repoInfo.name), { recursive: true, force: true });
                this.repos = this.repos.filter(r => r != path.join(repoInfo.destination, repoInfo.folder || repoInfo.name));
            }
        }
    }
}

export type * from "./types.js";