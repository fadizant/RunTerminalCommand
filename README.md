# Terminal Commands Runner

Run predefined terminal commands from Explorer context menu or Command Palette.

## See how it works

![Example](img/example.gif)

## Configuration

### How to edit your command list:

VSCode -> File -> Preferences -> Settings

It will show the list: [Text Editor, Workbench, Window, Features, Application, Extension].

Click on "Extensions", Scroll down and click on "Run Terminal Command..." -> Edit in Settings.Json

Or just open and edit directly the file:
`C:\Users\{YOUR USERNAME}\AppData\Roaming\Code\User\Settings.Json`

Now you can edit the commands you want:

```json
    "runTerminalCommand.commands": [
        {
            "command": "npm start",
            "name": "Start Node.JS",
        },
        {
            "command": "ndb server.js",
            "auto": true,
            "group": "Node.JS",
        },
        {
            "command": "nodemon server.js",
            "name": "Nodemon",
            "auto": true,
            "preserve": true,
            "fromRoot": true,
            "group": "Node.JS",
        },
        {
            "command": "npm run start:{clipboard}",
            "name": "Run with environments",
            "auto": true,
            "group": "Node.JS",
        },
        {
            "command": "echo {resource}",
            "auto": true
        },
        {
            "command": "echo {#sym:Type something}",
            "name": "User Input",
            "auto": true
        },
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

| Variable     | Description                                                                  |
| ------------ | ---------------------------------------------------------------------------- |
| {resource}   | Name of current resource.                                                    |
| {clipboard}  | Clipboard content.                                                           |
| {#sym:Label} | Prompts the user for input at runtime. `Label` is shown as the input prompt. |
