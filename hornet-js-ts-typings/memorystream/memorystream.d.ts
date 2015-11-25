/// <reference path='../node/node.d.ts' />

declare class MemoryStream implements NodeJS.WritableStream {
    constructor();

    addListener(event: string, listener: Function): NodeJS.EventEmitter;
    on(event: string, listener: Function): NodeJS.EventEmitter;
    once(event: string, listener: Function): NodeJS.EventEmitter;
    removeListener(event: string, listener: Function): NodeJS.EventEmitter;
    removeAllListeners(event?: string): NodeJS.EventEmitter;
    setMaxListeners(n: number): void;
    listeners(event: string): Function[];
    emit(event: string, ...args: any[]): boolean;

    writable: boolean;
    write(buffer: Buffer, cb?: Function): boolean;
    write(str: string, cb?: Function): boolean;
    write(str: string, encoding?: string, cb?: Function): boolean;
    end(): void;
    end(buffer: Buffer, cb?: Function): void;
    end(str: string, cb?: Function): void;
    end(str: string, encoding?: string, cb?: Function): void;
}

declare module "memorystream" {
    export = MemoryStream;
}