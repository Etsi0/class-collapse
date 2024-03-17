import { window, workspace, commands, ExtensionContext } from 'vscode';
import * as Decorator from './decorator';
import { Command } from './settings';
import { Settings } from './settings';

export function activate({ subscriptions }: ExtensionContext) {
	Decorator.LoadConfig();
	Decorator.SetCurrentEditor(window.activeTextEditor);

	//
	// Registered event handlers
	//
	const changeActiveTextEditor = window.onDidChangeActiveTextEditor(() => {
		Decorator.SetCurrentEditor(window.activeTextEditor);
	});

	const changeTextEditorSelection = window.onDidChangeTextEditorSelection(() => {
		Decorator.UpdateDecorations();
	});

	const changeConfiguration = workspace.onDidChangeConfiguration((event) => {
		if (event.affectsConfiguration(Settings.identifier)) {
			Decorator.LoadConfig();
		}
	});

	//
	// Registered commands
	//
	const toggleCommand = commands.registerCommand(Command.toggleClassCollapse, () => {
		Decorator.ToggleClassCollapse();
	});

	//
	// Registered subscriptions
	//
	subscriptions.push(changeActiveTextEditor);
	subscriptions.push(changeTextEditorSelection);
	subscriptions.push(changeConfiguration);
	subscriptions.push(toggleCommand);
}

// this method is called when your extension is deactivated
export function deactivate({ subscriptions }: ExtensionContext) {
	subscriptions.forEach((subscription) => subscription.dispose());
}
