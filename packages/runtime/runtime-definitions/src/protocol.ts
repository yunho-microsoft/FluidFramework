/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import type { TypedMessage } from "@fluidframework/core-interfaces/internal";
import type {
	ITree,
	ISignalMessage,
	ISequencedDocumentMessage,
	IDocumentStorageServicePolicies,
	IVersion,
	ISnapshotTree,
	ISnapshotFetchOptions,
	ISnapshot,
	FetchSource,
	ICreateBlobResponse,
	ISummaryTree,
	ISummaryHandle,
	ISummaryContext,
} from "@fluidframework/driver-definitions/internal";

/**
 * An envelope wraps the contents with the intended target
 * @legacy
 * @alpha
 */
export interface IEnvelope {
	/**
	 * The target for the envelope
	 */
	address: string;

	/**
	 * The contents of the envelope
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO (#28746): breaking change
	contents: any;
}

/**
 * Represents ISignalMessage with its type.
 * @legacy
 * @alpha
 */
export interface IInboundSignalMessage<TMessage extends TypedMessage = TypedMessage>
	extends ISignalMessage<TMessage> {
	readonly type: TMessage["type"];
}

/**
 * Message send by client attaching local data structure.
 * Contains snapshot of data structure which is the current state of this data structure.
 * @legacy
 * @alpha
 */
export interface IAttachMessage {
	/**
	 * The identifier for the object
	 */
	id: string;

	/**
	 * The type of object
	 */
	type: string;

	/**
	 * Initial snapshot of the document (contains ownership)
	 */
	snapshot: ITree;
}

/**
 * This type should be used when reading an incoming attach op,
 * but it should not be used when creating a new attach op.
 * Older versions of attach messages could have null snapshots,
 * so this gives correct typings for writing backward compatible code.
 * @legacy
 * @alpha
 */
export type InboundAttachMessage = Omit<IAttachMessage, "snapshot"> & {
	// eslint-disable-next-line @rushstack/no-new-null -- TODO: breaking change; protocol might even explicitly use null
	snapshot: IAttachMessage["snapshot"] | null;
};

/**
 * This is the message type that is used within the runtime when processing a sequenced message.
 * It is the same as ISequencedDocumentMessage, but without the contents and clientSequenceNumbers
 * which are sent separately. The contents are modified at multiple layers in the stack so having it
 * separate doesn't require packing and unpacking the entire message.
 * @alpha
 * @legacy
 */
export type ISequencedMessageEnvelope = Omit<
	ISequencedDocumentMessage,
	"contents" | "clientSequenceNumber"
>;

/**
 * These are the contents of a runtime message as it is processed throughout the stack.
 * @alpha
 * @legacy
 * @sealed
 */
export interface IRuntimeMessagesContent {
	/**
	 * The contents of the message, i.e., the payload
	 */
	readonly contents: unknown;
	/**
	 * The local metadata associated with the original message that was submitted
	 */
	readonly localOpMetadata: unknown;
	/**
	 * The client sequence number of the message
	 */
	readonly clientSequenceNumber: number;
}

/**
 * A collection of messages that are processed by the runtime.
 * @alpha
 * @legacy
 * @sealed
 */
export interface IRuntimeMessageCollection {
	/**
	 * The envelope for all the messages in the collection
	 */
	readonly envelope: ISequencedMessageEnvelope;
	/**
	 * Whether these messages were originally generated by the client processing them
	 */
	readonly local: boolean;
	/**
	 * The contents of the messages in the collection
	 */
	readonly messagesContent: readonly IRuntimeMessagesContent[];
}

/**
 * Interface to provide access to snapshot blobs to DataStore layer.
 *
 * @legacy
 * @alpha
 */
export interface IRuntimeStorageService {
	/**
	 * Reads the object with the given ID, returns content in arrayBufferLike
	 */
	readBlob(id: string): Promise<ArrayBufferLike>;

	/**
	 * Whether or not the object has been disposed.
	 * If true, the object should be considered invalid, and its other state should be disregarded.
	 *
	 * @deprecated - This API is deprecated and will be removed in a future release. No replacement is planned as
	 * it is unused in the DataStore layer.
	 */
	readonly disposed?: boolean;

	/**
	 * Dispose of the object and its resources.
	 * @param error - Optional error indicating the reason for the disposal, if the object was
	 * disposed as the result of an error.
	 *
	 * @deprecated - This API is deprecated and will be removed in a future release. No replacement is planned as
	 * it is unused in the DataStore layer.
	 */
	dispose?(error?: Error): void;

	/**
	 * @deprecated - This will be removed in a future release. No replacement is planned as
	 * it is unused in the DataStore layer.
	 */
	readonly policies?: IDocumentStorageServicePolicies | undefined;

	/**
	 * @deprecated - This will be removed in a future release. No replacement is planned as
	 * it is unused in the DataStore layer.
	 */
	// eslint-disable-next-line @rushstack/no-new-null
	getSnapshotTree(version?: IVersion, scenarioName?: string): Promise<ISnapshotTree | null>;

	/**
	 * @deprecated - This will be removed in a future release. No replacement is planned as
	 * it is unused in the DataStore layer.
	 */
	getSnapshot?(snapshotFetchOptions?: ISnapshotFetchOptions): Promise<ISnapshot>;

	/**
	 * @deprecated - This will be removed in a future release. No replacement is planned as
	 * it is unused in the DataStore layer.
	 */
	getVersions(
		// TODO: use `undefined` instead.
		// eslint-disable-next-line @rushstack/no-new-null
		versionId: string | null,
		count: number,
		scenarioName?: string,
		fetchSource?: FetchSource,
	): Promise<IVersion[]>;

	/**
	 * @deprecated - This will be removed in a future release. No replacement is planned as
	 * it is unused in the DataStore layer.
	 */
	createBlob(file: ArrayBufferLike): Promise<ICreateBlobResponse>;

	/**
	 * @deprecated - This will be removed in a future release. No replacement is planned as
	 * it is unused in the DataStore layer.
	 */
	uploadSummaryWithContext(summary: ISummaryTree, context: ISummaryContext): Promise<string>;

	/**
	 * @deprecated - This will be removed in a future release. No replacement is planned as
	 * it is unused in the DataStore layer.
	 */
	downloadSummary(handle: ISummaryHandle): Promise<ISummaryTree>;
}
