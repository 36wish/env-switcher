const vscode = require('vscode');

function activate(context) {
    console.log('Activating env-switcher extension');

    let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'envSwitcher.selectEnvironment';
    context.subscriptions.push(statusBarItem);

    updateStatusBar(statusBarItem);

    let disposable = vscode.commands.registerCommand('envSwitcher.selectEnvironment', async () => {
        const config = vscode.workspace.getConfiguration('envSwitcher');
        const envOptions = config.get('options');
        const targetSetting = config.get('targetSetting') || 'playwright.env.ENV';

        if (!envOptions || envOptions.length === 0) {
            vscode.window.showErrorMessage('No environment options configured. Please check your settings.');
            return;
        }

        const selected = await vscode.window.showQuickPick(envOptions, {
            placeHolder: 'Select environment',
        });

        if (selected) {
            try {
                await updateSetting(targetSetting, selected);
                updateStatusBar(statusBarItem);
                vscode.window.showInformationMessage(`Environment updated to ${selected}`);
            } catch (error) {
                vscode.window.showErrorMessage(`Unable to update ${targetSetting}. Error: ${error.message}`);
            }
        }
    });

    context.subscriptions.push(disposable);

    // Watch for configuration changes
    vscode.workspace.onDidChangeConfiguration(e => {
        const config = vscode.workspace.getConfiguration('envSwitcher');
        const targetSetting = config.get('targetSetting') || 'playwright.env.ENV';
        if (e.affectsConfiguration(targetSetting) || e.affectsConfiguration('envSwitcher')) {
            updateStatusBar(statusBarItem);
        }
    });
}

async function updateSetting(settingPath, value) {
    const parts = settingPath.split('.');
    const section = parts.shift();
    const config = vscode.workspace.getConfiguration(section);

    if (parts.length === 1) {
        // Direct update for simple nested property
        await config.update(parts[0], { ENV: value }, vscode.ConfigurationTarget.Global);
    } else if (parts.length === 2) {
        // Update for doubly nested property
        const currentValue = config.get(parts[0]) || {};
        currentValue[parts[1]] = value;
        await config.update(parts[0], currentValue, vscode.ConfigurationTarget.Global);
    } else {
        throw new Error('Unsupported nesting level for setting');
    }
}

function updateStatusBar(statusBarItem) {
    const config = vscode.workspace.getConfiguration('envSwitcher');
    const targetSetting = config.get('targetSetting') || 'playwright.env.ENV';
    const parts = targetSetting.split('.');
    const section = parts.shift();
    let currentValue = vscode.workspace.getConfiguration(section);
    
    for (const part of parts) {
        if (currentValue && typeof currentValue === 'object' && part in currentValue) {
            currentValue = currentValue[part];
        } else {
            currentValue = undefined;
            break;
        }
    }
    
    statusBarItem.text = `${currentValue || 'Not set'}`;
    statusBarItem.show();
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};