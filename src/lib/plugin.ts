import { Plugin } from "vite";
import PluginOptions from "../types/options";
import information from "../../package.json";

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

                    function __fmwv__toggleContainer() {
                        let container = document.getElementById('fmwv--container');
                        container.classList.toggle('closed');

                        let button = document.querySelector('#fmwv--header button');
                        button.innerText = container.classList.contains('closed') ? 'Open' : 'Close';
                    }
                </script>
                <div id="fmwv--container" class="${!triggerScripts.length ? 'hidden' : ''}">
                    <div id="fmwv--header">
                        <h2>FileMaker Scripts</h2>
                        <button onclick="__fmwv__toggleContainer()">Close</button>
                    </div>
                    <div id="fmwv--trigger-scripts">
                        ${triggerScripts.map(script => `
                            <button onclick="window.${script.function.name}()">${script.label}</button>
                        `).join('')}
                    </div>
                    <div id="fmwv--information">
                        vite-plugin-fmwv v${information.version}
                    </div>
                </div>
            `;

            const styleInjection = `
                <style>
                    #fmwv--container.hidden {
                        display: none;
                    }

                    #fmwv--container {
                        all: none;
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        background-color: #000;
                        color: #fff;
                        padding: 1rem;
                        gap: 0.5rem;
                        font-family: sans-serif !important;
                        border-radius: 0.5rem 0.5rem 0 0;
                    }

                    #fmwv--container #fmwv--header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        gap: 0.5rem;
                    }

                    #fmwv--container #fmwv--trigger-scripts {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 0.5rem;
                        align-items: center;
                        }

                    #fmwv--container #fmwv--information {
                        width: 100%;
                        text-align: right;
                        opacity: 0.5;
                        font-size: 0.75rem;
                    }

                    #fmwv--container button {
                        padding: 0.5rem 1rem;
                        background-color: #fff;
                        color: #000;
                        border: none;
                        border-radius: 0.25rem;
                        cursor: pointer;
                    }

                    #fmwv--container h2 {
                        font-size: 1rem;
                    }

                    #fmwv--container.closed {
                        padding: 0 0.5rem;
                    }

                    #fmwv--container.closed  #fmwv--trigger-scripts,
                    #fmwv--container.closed  #fmwv--information  {
                        display: none;
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