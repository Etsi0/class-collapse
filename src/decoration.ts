import { DecorationRangeBehavior, type TextEditorDecorationType, window } from 'vscode';
import * as Config from './settings';
import { Settings } from './settings';

// class|className='some classes here'
export function OpenCollapseDecorationType(): TextEditorDecorationType {
	return window.createTextEditorDecorationType({
		rangeBehavior: DecorationRangeBehavior.ClosedOpen,
		opacity: Config.get<number>(Settings.openCollapseOpacity).toString(),
	});
}

// class|className='...'
export function CollapseDecorationType(): TextEditorDecorationType {
	return window.createTextEditorDecorationType({
		before: {
			contentText: Config.get<string>(Settings.collapsedText),
			color: Config.get<string>(Settings.collapsedTextColor),
		},
		after: {
			// I will most likely never use this section, but it's here when i need it.
		},
		textDecoration: 'none; display: none;',
	});
}
