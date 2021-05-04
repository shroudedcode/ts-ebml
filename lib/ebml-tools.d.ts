/// <reference types="node" />
export declare function readVint(buffer: Buffer, start: number): {
    length: number;
    value: number;
} | null;
export declare function writeVint(value: number): Buffer;
