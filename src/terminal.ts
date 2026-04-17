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
    const inputResult = await insertUserInputs(clipboardResult.command);

    return {
        command: inputResult.command,
        successful: resourceResult.successful && clipboardResult.successful && inputResult.successful
    };
}

async function insertUserInputs(command: string): Promise<{ command: string, successful: boolean }> {
    const pattern = /\{#sym:([^}]+)\}/gi;
    const matches = [...new Set(Array.from(command.matchAll(pattern)).map(m => m[0]))];

    for (const match of matches) {
        const label = match.slice(6, -1); // strip {#sym: and }
        const input = await vscode.window.showInputBox({ prompt: label, placeHolder: label });

        if (input === undefined) {
            return { command, successful: false };
        }

        command = command.replace(new RegExp(escapeRegex(match), 'g'), input);
    }

    return { command, successful: true };
}

function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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