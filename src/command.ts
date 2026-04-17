export interface TerminalCommand {
    command: string;
    auto: boolean;
    preserve: boolean;
    fromRoot: boolean;
    name?: string;
    group?: string;
}