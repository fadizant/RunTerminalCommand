import * as vscode from 'vscode';
import { TerminalCommand } from './command';

export interface CommandQuickPickItem extends vscode.QuickPickItem {
    type: 'group' | 'command' | 'settings' | 'separator';
    kind?: number;
    command?: TerminalCommand;
    group?: string;
}

export async function showCommandsPick(commands: TerminalCommand[]) {
    const grouplessCommands = getGroupless(commands);
    const groups = getGroups(commands);

    const pickItems = getPickItems(grouplessCommands, groups);
    if (pickItems.length === 0) {
        return;
    }

    const separatorItem: CommandQuickPickItem = {
        type: 'separator',
        label: '',
        kind: -1  // QuickPickItemKind.Separator
    };

    const settingsItem: CommandQuickPickItem = {
        type: 'settings',
        label: '⚙️ Settings',
        description: 'Open Extension Settings'
    };

    let picked = await vscode.window.showQuickPick([...pickItems, separatorItem, settingsItem], { matchOnDescription: true });
    if (!picked) {
        return;
    }

    if (picked.type === 'settings') {
        openExtensionSettings();
        return;
    }

    if (picked.type === 'group' && picked.group) {
        picked = await vscode.window.showQuickPick(
            getPickItems(getFromGroup(commands, picked.group)),
            { matchOnDescription: true });
    }

    if (!picked || picked.type !== 'command' || !picked.command) {
        return;
    }

    return picked.command;
}

function getGroupless(commands: TerminalCommand[]) {
    return commands.filter(c => !c.group);
}

function getGroups(commands: TerminalCommand[]) {
    return distinct(commands
        .filter(c => !!c.group)
        .map(c => c.group as string));
}

function getFromGroup(commands: TerminalCommand[], group: string) {
    return commands.filter(c => c.group === group);
}

function distinct<T>(values: T[]) {
    return [...new Set(values)];
}

function getPickItems(commands: TerminalCommand[], groups: string[] = []) {
    return [
        ...commands.map<CommandQuickPickItem>(c => {
            return {
                type: 'command',
                command: c,
                label: c.name || removeVariables(c.command).trim(),
                description: 'Command' + (c.name ? ` (${removeVariables(c.command).trim()})` : '')
            };
        }),
        ...groups.map<CommandQuickPickItem>(g => {
            return {
                type: 'group',
                group: g,
                label: g,
                description: 'Group'
            };
        })
    ];
}

async function openExtensionSettings() {
    await vscode.commands.executeCommand('workbench.action.openSettingsJson');

    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }

    const text = editor.document.getText();
    const idx = text.indexOf('terminalCommandsRunner');
    if (idx === -1) { return; }

    const pos = editor.document.positionAt(idx);
    editor.selection = new vscode.Selection(pos, pos);
    editor.revealRange(new vscode.Range(pos, pos), vscode.TextEditorRevealType.AtTop);
}

function removeVariables(command: string) {
    return command
        .replace(/\{#opt:[^}]+\}/g, '')
        .replace(/\{#sym:[^}]+\}/g, '')
        .replace(/\{\w+\}/g, '');
}