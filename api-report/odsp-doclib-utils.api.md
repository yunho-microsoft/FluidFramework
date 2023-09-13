## API Report File for "@fluidframework/odsp-doclib-utils"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { DriverErrorTelemetryProps } from '@fluidframework/driver-utils';
import { IFluidErrorBase } from '@fluidframework/telemetry-utils';
import { IOdspErrorAugmentations } from '@fluidframework/odsp-driver-definitions';
import { ITelemetryProperties } from '@fluidframework/core-interfaces';
import { LoggingError } from '@fluidframework/telemetry-utils';
import { OdspError } from '@fluidframework/odsp-driver-definitions';

// @public
export function authRequestWithRetry(authRequestInfo: IOdspAuthRequestInfo, requestCallback: (config: RequestInit) => Promise<Response>): Promise<Response>;

// @public (undocumented)
export function createOdspNetworkError(errorMessage: string, statusCode: number, retryAfterSeconds?: number, response?: Response, responseText?: string, props?: ITelemetryProperties): IFluidErrorBase & OdspError;

// @public (undocumented)
export function enrichOdspError(error: IFluidErrorBase & OdspError, response?: Response, facetCodes?: string[], props?: ITelemetryProperties): IFluidErrorBase & OdspError;

// @public (undocumented)
export const fetchIncorrectResponse = 712;

// @public
export function fetchTokens(server: string, scope: string, clientConfig: IClientConfig, credentials: TokenRequestCredentials): Promise<IOdspTokens>;

// @public (undocumented)
export function getAadTenant(server: string): string;

// @public (undocumented)
export function getAadUrl(server: string): string;

// @public (undocumented)
export function getAsync(url: string, authRequestInfo: IOdspAuthRequestInfo): Promise<Response>;

// @public (undocumented)
export function getChildrenByDriveItem(driveItem: IOdspDriveItem, server: string, authRequestInfo: IOdspAuthRequestInfo): Promise<IOdspDriveItem[]>;

// @public (undocumented)
export function getDriveId(server: string, account: string, library: string | undefined, authRequestInfo: IOdspAuthRequestInfo): Promise<string>;

// @public (undocumented)
export function getDriveItemByRootFileName(server: string, account: string | undefined, path: string, authRequestInfo: IOdspAuthRequestInfo, create: boolean, driveId?: string): Promise<IOdspDriveItem>;

// @public (undocumented)
export function getDriveItemByServerRelativePath(server: string, serverRelativePath: string, authRequestInfo: IOdspAuthRequestInfo, create: boolean): Promise<IOdspDriveItem>;

// @public (undocumented)
export function getDriveItemFromDriveAndItem(server: string, drive: string, item: string, authRequestInfo: IOdspAuthRequestInfo): Promise<IOdspDriveItem>;

// @public (undocumented)
export function getFetchTokenUrl(server: string): string;

// @public (undocumented)
export function getLoginPageUrl(server: string, clientConfig: IClientConfig, scope: string, odspAuthRedirectUri: string): string;

// @public (undocumented)
export const getOdspRefreshTokenFn: (server: string, clientConfig: IClientConfig, tokens: IOdspTokens) => () => Promise<string>;

// @public (undocumented)
export const getOdspScope: (server: string) => string;

// @public (undocumented)
export const getPushRefreshTokenFn: (server: string, clientConfig: IClientConfig, tokens: IOdspTokens) => () => Promise<string>;

// @public (undocumented)
export const getRefreshTokenFn: (scope: string, server: string, clientConfig: IClientConfig, tokens: IOdspTokens) => () => Promise<string>;

// @public (undocumented)
export function getServer(tenantId: string): string;

// @public (undocumented)
export function getSiteUrl(server: string): string;

// @public (undocumented)
export function getSPOAndGraphRequestIdsFromResponse(headers: {
    get: (id: string) => string | undefined | null;
}): ITelemetryProperties;

// @public (undocumented)
export function hasFacetCodes(x: any): x is Pick<IOdspErrorAugmentations, "facetCodes">;

// @public (undocumented)
export interface IClientConfig {
    // (undocumented)
    clientId: string;
    // (undocumented)
    clientSecret: string;
}

// @public (undocumented)
export interface IOdspAuthRequestInfo {
    // (undocumented)
    accessToken: string;
    // (undocumented)
    refreshTokenFn?: () => Promise<string>;
}

// @public (undocumented)
export interface IOdspDriveItem {
    // (undocumented)
    driveId: string;
    // (undocumented)
    isFolder: boolean;
    // (undocumented)
    itemId: string;
    // (undocumented)
    name: string;
    // (undocumented)
    path: string;
}

// @public (undocumented)
export interface IOdspTokens {
    // (undocumented)
    readonly accessToken: string;
    // (undocumented)
    readonly refreshToken: string;
}

// @public (undocumented)
export function isOdspHostname(server: string): boolean;

// @public (undocumented)
export function isPushChannelHostname(server: string): boolean;

// @public
export interface OdspErrorResponse {
    // (undocumented)
    error: OdspErrorResponseInnerError & {
        message: string;
    };
}

// @public
export interface OdspErrorResponseInnerError {
    // (undocumented)
    code?: string;
    // (undocumented)
    innerError?: OdspErrorResponseInnerError;
}

// @public
export class OdspRedirectError extends LoggingError implements IFluidErrorBase {
    constructor(message: string, redirectLocation: string | undefined, props: DriverErrorTelemetryProps);
    // (undocumented)
    readonly canRetry = false;
    // (undocumented)
    readonly errorType = DriverErrorType.fileNotFoundOrAccessDeniedError;
    // (undocumented)
    readonly redirectLocation: string | undefined;
}

// @public (undocumented)
export const OdspServiceReadOnlyErrorCode = "serviceReadOnly";

// @public (undocumented)
export function parseFacetCodes(errorResponse: OdspErrorResponse): string[];

// @public (undocumented)
export function postAsync(url: string, body: any, authRequestInfo: IOdspAuthRequestInfo): Promise<Response>;

// @public (undocumented)
export const pushScope = "offline_access https://pushchannel.1drv.ms/PushChannel.ReadWrite.All";

// @public (undocumented)
export function putAsync(url: string, authRequestInfo: IOdspAuthRequestInfo): Promise<Response>;

// @public
export function refreshTokens(server: string, scope: string, clientConfig: IClientConfig, tokens: IOdspTokens): Promise<IOdspTokens>;

// @public
export function throwOdspNetworkError(errorMessage: string, statusCode: number, response: Response, responseText?: string, props?: ITelemetryProperties): never;

// @public (undocumented)
export type TokenRequestCredentials = {
    grant_type: "authorization_code";
    code: string;
    redirect_uri: string;
} | {
    grant_type: "refresh_token";
    refresh_token: string;
} | {
    grant_type: "password";
    username: string;
    password: string;
};

// @public (undocumented)
export function tryParseErrorResponse(response: string | undefined): {
    success: true;
    errorResponse: OdspErrorResponse;
} | {
    success: false;
};

// @public (undocumented)
export function unauthPostAsync(url: string, body: any): Promise<Response>;

// (No @packageDocumentation comment for this package)

```