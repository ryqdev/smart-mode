import * as vscode from 'vscode';

export async function activate(context: vscode.ExtensionContext) {
    // Force Smart Mode to be off at startup
    let isSmartModeOn = true;

    // Disable all extensions before showing the UI
    await vscode.commands.executeCommand('workbench.extensions.action.disableAll');

    // Create and show the status bar item
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 0);
    statusBarItem.text = isSmartModeOn ? "Smart Mode: On" : "Smart Mode: Off";
    statusBarItem.command = "smart-mode.toggle";
    statusBarItem.tooltip = "Toggle Smart Mode (enable/disable all extensions)";
    statusBarItem.color = isSmartModeOn ? "#00FF00" : "#FF0000"; // Green if On, Red if Off
    statusBarItem.show();

    // Register the toggle command
    const disposable = vscode.commands.registerCommand('smart-mode.toggle', async () => {
        if (isSmartModeOn) {
            // Currently on: turn it off by disabling all extensions
            await vscode.commands.executeCommand('workbench.extensions.action.disableAll');
            isSmartModeOn = false;
        } else {
            // Currently off: turn it on by enabling all extensions
            await vscode.commands.executeCommand('workbench.extensions.action.enableAll');
            isSmartModeOn = true;
        }

        // Update the status bar text and color
        statusBarItem.text = isSmartModeOn ? "Smart Mode: On" : "Smart Mode: Off";
        statusBarItem.color = isSmartModeOn ? "#00FF00" : "#FF0000";
        
        context.globalState.update('isSmartModeOn', isSmartModeOn);
    });

    context.subscriptions.push(disposable, statusBarItem);
}

export function deactivate() {}