/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { IDbFactory } from "@fluidframework/server-services-core";
import { Provider } from "nconf";

import { InMemoryDbFactory } from "./inMemorydb";
import { LevelDbFactory } from "./levelDb";

export async function getDbFactory(config: Provider): Promise<IDbFactory> {
	return config.get("db:inMemory")
		? new InMemoryDbFactory()
		: new LevelDbFactory(config.get("db:path"));
}
