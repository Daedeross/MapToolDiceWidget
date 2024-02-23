# How to build the library

## Requirements

- [NodeJS](https://nodejs.org/en)
- NPM (included in NodeJS by default)
- [Powershell](https://github.com/PowerShell/PowerShell) (for the quick way)

## Steps

### Quick way

1. Clone and navigate to the root of the repository.
2. Run the `build.ps1` script in powershell.

The script will build the web-app (/overlay/roll), package it up with the rest of the library, and copy it to the desired destination. If this is the first time building the project, the script will prompt you for the destination. The destination path is stored in `.buildlocal` which is ignored by **git**.

*The script has been tested on Windows 10 and 11, not yet on any build of Linux or MacOS.*

If you are curious about the script and project structure, I have a template you can clone/copy [here](https://github.com/Daedeross/MapToolAddOnTemplate). There are more details in that project's readme.

### The other way

1. In your terminal of choice, clone and navigate to `overlay/roll` in the repository.
2. `npm install` to install the requried node packages.
3. `npm run pack` to build the react app.
4. Copy the contents of the generated `overlay/roll/dist/` directory to `library/public/overlay/roll`.
5. Create a zip archive then add the `library` directory and the `events.json`, `library.json`, `LICENSE`,`mts_properties.json`, `README.md` files to the archive file.
6. Change the extension of the archive from `.zip` to `.mtlib`.

You can now import the `.mtlib` into MapTool.
