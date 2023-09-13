## API Report File for "@fluid-internal/client-utils"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { EventEmitter } from 'events';
import { IDisposable } from '@fluidframework/core-interfaces';
import { IEvent } from '@fluidframework/core-interfaces';
import { IEventProvider } from '@fluidframework/core-interfaces';
import { IEventTransformer } from '@fluidframework/core-interfaces';
import { TransformedEvent } from '@fluidframework/core-interfaces';

// @internal
export class Buffer extends Uint8Array {
    static from(value: unknown, encodingOrOffset?: unknown, length?: unknown): IsoBuffer;
    // (undocumented)
    static isBuffer(obj: unknown): obj is Buffer;
    // (undocumented)
    toString(encoding?: string): string;
}

// @internal
export const bufferToString: (blob: ArrayBufferLike, encoding: string) => string;

// @internal
export type EventEmitterEventType = EventEmitter extends {
    on(event: infer E, listener: any): any;
} ? E : never;

// @internal
export class EventForwarder<TEvent = IEvent> extends TypedEventEmitter<TEvent> implements IDisposable {
    constructor(source?: EventEmitter | IEventProvider<TEvent & IEvent>);
    // (undocumented)
    dispose(): void;
    // (undocumented)
    get disposed(): boolean;
    // (undocumented)
    protected forwardEvent(source: EventEmitter | IEventProvider<TEvent & IEvent>, ...events: string[]): void;
    // (undocumented)
    protected static isEmitterEvent(event: string): boolean;
    // (undocumented)
    protected unforwardEvent(source: EventEmitter | IEventProvider<TEvent & IEvent>, ...events: string[]): void;
}

// @internal
export const fromBase64ToUtf8: (input: string) => string;

// @internal
export const fromUtf8ToBase64: (input: string) => string;

// @internal
export function gitHashFile(file: IsoBuffer): Promise<string>;

// @internal
export function hashFile(file: IsoBuffer, algorithm?: "SHA-1" | "SHA-256", hashEncoding?: "hex" | "base64"): Promise<string>;

// @internal (undocumented)
export const IsoBuffer: typeof Buffer;

// @internal (undocumented)
export type IsoBuffer = Buffer;

// @internal
export type IsomorphicPerformance = Partial<Performance> & Pick<Performance, "clearMarks" | "mark" | "measure" | "now">;

// @internal
export interface ITraceEvent {
    readonly duration: number;
    readonly tick: number;
    readonly totalTimeElapsed: number;
}

// @internal (undocumented)
const performance_2: IsomorphicPerformance;
export { performance_2 as performance }

// @internal
export function stringToBuffer(input: string, encoding: string): ArrayBufferLike;

// @internal
export const toUtf8: (input: string, encoding: string) => string;

// @internal
export class Trace {
    protected constructor(startTick: number);
    // (undocumented)
    protected lastTick: number;
    // (undocumented)
    static start(): Trace;
    // (undocumented)
    readonly startTick: number;
    // (undocumented)
    trace(): ITraceEvent;
}

// @internal
export class TypedEventEmitter<TEvent> extends EventEmitter implements IEventProvider<TEvent & IEvent> {
    constructor();
    // (undocumented)
    readonly addListener: TypedEventTransform<this, TEvent>;
    // (undocumented)
    readonly off: TypedEventTransform<this, TEvent>;
    // (undocumented)
    readonly on: TypedEventTransform<this, TEvent>;
    // (undocumented)
    readonly once: TypedEventTransform<this, TEvent>;
    // (undocumented)
    readonly prependListener: TypedEventTransform<this, TEvent>;
    // (undocumented)
    readonly prependOnceListener: TypedEventTransform<this, TEvent>;
    // (undocumented)
    readonly removeListener: TypedEventTransform<this, TEvent>;
}

// @internal (undocumented)
export type TypedEventTransform<TThis, TEvent> = TransformedEvent<TThis, "newListener" | "removeListener", Parameters<(event: string, listener: (...args: any[]) => void) => void>> & IEventTransformer<TThis, TEvent & IEvent> & TransformedEvent<TThis, EventEmitterEventType, any[]>;

// @internal
export function Uint8ArrayToArrayBuffer(array: Uint8Array): ArrayBuffer;

// @internal
export function Uint8ArrayToString(arr: Uint8Array, encoding?: string): string;

// (No @packageDocumentation comment for this package)

```