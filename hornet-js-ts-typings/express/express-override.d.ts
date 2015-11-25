// Type definitions for other methods
// Project: Hornet 5

/// <reference path="./express.d.ts" />

declare module Express {
    export interface Request {
        getSession?: () => any;
    }
}