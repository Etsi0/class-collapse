import { workspace } from 'vscode';

export enum Settings {
	identifier = 'class-collapse',

	// Regex
	regex = 'regex',
	regexFlags = 'regexFlags',
	regexGroups = 'regexGroups',

	// Functionality
	classCollapseToggle = 'classCollapseToggle',
	disableInDiffEditor = 'disableInDiffEditor',
	openCollapseOnLineSelected = 'openCollapseOnLineSelected',
	supportedLanguages = 'supportedLanguages',

	// Styling
	fancyCollapse = 'fancyCollapse',
	collapsedText = 'collapsedText',
	collapsedTextColor = 'collapsedTextColor',
	openCollapseOpacity = 'openCollapseOpacity',
}

export enum Command {
	toggleClassCollapse = 'class-collapse.toggleClassCollapse',
}

/**
 * Gets the value of a item
 * @param key - The key of the item you wish to get
 * @returns {T} The Type of the item you wish to get
 * @example
 * // Gets "classCollapseToggle" so we can check if we should collapse items or not
 * Config.get<boolean>(Settings.classCollapseToggle);
 */
export function get<T>(key: Settings): T {
	return workspace.getConfiguration(Settings.identifier).get<T>(key) as T;
}

/**
 * Sets the value of a item
 * @param key - the key of the item you wish to change
 * @param value - The new value of the item (type needs to be the same as the previous value)
 * @example
 * // This will turns on class collapse
 * Config.set(Settings.classCollapseToggle, true);
 */
export function set(key: Settings, value: any) {
	workspace.getConfiguration(Settings.identifier).update(key, value, true);
}
