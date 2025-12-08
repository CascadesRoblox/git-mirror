import { z } from "zod";

export const GitInstanceOptionsSchema = z.object({
    token: z.string().optional(),
    host: z.string().default("github.com").optional(),
    autoUpdate: z.boolean().optional(),
    updateInterval: z.number().default(60_000).optional(),
    overrideExistingFolders: z.boolean().optional(),
    saveBackups: z.boolean().optional(),
    deleteOnProcessExit: z.boolean().optional()
})
export type GitInstanceOptions = z.infer<typeof GitInstanceOptionsSchema>;

export const RepoInfoSchema = z.object({
    owner: z.string(),
    name: z.string(),
    branch: z.string().default("main").optional(),
    destination: z.string(),
    folder: z.string().optional(),
    isPrivate: z.boolean().optional()
})
export type RepoInfo = z.infer<typeof RepoInfoSchema>;