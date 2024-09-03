import { Plugin } from "vite";
import PluginOptions from "./src/types/options";

/**
 * The Vite plugin for mocking a FileMaker Web Viewer environment.
 * 
 * @param options The plugin options.
 */
export default function filemakerWebViewerPlugin(options: PluginOptions = {}): Plugin {
    return {
        name: 'vite-plugin-fmwv',
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                next();
            });
        },
        transformIndexHtml(html) {
            const triggerScripts = options.triggerScripts || [];
            const handlerScripts = options.handlerScripts || [];

            const scriptInjection = `
                <script>
                    window.FileMaker = {
                        PerformScript: function(script, parameter) {
                            const handler = window.__fmwv__mockHandlerScripts.find(h => h.name === script);
                            if (handler) {
                                handler.function(script, parameter);
                            } else {
                                console.warn('No handler script found for:', script);
                            }
                        },
                        PerformScriptWithOption: function(script, parameter, option) {
                            const handler = window.__fmwv__mockHandlerScripts.find(h => h.name === script);
                            if (handler) {
                                handler.function(script, parameter, option);
                            } else {
                                console.warn('No handler script found for:', script);
                            }
                        }
                    };
                    window.__fmwv__mockTriggerScripts = [];
                    window.__fmwv__mockHandlerScripts = [];

                    ${triggerScripts.map(script => `
                        window.__fmwv__mockTriggerScripts.push({
                            label: '${script.label}',
                            function: ${script.function.toString()}
                        });
                        window['${script.function.name}'] = ${script.function.toString()};
                    `).join('')}

                    ${handlerScripts.map(script => `
                        window.__fmwv__mockHandlerScripts.push({
                            name: '${script.name}',
                            function: ${script.function.toString()}
                        });
                        window['${script.function.name}'] = ${script.function.toString()};
                    `).join('')}
                </script>
                <div id="mock-buttons">
                <h2>Mock FileMaker Scripts:</h2>
                    ${triggerScripts.map(script => `
                        <button onclick="window.${script.function.name}()">${script.label}</button>
                    `).join('')}
                </div>
            `;

            const styleInjection = `
                <style>
                    #mock-buttons {
                        all: none;
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        background-color: #000;
                        color: #fff;
                        padding: 1rem;
                        display: flex;
                        justify-content: center;
                    }
                    #mock-buttons button {
                        margin: 0 0.5rem;
                        padding: 0.5rem 1rem;
                        background-color: #fff;
                        color: #000;
                        border: none;
                        border-radius: 0.25rem;
                        cursor: pointer;
                    }
                    #mock-buttons button:hover {
                        background-color: #000;
                        color: #fff;
                    }
                    #mock-buttons h2 {
                        font-size: 1rem;
                        font-family: sans-serif !important;
                    }
                </style>
            `;

            return html.replace(
                '<body>',
                `<body>${scriptInjection}`
            ).replace(
                '</head>',
                `${styleInjection}</head>`
            );
        }
    };
}