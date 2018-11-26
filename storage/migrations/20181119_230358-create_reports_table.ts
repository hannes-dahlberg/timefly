import { storageInstance } from 'artoo';

export let up: () => Promise<void> = () => {
    return new Promise((resolve, reject) => {
        storageInstance.execute(`
            CREATE TABLE [reports] (
                [id] INTEGER PRIMARY KEY,
                [customer] VARCHAR(255),
                [project] VARCHAR(255),
                []
                [created_at] DATETIME,
                [updated_at] DATETIME
            );
            CREATE TABLE [customers] (
                [id] INTEGER PRIMARY KEY,
                
            )
        `).then(() => resolve()).catch((error: Error) => reject(error));
    });
}

export let down: () => Promise<void> = () => {
    return new Promise((resolve, reject) => {
        storageInstance.execute(`
        DROP TABLE IF EXISTS [reports];
        `).then(() => resolve()).catch((error: Error) => reject(error));
    });
}