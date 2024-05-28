import { window, TabInputTextDiff, Uri, type TextEditor, Range, type Position } from 'vscode';

import * as Config from './settings';
import { Settings } from './settings';

/**
 * Gets the regex that is saved in settings.
 * @returns {RegExp} Gets the regex that is saved in settings, otherwise /(?:)/
 */
export function GetRegex(): RegExp {
	return RegExp(
		Config.get<RegExp>(Settings.regex_regex),
		Config.get<string>(Settings.regex_regexFlags)
	);
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
			selection.start.line <= range.end.line && selection.end.line >= range.start.line
	);
}

/**
 * Gets the range of a collapse
 * @param { TextEditor } currentEditor - The editor that is currently opened
 * @param { RegExpExecArray } match - All regex groups
 * @param { number } regexGroup - What regex group that should get collapsed
 * @returns { Range } Object that contains `start`, `end` positions. `start` is always less or equal to `end`
 * @example
 * CollapseRange(currentEditor, match, 8, true)
 */
export function CollapseRange(
	currentEditor: TextEditor,
	match: RegExpExecArray,
	regexGroup: number,
	close: boolean
): Range[] {
	const match1 = match[0];
	const text = match[regexGroup];
	let newText: string[] = [text];

	const filter = Config.get<string[]>(Settings.whitelist_filter);
	if (close && filter.length !== 0) {
		const whitelistedWords = GetFullMatches(text, filter) ?? filter;
		newText = text.split(new RegExp(whitelistedWords.join('|'), 'g'));
	}

	return newText.reduce<Range[]>((accumulator, currentValue) => {
		if (currentValue.trim().length === 0) {
			return accumulator;
		}

		const startIndex = match1.indexOf(currentValue);

		const startPosition = currentEditor.document.positionAt(match.index + startIndex);
		const endPosition = currentEditor.document.positionAt(
			match.index + startIndex + currentValue.length
		);

		accumulator.push(new Range(startPosition, endPosition));

		return accumulator;
	}, []);
}

/**
 * Gives you the hole match from the whitelisted items. for example, if you have whitelisted "red" and there is a text-red-500, you will see text-red-500 and not just red
 * @param { string } str - The string that is about to the collapsed
 * @param { string[] } filter - All the whitelisted words
 * @returns { string[] | undefined } You will get back an array that contains the full length versions of string that is inside the filter, if there is no matches or `whitelist_showEntireMatch` it `false` you will get `undefined`
 * @example
 * GetFullMatches("bg-red-200 outline-blue-700 text-red-500", ["red"]) // ["text-red-500", "bg-red-200"] if `whitelist_showEntireMatch` is `true`, otherwise `undefined`
 */
function GetFullMatches(str: string, filter: string[]): string[] | undefined {
	if (!Config.get<string[]>(Settings.whitelist_showEntireMatch)) {
		return;
	}

	const wordFilter: string[] = str
		.split(new RegExp('\\s|\'|"|`', 'g'))
		.filter((string, i) => filter.some((item, j) => string.indexOf(item) !== -1));

	if (wordFilter.length === 0) {
		return;
	}

	return wordFilter;
}
