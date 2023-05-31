/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import {
	tokens,
	TableBody,
	TableCell,
	TableRow,
	Table,
	TableHeader,
	TableHeaderCell,
} from "@fluentui/react-components";
import { EditRegular, Search12Regular, Person12Regular } from "@fluentui/react-icons";
import { clientIdTooltipText, userIdTooltipText } from "./TooltipTexts";
import { TransformedAudienceStateData } from "./AudienceView";
import { LabelCellLayout } from "./utility-components";

/**
 * Represents audience state data filtered to the attributes that will be displayed in the state table.
 */
export interface AudienceStateTableProps {
	/**
	 * Filtered audience state data from {@link audienceStateDataFilter}
	 * Containing clientId, userId, mode, scopes & myClientConnection.
	 */
	audienceStateItems: TransformedAudienceStateData[];
}

/**
 * Renders audience state data of client(s)'s clientId, userId, mode, and scopres who are currently connected to the container.
 */
export function AudienceStateTable(props: AudienceStateTableProps): React.ReactElement {
	const { audienceStateItems } = props;

	// Columns for rendering audience state
	const audienceStateColumns = [
		{ columnKey: "clientId", label: "Client ID" },
		{ columnKey: "userId", label: "User ID" },
		{ columnKey: "mode", label: "Mode" },
		{ columnKey: "scopes", label: "Scopes" },
	];

	return (
		<Table size="extra-small" aria-label="Audience state table">
			<TableHeader>
				<TableRow>
					{audienceStateColumns.map((column, columnIndex) => (
						<TableHeaderCell key={columnIndex}>
							{column.columnKey === "clientId" && (
								<LabelCellLayout
									icon={<Person12Regular />}
									infoTooltipContent={clientIdTooltipText}
								>
									{column.label}
								</LabelCellLayout>
							)}
							{column.columnKey === "userId" && (
								<LabelCellLayout
									icon={<Person12Regular />}
									infoTooltipContent={userIdTooltipText}
								>
									{column.label}
								</LabelCellLayout>
							)}
							{column.columnKey === "mode" && (
								<LabelCellLayout icon={<EditRegular />}>
									{column.label}
								</LabelCellLayout>
							)}
							{column.columnKey === "scopes" && (
								<LabelCellLayout icon={<Search12Regular />}>
									{column.label}
								</LabelCellLayout>
							)}
						</TableHeaderCell>
					))}
				</TableRow>
			</TableHeader>
			<TableBody>
				{audienceStateItems.map((item, itemIndex) => {
					const isCurrentUser =
						item.myClientConnection !== undefined &&
						item.myClientConnection.user.id === item.userId;

					return (
						<TableRow
							key={itemIndex}
							style={{
								backgroundColor: isCurrentUser
									? tokens.colorPaletteGreenBorder1
									: "",
							}}
						>
							<TableCell>
								{item.clientId}
								{isCurrentUser && " (me)"}
							</TableCell>
							<TableCell>
								{item.userId}
								{isCurrentUser && " (me)"}
							</TableCell>
							<TableCell>{item.mode}</TableCell>
							<TableCell>
								<span>{item.scopes.join("\n")}</span>
							</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
}