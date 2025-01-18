# Contributing

The easiest way to contribute is to write your own roll-macro that supports the [Macro API](README.md#macro-api). This is the indended way to alter or extend the logic or presentation of the rolls. If you have a roll-macro or configuration you wish to be included in the library, please submit a Pull-Request. However, this library is inteded to be more of an extensible framework rather than a catch-all of every system. Instead, consider creating a separate library that depends on this add-on for it's input or fork the project.

Bug reports, fixes, and spelling/typo corrections are always welcome.

## Development

### Building

The add-on uses [webpack](https://webpack.js.org/) to bundle all the html and javascript and a powershell script to package everything into the `.mtlib` file.

See [Build Instructions](build-instructions.md) for how to build and package the add-on.

### Project Structure

The project is split into two parts that get packaged into the `.mtlib` file.

#### The `library` Folder

This contains the all the MT macros for the library and anny media not bundled into the web-app(s).

#### The Web-Apps

**Web-App** in this case is defined as any html5-based overlay, dialog, or frame that library is to display in MapTool.

There is only one web-app in this library (the roll overlay), but the structure and build-script can handle multiple. The intention is for overlays, dialogs, and frames to go under the `/overlay`, `/dialog`, and `/frame` folders, respectively; that way `git` will properly ignore the staging areas.

The web-app uses [React-Redux](https://react-redux.js.org/) for its presentation (React) and data-store (Redux). All the source for this can be found in the `/overlay/roll` directory. All code is written in [TypeScript](https://www.typescriptlang.org/).

#### Web-App - MapTool Communication

The overlay is displayed via the [showRollOverlay](library\mtscript\public\showRollOverlay.mts) macro which is called at the end of the [onInit event handler](library\mtscript\public\onInit.mts).

**MapTool -> Web-App** communication is handled via the [runJSFunction()](https://wiki.rptools.info/index.php/runJsFunction) macro function. See [pushSEttings.mts](library\mtscript\public\pushSettings.mts) for an example of this.

**Web-App -> MapTool** communication is a bit trickier. In the app's [index.html](overlay\roll\src\index.html) is a hidden `<a>` element with the id "linker". Whenever any part of the app wants to send information to MapTool it calls a macro using this **linker**. The called macro then does whatever is desired (e.g. updating tokents, making rolls, changing data, etc.). See [linker.ts](overlay\roll\src\app\linker.ts) for how this is handled.

The main macro that is called by the widget is [executeRoll](library\mtscript\public\executeRoll.mts). This macro is what actually does the rolls and shows it in the chat log. See also [updateGlobalSettings](library\mtscript\updateGlobalSettings.mts) for another example.
