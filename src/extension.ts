import { window, workspace, commands, ExtensionContext } from 'vscode';
import * as Decorator from './decorator';
import { Command, Settings } from './settings';

export function activate({ subscriptions }: ExtensionContext) {
	Decorator.LoadConfig();
	Decorator.SetCurrentEditor(window.activeTextEditor);

	/*==================================================
		Registered event handlers
	==================================================*/
	const changeCurrentEditor = window.onDidChangeActiveTextEditor(() => {
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

	/*==================================================
		Registered commands
	==================================================*/
	const commandEnable = commands.registerCommand(Command.enable, () => {
		Decorator.Enable();
	});

	/*==================================================
		Registered subscriptions
	==================================================*/
	subscriptions.push(changeCurrentEditor);
	subscriptions.push(changeTextEditorSelection);
	subscriptions.push(changeConfiguration);
	subscriptions.push(commandEnable);
}

// this method is called when your extension is deactivated
export function deactivate({ subscriptions }: ExtensionContext) {
	subscriptions.forEach((subscription) => subscription.dispose());
}
