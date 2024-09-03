# ⚡️ Vite &mdash; FileMaker Web Viewer

This is a Vite plugin that allows you to mock the FileMaker Web Viewer environment in your Vite project. ⚠️ __Note:__ This plugin is intended for development purposes only. It will not work in a production environment.

## Installation

```bash
npm install @icoseuk/vite-plugin-fmwv --save-dev
```

## Usage

Add the plugin to your `vite.config.js`:

```javascript

import { defineConfig } from 'vite'

import filemakerWebViewerPlugin from '@icoseuk/vite-plugin-fmwv'
import { 
    mockFileMakerHandlerScript,
    mockFileMakerTriggerScript
} from './src/test/scripts'

export default defineConfig({
    plugins: [
        filemakerWebViewerPlugin({
            triggerScripts: [
                {
                    label: 'mockFileMakerTriggerScript',
                    function: mockFileMakerTriggerScript
                }
            ],
            handlerScripts: [
                {
                    name: 'mockFileMakerScript',
                    function: mockFileMakerScript
                }
            ]
        })
    ]
)}
```

You can then run the `vite` command as usual, and any trigger scripts or handler scripts will be available in the preview environment. There are even buttons in the preview environment that allow you to run the mock trigger scripts.

### `triggerScripts`

This optional parameter is useful for mocking FileMaker scripts that are triggered by FileMaker and use the `Perform JavaScript in Web Viewer` script step to run JavaScript code in the Web Viewer.

An array of objects that will be available as mock scripts in the FileMaker Web Viewer environment. These functions should utilise globally available functions in the Web Viewer environment (`window.someCustomFunction()`).

### `handlerScripts`

This optional parameter is useful for mocking FileMaker scripts that are receiving data from the Web Viewer using the `FileMaker.PerformScriptWithOption( script, parameter, option )`, or `FileMaker.PerformScript( script, parameter )` functions.

An array of objects that will be available as mock scripts in the FileMaker Web Viewer environment. The type of the `function` property should be:

```typescript
function mockFileMakerScript(
    script: string, // The name of the script.
    parameter?: string, // The optional string parameter passed to the script.
    option?: number // A mock option parameter
): string
```

__Note:__ The `option` parameter is optional and defaults to `0`. It is related to how connected scripts behave, check out [Options for handling the current script when starting new scripts - Claris](https://help.claris.com/en/pro-help/content/options-for-starting-scripts.html) for more information.


## Example

Check out the `tests` directory for a simple example of how to use this plugin.

## License

