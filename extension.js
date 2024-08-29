const vscode = require('vscode');

function activate(context) {
    let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'envSwitcher.selectEnvironment';
    context.subscriptions.push(statusBarItem);

    updateStatusBar(statusBarItem);

    let disposable = vscode.commands.registerCommand('envSwitcher.selectEnvironment', async () => {
        const config = vscode.workspace.getConfiguration('envSwitcher');
        const envOptions = config.get('options');

        // Check if envOptions is undefined or empty
        if (!envOptions || envOptions.length === 0) {
            vscode.window.showErrorMessage('No environment options configured. Please check your settings.');
            return;
        }

        const targetSetting = config.get('targetSetting') || 'playwright.env.ENV';

        const selected = await vscode.window.showQuickPick(envOptions, {
            placeHolder: 'Select environment',
        });

        if (selected) {
            const targetConfig = vscode.workspace.getConfiguration();
            await targetConfig.update(targetSetting, selected, vscode.ConfigurationTarget.Global);
            updateStatusBar(statusBarItem);
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

function updateStatusBar(statusBarItem) {
    const config = vscode.workspace.getConfiguration('envSwitcher');
    const targetSetting = config.get('targetSetting') || 'playwright.env.ENV';
    const targetConfig = vscode.workspace.getConfiguration();
    const currentEnv = targetConfig.get(targetSetting);
    statusBarItem.text = `${currentEnv || 'Not set'}`;
    statusBarItem.show();
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};