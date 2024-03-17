<div align="center">
    <img width="384" alt="icon of extension" src="./public/img/icon.svg">
</div>

<h1 align="center" style="border:none;">Class Collapse</h1>

## TLDR

**Class Collapse** enhances your coding experience by mimicking VS Code's collapsing feature. This tool becomes essential when dealing with frameworks such as **Tailwind CSS**, known for their extensive usage of utility classes that can often make your code less readable. **Class Collapse** uses regex (can be customized inside settings) to make your coding experience cleaner by collapsing segments of your code, making it significantly easier to read and navigate.

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/G2G3VPRNX)

## Features

To toggle the **Class Collapse** extension, open the Command Palette with `Shift+Ctrl+P`, search for `Class Collapse: Toggle Collapsing`, or use the shortcut `Alt+Ctrl+Shift+C`. This key combination is chosen to avoid overriding any default bindings and avoid accidental activations or deactivations, with C also representing **C**lass **C**ollapse.

### How to open a collapse

Opening a collapse is as easy as clicking or selecting the collapse, making them only expanded when needed.
![Gif that selects code to show how to looks when collapses gets expanded](./public/gif/openCollapses.gif)

### Customization

This extension is **highly customizable**, allowing you to make it feel and look exactly how you want it; if something is missing and you want me to add it, please create an issue on my GitHub repo and I will consider your request.

Inspired by [Inline fold](https://github.com/moalamri/vscode-inline-fold), which has stopped receiving updates; more information on why is available on their GitHub repo

## Extension Settings

### Example:

```jsonc
{
	"classCollapseToggle": true,
	"disableInDiffEditor": true,

	"regex": "(class|className)(?:=|:|:\\s)((['\"])([\\s\\S]*?)\\3|{\\s*((['\"`])([\\s\\S]*?)\\6|(?!['\"`])([\\s\\S]*?))\\s*})",
	"regexFlags": "g",
	"regexGroups": [4, 7, 8],

	"openCollapseOnLineSelected": true,
	"collapsedText": "...",
	"collapsedTextColor": "#C3E88DFF",
	"openCollapseOpacity": 1,

	// https://code.visualstudio.com/docs/languages/identifiers#_known-language-identifiers
	"supportedLanguages": [
		"astro",
		"html",
		"javascriptreact",
		"javascript",
		"markdown",
		"php",
		"svelte",
		"typescript",
		"typescriptreact",
		"vue",
		"vue-html"
	]
}
```

### Available Settings:

-   `classCollapseToggle` - Enables or disables collapsing (includes Diff Editor)
-   `disableInDiffEditor` - Enables or disables collapsing in Diff Editor

-   `regex` - Regex to match
-   `regexFlags` - Regex flags
-   `regexGroups` - Which regex groups you wish to collapse

-   `openCollapseOnLineSelected` - If you wish to be able to open the collapse by pressing on the same line as the collapse is on, set it to `true`; otherwise, set it to `false` and press inside the collapse instead.
-   `collapsedText` - Text to show when collapsed
-   `collapsedTextColor` - Color of the collapsed text in hex (alpha value is optional)
-   `openCollapseOpacity` - The opacity of expanded collapses
-   `supportedLanguages` - Supported languages

## Known Issues

Create an issue on the extension's [GitHub page](https://github.com/Etsi0/class-collapse). If you have any troubles

## Release Notes

Check out the release notes at https://github.com/Etsi0/class-collapse/releases

## Contributors

![Everyone that has contributed to this project](https://contrib.rocks/image?repo=Etsi0/class-collapse)
