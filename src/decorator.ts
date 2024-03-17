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
let classCollapseToggle: boolean;
let disableInDiffEditor: boolean;
let openCollapseOnLineSelected: boolean;
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

export function ToggleClassCollapse() {
	Config.set(Settings.classCollapseToggle, !classCollapseToggle);
	UpdateDecorations();
}

export function LoadConfig() {
	// Regex
	regex = GetRegex();
	regExGroups = Config.get<number[]>(Settings.regexGroups);

	// Functionality
	classCollapseToggle = Config.get<boolean>(Settings.classCollapseToggle);
	disableInDiffEditor = Config.get<boolean>(Settings.disableInDiffEditor);
	openCollapseOnLineSelected = Config.get<boolean>(Settings.openCollapseOnLineSelected);
	supportedLanguages = Config.get<string[]>(Settings.supportedLanguages);

	// Open collapses and collapses
	openCollapseDecorationType.dispose();
	collapseDecorationType.dispose();
	openCollapseDecorationType = OpenCollapseDecorationType();
	collapseDecorationType = CollapseDecorationType();

	UpdateDecorations();
}

export function UpdateDecorations() {
	if (
		!classCollapseToggle ||
		!currentEditor ||
		!supportedLanguages.includes(currentEditor.document.languageId) ||
		(disableInDiffEditor && IsOpenedWithDiffEditor(currentEditor.document.uri))
	) {
		return;
	}

	openCollapseRanges = [];
	collapseRanges = [];

	let match: any;
	const documentText = currentEditor.document.getText();
	while ((match = regex.exec(documentText))) {
		const validRegExGroup: number | undefined = regExGroups.find(
			(regExGroup) => !(match && !match[regExGroup])
		);
		if (validRegExGroup === undefined) {
			continue;
		}

		const range = CollapseRange(currentEditor, match, validRegExGroup);
		const openRange = CollapseRange(currentEditor, match, 0);

		if (
			IsRangeSelected(currentEditor, range) ||
			(openCollapseOnLineSelected && IsLineOfRangeSelected(currentEditor, openRange))
		) {
			openCollapseRanges.push(range);
			continue;
		}
		collapseRanges.push(range);
	}

	currentEditor.setDecorations(openCollapseDecorationType, openCollapseRanges);
	currentEditor.setDecorations(collapseDecorationType, collapseRanges);
}
