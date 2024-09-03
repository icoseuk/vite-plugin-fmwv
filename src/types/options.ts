interface PluginOptions {
    /**
     * The trigger scripts to be mocked.
     */
    triggerScripts?:
    Array<{
        /**
         * The label of the script trigger in the preview environment.
         */
        label: string,

        /**
         * The function to be called when the script is triggered.
         * 
         * Must make use of `window.someCustomFunction()` to interact with the app.
         */
        function: () => void
    }>
    ,
    /**
     * The handler scripts to be mocked.
     */
    handlerScripts?: Array<
        {
            /**
             * The name of the script as it should appear in the FileMaker Script Workspace.
             */
            name: string,

            /**
             * The function to be called when the script is triggered.
             *
             * @param script The name of the script.
             * @param parameter The optional string parameter passed to the script.
             * @param option A mock option parameter.
             * @see https://help.claris.com/en/pro-help/content/options-for-starting-scripts.html
             */
            function: (
                script: string,
                parameter?: string,
                option?: number // A mock option parameter
            ) => string
        }
    >
}

export default PluginOptions;