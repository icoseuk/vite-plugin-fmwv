import { defineConfig } from 'vite';
import { fileMakerWebViewerPlugin } from '../src/index';
import { reportingScript } from './src/scripts/handlers';
import { addExclamationMarkScript, addExclamationMarkScriptWithAlert } from './src/scripts/triggers';

export default defineConfig({
    root: __dirname,
    plugins: [
        fileMakerWebViewerPlugin({
            triggerScripts: [
                {
                    label: 'Add an exclamation mark',
                    function: addExclamationMarkScript
                },
                {
                    label: 'Add an exclamation mark with alert',
                    function: addExclamationMarkScriptWithAlert
                }
            ],
            handlerScripts: [
                {
                    name: 'Report on something',
                    function: reportingScript
                }
            ]
        })
    ]
});