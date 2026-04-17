import * as vscode from 'vscode';
import { TerminalCommand } from './command';

let previousTerminal: vscode.Terminal | undefined;

export async function runCommand(command: TerminalCommand, cwd?: string, resource?: string) {
    const effectiveCwd = command.fromRoot ? getWorkspaceRoot(cwd) : cwd;
    const terminal = vscode.window.createTerminal({ cwd: effectiveCwd });
    terminal.show();

    ensureDisposed();

    const result = await insertVariables(command.command, resource);

    terminal.sendText(result.command, command.auto && result.successful);

    if (!command.preserve) {
        previousTerminal = terminal;
    }
}

function ensureDisposed() {
    if (previousTerminal) {
        previousTerminal.dispose();
        previousTerminal = undefined;
    }
}

async function insertVariables(command: string, resource?: string) {
    const resourceResult = insertVariable(command, 'resource', resource);
    const clipboardResult = insertVariable(resourceResult.command, 'clipboard', await vscode.env.clipboard.readText());

    return {
        command: clipboardResult.command,
        successful: resourceResult.successful && clipboardResult.successful
    };
}

function getWorkspaceRoot(cwd?: string): string | undefined {
    if (cwd) {
        const folder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(cwd));
        if (folder) {
            return folder.uri.fsPath;
        }
    }
    return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
}

function insertVariable(command: string, variable: string, value?: string) {
    let successful = true;
    const pattern = `{${variable}}`;

    if (new RegExp(pattern, 'i').test(command)) {
        command = command.replace(new RegExp(pattern, 'ig'), value || '');

        if (!value) {
            successful = false;
        }
    }

    return {
        command,
        successful
    };
}