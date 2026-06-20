# Terminal Commands Runner

Run predefined terminal commands from Explorer context menu or Command Palette.

## See how it works

![Example](img/example.gif)

## Keyboard Shortcut

You can trigger the command picker using:

`Ctrl+Alt+'`

Or open the Command Palette (`Ctrl+Shift+P`) and search for **Terminal Commands Runner...**

## Configuration

### How to edit your command list:

VSCode -> File -> Preferences -> Settings

It will show the list: [Text Editor, Workbench, Window, Features, Application, Extension].

Click on "Extensions", Scroll down and click on "Terminal Commands Runner" -> Edit in Settings.Json

Or just open and edit directly the file:
`C:\Users\{YOUR USERNAME}\AppData\Roaming\Code\User\Settings.Json`

Now you can edit the commands you want:

```json
    "terminalCommandsRunner.commands": [
        {
            "command": "node {resource}",
            "name": "Run File",
            "auto": true
        },
        {
            "command": "node --inspect {resource}",
            "name": "Debug File",
            "auto": true
        },
        {
            "command": "npm install",
            "name": "Install Dependencies",
            "auto": true,
            "fromRoot": true,
            "group": "npm"
        },
        {
            "command": "npm run {#opt:Choose script:start,build,test,lint}",
            "name": "Run Script",
            "auto": true,
            "fromRoot": true,
            "group": "npm"
        },
        {
            "command": "npm run {#opt:Environment:Development=dev,Production=build,Test=test}",
            "name": "Run for Environment",
            "auto": true,
            "fromRoot": true,
            "group": "npm"
        },
        {
            "command": "nodemon {#sym:Entry point (e.g. server.js)}",
            "name": "Nodemon",
            "auto": true,
            "preserve": true,
            "fromRoot": true,
            "group": "npm"
        }
    ]
```

### Properties

| Property | Description                                                                                                   |
| -------- | ------------------------------------------------------------------------------------------------------------- |
| command  | The text to send to the terminal.                                                                             |
| auto     | Whether to add a new line to the text being sent, this is normally required to run a command in the terminal. |
| preserve | Don't dispose of terminal running this command.                                                               |
| fromRoot | Open the terminal at the workspace root folder instead of the file's directory.                               |
| name     | Name for the command. A human readable string which is rendered prominent.                                    |
| group    | Commands sharing the group name will be grouped together in the menu.                                         |

### Variables

| Variable                         | Description                                                                                                                                                                                       |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| {resource}                       | Name of current resource.                                                                                                                                                                         |
| {clipboard}                      | Clipboard content.                                                                                                                                                                                |
| {#sym:Label}                     | Prompts the user for free-text input at runtime. `Label` is shown as the input prompt.                                                                                                            |
| {#opt:Label:option1,option2,...} | Shows a dropdown picker at runtime. `Label` is the placeholder, options are comma-separated. Each option can be `display=value` to show a human-friendly label while inserting a different value. |

#### Dropdown picker example

```json
{
  "command": "npm run {#opt:Choose script:start,build,test,lint}",
  "name": "NPM Run (pick script)",
  "auto": true
}
```

When this command runs, a dropdown appears with the options `start`, `build`, `test`, and `lint`. The selected value is inserted into the command before it is sent to the terminal.

#### Key/value options example

Options can use `key=value` syntax so the list shows a friendly label while the actual value inserted into the command is different:

```json
{
  "command": "kubectl config use-context {#opt:Environment:Production=prod-cluster,Staging=stage-cluster,Local=minikube}",
  "name": "Switch K8s Context",
  "auto": true
}
```

The dropdown shows `Production`, `Staging`, and `Local`, but inserts `prod-cluster`, `stage-cluster`, or `minikube` respectively. Plain options without `=` continue to work as before.
