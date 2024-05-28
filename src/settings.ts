import { workspace } from 'vscode';

export enum Settings {
	identifier = 'class-collapse',

	// Functionality
	functionality_enable = 'functionality.enable',
	functionality_diffEditor = 'functionality.diffEditor',
	functionality_openCollapseOnLineSelected = 'functionality.openCollapseOnLineSelected',

	// Regex
	regex_regex = 'regex.regex',
	regex_regexFlags = 'regex.regexFlags',
	regex_regexGroups = 'regex.regexGroups',

	// Whitelist
	whitelist_filter = 'whitelist.filter',
	whitelist_showEntireMatch = 'whitelist.showEntireMatch',

	// Styling
	style_placeholderText = 'style.placeholderText',
	style_placeholderTextColor = 'style.placeholderTextColor',
	style_openCollapseOpacity = 'style.openCollapseOpacity',

	// Languages
	languages_supportedLanguages = 'languages.supportedLanguages',
}

export enum Command {
	enable = 'class-collapse.functionality.enable',
}

/**
 * Gets the value of a item
 * @param { Settings } key - The key of the item you wish to get
 * @returns { T } The Type of the item you wish to get
 * @example
 * // Gets "classCollapseToggle" so we can check if we should collapse items or not
 * Config.get<boolean>(Settings.functionality_enable);
 */
export function get<T>(key: Settings): T {
	return workspace.getConfiguration(Settings.identifier).get<T>(key) as T;
}

/**
 * Sets the value of a item
 * @param { Settings } key - the key of the item you wish to change
 * @param { T } value - The new value of the item (type needs to be the same as the previous value)
 * @example
 * // This will turns on class collapse
 * Config.set<boolean>(Settings.functionality_enable, true);
 */
export function set<T>(key: Settings, value: T): void {
	workspace.getConfiguration(Settings.identifier).update(key, value, true);
}
