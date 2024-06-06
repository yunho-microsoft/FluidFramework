## Alpha API Report File for "@fluidframework/local-driver"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { DocumentDeltaConnection } from '@fluidframework/driver-base/internal';
import { GitManager } from '@fluidframework/server-services-client';
import { IClient } from '@fluidframework/driver-definitions';
import { ICreateBlobResponse } from '@fluidframework/driver-definitions/internal';
import { IDatabaseManager } from '@fluidframework/server-services-core';
import { IDb } from '@fluidframework/server-services-core';
import { IDocumentDeltaConnection } from '@fluidframework/driver-definitions/internal';
import { IDocumentDeltaStorageService } from '@fluidframework/driver-definitions/internal';
import { IDocumentMessage } from '@fluidframework/driver-definitions/internal';
import { IDocumentService } from '@fluidframework/driver-definitions/internal';
import { IDocumentServiceEvents } from '@fluidframework/driver-definitions/internal';
import { IDocumentServiceFactory } from '@fluidframework/driver-definitions/internal';
import { IDocumentServicePolicies } from '@fluidframework/driver-definitions/internal';
import { IDocumentStorageService } from '@fluidframework/driver-definitions/internal';
import { IDocumentStorageServicePolicies } from '@fluidframework/driver-definitions/internal';
import { ILocalDeltaConnectionServer } from '@fluidframework/server-local-server';
import { IRequest } from '@fluidframework/core-interfaces';
import { IResolvedUrl } from '@fluidframework/driver-definitions/internal';
import { ISequencedDocumentMessage } from '@fluidframework/driver-definitions';
import { ISnapshot } from '@fluidframework/driver-definitions/internal';
import { ISnapshotFetchOptions } from '@fluidframework/driver-definitions/internal';
import { ISnapshotTreeEx } from '@fluidframework/driver-definitions/internal';
import { IStream } from '@fluidframework/driver-definitions/internal';
import { ISummaryContext } from '@fluidframework/driver-definitions/internal';
import { ISummaryHandle } from '@fluidframework/driver-definitions';
import { ISummaryTree } from '@fluidframework/driver-definitions';
import { ITelemetryBaseLogger } from '@fluidframework/core-interfaces';
import { ITestDbFactory } from '@fluidframework/server-test-utils';
import { ITokenProvider } from '@fluidframework/routerlicious-driver';
import { IUrlResolver } from '@fluidframework/driver-definitions/internal';
import { IVersion } from '@fluidframework/driver-definitions/internal';
import { IWebSocketServer } from '@fluidframework/server-services-core';
import { NackErrorType } from '@fluidframework/driver-definitions/internal';
import type { Socket } from 'socket.io-client';
import { TypedEventEmitter } from '@fluid-internal/client-utils';

// @alpha (undocumented)
export function createLocalResolverCreateNewRequest(documentId: string): IRequest;

// @alpha
export class LocalDocumentServiceFactory implements IDocumentServiceFactory {
    constructor(localDeltaConnectionServer: ILocalDeltaConnectionServer, policies?: IDocumentServicePolicies | undefined, innerDocumentService?: IDocumentService | undefined);
    // (undocumented)
    createContainer(createNewSummary: ISummaryTree | undefined, resolvedUrl: IResolvedUrl, logger?: ITelemetryBaseLogger, clientIsSummarizer?: boolean): Promise<IDocumentService>;
    createDocumentService(resolvedUrl: IResolvedUrl, logger?: ITelemetryBaseLogger, clientIsSummarizer?: boolean): Promise<IDocumentService>;
    disconnectClient(clientId: string, disconnectReason: string): void;
    nackClient(clientId: string, code?: number, type?: NackErrorType, message?: any): void;
}

// @alpha
export class LocalResolver implements IUrlResolver {
    constructor();
    // (undocumented)
    createCreateNewRequest(documentId: string): IRequest;
    // (undocumented)
    getAbsoluteUrl(resolvedUrl: IResolvedUrl, relativeUrl: string): Promise<string>;
    resolve(request: IRequest): Promise<IResolvedUrl>;
}

// (No @packageDocumentation comment for this package)

```