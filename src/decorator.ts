import { Range, type TextEditor } from 'vscode';

import { OpenCollapseDecorationType, CollapseDecorationType } from './decoration';

import * as Config from './settings';
import { Settings } from './settings';

import {
	GetRegex,
	IsOpenedWithDiffEditor,
	IsRangeSelected,
	IsLineOfRangeSelected,
	CollapseRange,
} from './utils';

//==================================================
// Variables
//==================================================
let currentEditor: TextEditor;

// Regex
let regex: RegExp;
let regExGroups: number[];

// Functionality
let enable: boolean;
let diffEditor: boolean;
let openCollapseOnLineSelected: boolean;

// Languages
let supportedLanguages: string[];

// Open collapses and collapses
let openCollapseDecorationType = OpenCollapseDecorationType();
let collapseDecorationType = CollapseDecorationType();
let collapseRanges: Range[];
let openCollapseRanges: Range[];

//==================================================
// Functions
//==================================================
export function SetCurrentEditor(textEditor: TextEditor | undefined) {
	if (!textEditor) {
		return;
	}
	currentEditor = textEditor;
	UpdateDecorations();
}

export function Enable() {
	Config.set<boolean>(Settings.functionality_enable, !enable);
	UpdateDecorations();
}

export function LoadConfig() {
	// Regex
	regex = GetRegex();
	regExGroups = Config.get<number[]>(Settings.regex_regexGroups);

	// Functionality
	enable = Config.get<boolean>(Settings.functionality_enable);
	diffEditor = Config.get<boolean>(Settings.functionality_diffEditor);
	openCollapseOnLineSelected = Config.get<boolean>(
		Settings.functionality_openCollapseOnLineSelected
	);
	supportedLanguages = Config.get<string[]>(Settings.languages_supportedLanguages);

	// Open collapses and collapses
	openCollapseDecorationType.dispose();
	collapseDecorationType.dispose();
	openCollapseDecorationType = OpenCollapseDecorationType();
	collapseDecorationType = CollapseDecorationType();

	UpdateDecorations();
}

export function UpdateDecorations() {
	if (
		!enable ||
		!currentEditor ||
		!supportedLanguages.includes(currentEditor.document.languageId) ||
		(diffEditor && IsOpenedWithDiffEditor(currentEditor.document.uri))
	) {
		return;
	}

	openCollapseRanges = [];
	collapseRanges = [];

	let match: RegExpExecArray | null;
	const documentText = currentEditor.document.getText();
	outerLoop: while ((match = regex.exec(documentText))) {
		const validRegExGroup: number | undefined = regExGroups.find(
			(regExGroup) => !(match && !match[regExGroup])
		);
		if (validRegExGroup === undefined) {
			continue;
		}

		const range = CollapseRange(currentEditor, match, validRegExGroup, true);
		const openRange = CollapseRange(currentEditor, match, 0, false);

		for (let i = 0; i < range.length; i++) {
			if (
				IsRangeSelected(currentEditor, range[i]) ||
				(openCollapseOnLineSelected && IsLineOfRangeSelected(currentEditor, openRange[0]))
			) {
				openCollapseRanges.push(range[i]);
				continue outerLoop;
			}

			collapseRanges.push(range[i]);
		}
	}

	currentEditor.setDecorations(openCollapseDecorationType, openCollapseRanges);
	currentEditor.setDecorations(collapseDecorationType, collapseRanges);
}
