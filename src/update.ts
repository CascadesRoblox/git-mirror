import { simpleGit } from "simple-git";
import type { SimpleGit } from "simple-git";
import type { GitInstance } from "./index.js";

async function checkForUpdates(repoUrl: string, repoPath: string) {
    const git: SimpleGit = simpleGit(repoPath);

    try {
        const remoteInfo = await git.listRemote([repoUrl, "--heads"]);
        const localInfo = await git.revparse(["HEAD"]);

        return !remoteInfo.includes(localInfo.trim());
    } catch (e) {
        throw new Error(`Failed to check for updates: ${(e as Error).message}`);
    }
}

export async function startUpdating(instance: GitInstance, repoUrl: string, repoPath: string, interval: number) {
    console.log(`Starting auto-update for repository at ${repoPath}`);
    setInterval(async () => {
        if (!instance.getRepos().includes(repoPath)) return;

        const hasUpdates = await checkForUpdates(repoUrl, repoPath);

        if (hasUpdates) {
            await update(repoPath);
        }
    }, interval);
}

export async function update(repoPath: string) {
    const git: SimpleGit = simpleGit(repoPath);

    try {
        await git.pull((_, data) => {
            if (data.files.length > 0) {
                console.log(`Repository at ${repoPath} updated with ${data.files.length} file(s) changed`);
            }
        })
    } catch (e) {
        throw new Error(`Failed to pull updates: ${(e as Error).message}`);
    }
}