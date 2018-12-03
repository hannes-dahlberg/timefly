import { storageInstance, Promise, PromiseResolve, PromiseReject } from 'artoo';

export let up: () => Promise<void> = () => {
    return new Promise<void>((resolve: PromiseResolve<void>, reject: PromiseReject) => {
        storageInstance.execute(`
            CREATE TABLE [reports] (
                [id] INTEGER PRIMARY KEY,
                [user_id] INT,
                [project_id] INT,
                [start] DATETIME,
                [end] DATETIME,
                [comment] TEXT,
                [created_at] DATETIME,
                [updated_at] DATETIME
            );
            CREATE TABLE [projects] (
                [id] INTEGER PRIMARY KEY,
                [name] VARCHAR(255),
                [comment] TEXT,
                [client_id] INT,
                [created_at] DATETIME,
                [updated_at] DATETIME
            );
            CREATE TABLE [tasks] (
                [id] INTEGER PRIMARY KEY,
                [name] VARCHAR(255),
                [project_id] INT,
                [created_at] DATETIME,
                [updated_at] DATETIME
            );
            CREATE TABLE [projects_to_groups] (
                [id] INTEGER PRIMARY KEY,
                [project_id] INT,
                [group_id] INT
            );
            CREATE TABLE [clients] (
                [id] INTEGER PRIMARY KEY,
                [name] VARCHAR(255),
                [created_at] DATETIME,
                [update_at] DATETIME
            );
        `).then(() => resolve()).catch((error: Error) => reject(error));
    });
}

export let down: () => Promise<void> = () => {
    return new Promise<void>((resolve: PromiseResolve<void>, reject: PromiseReject) => {
        storageInstance.execute(`
        DROP TABLE IF EXISTS [reports];
        DROP TABLE IF EXISTS [projects];
        DROP TABLE IF EXISTS [tasks];
        DROP TABLE IF EXISTS [projects_to_groups];
        DROP TABLE IF EXISTS [customers];
        `).then(() => resolve()).catch((error: Error) => reject(error));
    });
}