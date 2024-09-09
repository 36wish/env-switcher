# ENV Switcher

ENV Switcher is a Visual Studio Code extension that allows you to easily switch between different environment configurations directly from the status bar. It's particularly useful for projects that require frequent environment changes, such as switching between different test environments.

## Features

- Quick environment switching from the VS Code status bar
- Configurable environment options
- Updates user-level settings for consistent environment across workspaces
- Supports nested configuration settings (e.g., `playwright.env.ENV`)

## Usage

1. After installation, you'll see the current environment displayed in the status bar (e.g., "int06").
2. Click it and select the environment you wish to switch to.

## Configuration

Before using the extension, you need to configure it in your VS Code settings:

1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS)
2. Type "Preferences: Open Settings (JSON)" and select it
2. Make sure you have the following section in your `settings.json`

```json
"playwright.env": {
    "ENV": "int06",
    "DB_PW": "xxxx",
    "SECRET_KEY": "xxxx"
}
```

3. Optionally, add the following configuration to your `settings.json`:

```json
"envSwitcher.options": ["int06", "int07", "int08"],
"envSwitcher.targetSetting": "playwright.env.ENV"
```

Adjust the `options` array to include your desired environment options.


## Extension Settings

This extension contributes the following settings:

* `envSwitcher.options`: An array of available environment options.
* `envSwitcher.targetSetting`: The configuration setting to be updated when switching environments (default: "playwright.env.ENV").

