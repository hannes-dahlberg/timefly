import { container, StorageService } from "artos";
import * as Promise from "bluebird";

const storageService: StorageService = container.getService(StorageService);

export let up: () => Promise<void> = () => {
    return new Promise<void>((resolve, reject) => {
        storageService.execute(`
            CREATE TABLE [reports] (
                [id] INTEGER PRIMARY KEY,
                [user_id] INT,
                [task_id] INT,
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
            CREATE TABLE [clients_to_groups] (
                [id] INTEGER PRIMARY KEY,
                [client_id] INT,
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
};

export let down: () => Promise<void> = () => {
    return new Promise<void>((resolve, reject) => {
        storageService.execute(`
        DROP TABLE IF EXISTS [reports];
        DROP TABLE IF EXISTS [projects];
        DROP TABLE IF EXISTS [tasks];
        DROP TABLE IF EXISTS [clients_to_groups];
        DROP TABLE IF EXISTS [customers];
        `).then(() => resolve()).catch((error: Error) => reject(error));
    });
};
