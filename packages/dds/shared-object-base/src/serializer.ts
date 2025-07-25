/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import type { IFluidHandle } from "@fluidframework/core-interfaces";
import type {
	IFluidHandleContext,
	IFluidHandleInternal,
} from "@fluidframework/core-interfaces/internal";
import { assert, shallowCloneObject } from "@fluidframework/core-utils/internal";
import {
	encodeHandleForSerialization,
	generateHandleContextPath,
	isSerializedHandle,
	isFluidHandle,
	toFluidHandleInternal,
	type ISerializedHandle,
	RemoteFluidObjectHandle,
} from "@fluidframework/runtime-utils/internal";

import { isISharedObjectHandle, type ISharedObjectHandle } from "./handle.js";

/**
 * @legacy
 * @alpha
 */
export interface IFluidSerializer {
	/**
	 * Given a mostly-plain object that may have handle objects embedded within, will return a fully-plain object
	 * where any embedded IFluidHandles have been replaced with a serializable form.
	 *
	 * The original `input` object is not mutated.  This method will shallowly clones all objects in the path from
	 * the root to any replaced handles.  (If no handles are found, returns the original object.)
	 */
	encode(value: unknown, bind: IFluidHandle): unknown;

	/**
	 * Given a fully-jsonable object tree that may have encoded handle objects embedded within, will return an
	 * equivalent object tree where any encoded IFluidHandles have been replaced with their decoded form.
	 *
	 * The original `input` object is not mutated.  This method will shallowly clone all objects in the path from
	 * the root to any replaced handles.  (If no handles are found, returns the original object.)
	 *
	 * The decoded handles are implicitly bound to the handle context of this serializer.
	 */
	decode(input: unknown): unknown;

	/**
	 * Stringifies a given value. Converts any IFluidHandle to its stringified equivalent.
	 */
	stringify(value: unknown, bind: IFluidHandle): string;

	/**
	 * Parses the given JSON input string and returns the JavaScript object defined by it. Any Fluid
	 * handles will be realized as part of the parse
	 */
	parse(value: string): unknown;
}

/**
 * Data Store serializer implementation
 * @internal
 */
export class FluidSerializer implements IFluidSerializer {
	private readonly root: IFluidHandleContext;

	public constructor(private readonly context: IFluidHandleContext) {
		this.root = this.context;
		while (this.root.routeContext !== undefined) {
			this.root = this.root.routeContext;
		}
	}

	public get IFluidSerializer(): IFluidSerializer {
		return this;
	}

	/**
	 * Given a mostly-jsonable object tree that may have handle objects embedded within, will return a
	 * fully-jsonable object tree where any embedded IFluidHandles have been replaced with a serializable form.
	 *
	 * The original `input` object is not mutated.  This method will shallowly clone all objects in the path from
	 * the root to any replaced handles.  (If no handles are found, returns the original object.)
	 *
	 * Any unbound handles encountered are bound to the provided IFluidHandle.
	 */
	public encode(input: unknown, bind: IFluidHandleInternal): unknown {
		assert(isISharedObjectHandle(bind), 0xb8c /* bind must be an ISharedObjectHandle */);
		// If the given 'input' cannot contain handles, return it immediately.  Otherwise,
		// return the result of 'recursivelyReplace()'.
		// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
		return !!input && typeof input === "object"
			? this.recursivelyReplace(input, this.encodeValue.bind(this), bind)
			: input;
	}

	/**
	 * Given a fully-jsonable object tree that may have encoded handle objects embedded within, will return an
	 * equivalent object tree where any encoded IFluidHandles have been replaced with their decoded form.
	 *
	 * The original `input` object is not mutated.  This method will shallowly clone all objects in the path from
	 * the root to any replaced handles.  (If no handles are found, returns the original object.)
	 *
	 * The decoded handles are implicitly bound to the handle context of this serializer.
	 */
	public decode(input: unknown): unknown {
		// If the given 'input' cannot contain handles, return it immediately.  Otherwise,
		// return the result of 'recursivelyReplace()'.
		// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
		return !!input && typeof input === "object"
			? this.recursivelyReplace(input, this.decodeValue.bind(this))
			: input;
	}

	/**
	 * Serializes the input object into a JSON string.
	 * Any IFluidHandles in the object will be replaced with their serialized form before stringify,
	 * being bound to the given bind context in the process.
	 */
	public stringify(input: unknown, bind: IFluidHandle): string {
		assert(isISharedObjectHandle(bind), 0xb8d /* bind must be an ISharedObjectHandle */);
		return JSON.stringify(input, (key, value) => this.encodeValue(value, bind));
	}

	/**
	 * Parses the serialized data - context must match the context with which the JSON was stringified
	 */
	public parse(input: string): unknown {
		return JSON.parse(input, (key, value) => this.decodeValue(value));
	}

	/**
	 * If the given 'value' is an IFluidHandle, returns the encoded IFluidHandle.
	 * Otherwise returns the original 'value'.  Used by 'encode()' and 'stringify()'.
	 */
	protected encodeValue(value: unknown, bind?: ISharedObjectHandle): unknown {
		// If 'value' is an IFluidHandle return its encoded form.
		if (isFluidHandle(value)) {
			assert(bind !== undefined, 0xa93 /* Cannot encode a handle without a bind context */);
			return this.bindAndEncodeHandle(toFluidHandleInternal(value), bind);
		}
		return value;
	}

	/**
	 * If the given 'value' is an encoded IFluidHandle, returns the decoded IFluidHandle.
	 * Otherwise returns the original 'value'.  Used by 'decode()' and 'parse()'.
	 */
	protected decodeValue(value: unknown): unknown {
		// If 'value' is a serialized IFluidHandle return the deserialized result.
		if (isSerializedHandle(value)) {
			// Old documents may have handles with relative path in their summaries. Convert these to absolute
			// paths. This will ensure that future summaries will have absolute paths for these handles.
			const absolutePath = value.url.startsWith("/")
				? value.url
				: generateHandleContextPath(value.url, this.context);

			return new RemoteFluidObjectHandle(
				absolutePath,
				this.root,
				value.payloadPending === true,
			);
		} else {
			return value;
		}
	}

	/**
	 * Invoked for non-null objects to recursively replace references to IFluidHandles.
	 * Clones as-needed to avoid mutating the `input` object.  If no IFluidHandles are present,
	 * returns the original `input`.
	 */
	private recursivelyReplace<TContext = unknown>(
		input: object,
		replacer: (input: unknown, context?: TContext) => unknown,
		context?: TContext,
	): unknown {
		// Note: Caller is responsible for ensuring that `input` is defined / non-null.
		//       (Required for Object.keys() below.)

		// Execute the `replace` on the current input.  Note that Caller is responsible for ensuring that `input`
		// is a non-null object.
		const maybeReplaced = replacer(input, context);

		// If either input or the replaced result is a Fluid Handle, there is no need to descend further.
		// IFluidHandles are always leaves in the object graph, and the code below cannot deal with IFluidHandle's structure.
		if (isFluidHandle(input) || isFluidHandle(maybeReplaced)) {
			return maybeReplaced;
		}

		// Otherwise descend into the object graph looking for IFluidHandle instances.
		let clone: object | undefined;
		for (const key of Object.keys(input)) {
			const value: unknown = input[key];
			// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
			if (!!value && typeof value === "object") {
				// Note: Except for IFluidHandle, `input` must not contain circular references (as object must
				//       be JSON serializable.)  Therefore, guarding against infinite recursion here would only
				//       lead to a later error when attempting to stringify().
				const replaced = this.recursivelyReplace(value, replacer, context);

				// If the `replaced` object is different than the original `value` then the subgraph contained one
				// or more handles.  If this happens, we need to return a clone of the `input` object where the
				// current property is replaced by the `replaced` value.
				if (replaced !== value) {
					// Lazily create a shallow clone of the `input` object if we haven't done so already.
					clone ??= shallowCloneObject(input);

					// Overwrite the current property `key` in the clone with the `replaced` value.
					clone[key] = replaced;
				}
			}
		}
		return clone ?? input;
	}

	/**
	 * Encodes the given IFluidHandle into a JSON-serializable form,
	 * also binding it to another node to ensure it attaches at the right time.
	 * @param handle - The IFluidHandle to serialize.
	 * @param bind - The binding context for the handle (the handle will become attached whenever this context is attached).
	 * @returns The serialized handle.
	 */
	protected bindAndEncodeHandle(
		handle: IFluidHandleInternal,
		bind: ISharedObjectHandle,
	): ISerializedHandle {
		bind.bind(handle);
		return encodeHandleForSerialization(handle);
	}
}
