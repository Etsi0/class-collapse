import { window, TabInputTextDiff, Uri, type TextEditor, Range } from 'vscode';

import * as Config from './settings';
import { Settings } from './settings';

/**
 * Gets the regex that is saved in settings.
 * @returns {RegExp} Gets the regex that is saved in settings, otherwise /(?:)/
 */
export function GetRegex(): RegExp {
	return RegExp(Config.get<RegExp>(Settings.regex), Config.get<string>(Settings.regexFlags));
}

/**
 * Checks if the provided `uri` is opened in the Diff Editor
 * @param {Uri} uri - file path to the file you are editing
 * @returns {boolean} `true` if the provided `uri` is opened in the Diff Editor, otherwise `false`
 * @example
 * IsOpenedWithDiffEditor(currentEditor.document.uri)
 */
export function IsOpenedWithDiffEditor(uri: Uri): boolean {
	const tabs = window.tabGroups.all.flatMap((tabGroup) => tabGroup.tabs);
	return tabs.some(
		(tab) =>
			tab.input instanceof TabInputTextDiff &&
			(tab.input.modified.path === uri.path || tab.input.original.path === uri.path)
	);
}

/**
 * Checks if your selection is within the `range` of the collapse
 * @param {TextEditor} currentEditor - the editor that is currently opened
 * @param {Range} range - where the item start and end
 * @returns {boolean} `true` if your selection is within the `range` of the collapse, otherwise `false`
 * @example
 * const range = new Range(3, 5);
 * IsRangeSelected(currentEditor, range)
 */
export function IsRangeSelected(currentEditor: TextEditor, range: Range): boolean {
	return !!(
		currentEditor.selection.contains(range) ||
		currentEditor.selections.find((selection) => range.contains(selection))
	);
}

/**
 * Checks if your selection is on the same line as the `range` of the collapse
 * @param {TextEditor} currentEditor - The editor that is currently opened
 * @param {Range} range - Where the collapse starts and ends
 * @returns {boolean} `true` if the item is in your selection, otherwise `false`
 * @example
 * const range = new Range(3, 5);
 * IsLineOfRangeSelected(currentEditor, range);
 */
export function IsLineOfRangeSelected(currentEditor: TextEditor, range: Range): boolean {
	return !!currentEditor.selections.find(
		(selection) =>
			selection.start.line === range.end.line || selection.end.line === range.start.line
	);
}

/**
 * Gets the range of a collapse
 * @param {TextEditor} currentEditor - The editor that is currently opened
 * @param {any} match - All regex groups
 * @param {number} regexGroup - What regex group that should get collapsed
 * @returns {Range} Object that contains `start`, `end` positions. `start` is always less or equal to `end`
 * @example
 * CollapseRange(currentEditor, match, 8, true)
 */
export function CollapseRange(currentEditor: TextEditor, match: any, regexGroup: number): Range {
	const match1 = match[0];
	const text = match[regexGroup];
	const startIndex = match1.indexOf(text);

	const startPosition = currentEditor.document.positionAt(match.index + startIndex);
	const endPosition = currentEditor.document.positionAt(match.index + startIndex + text.length);

	return new Range(startPosition, endPosition);
}
