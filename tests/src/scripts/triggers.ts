export function addExclamationMarkScript() {
    console.log('Trigger script executed');
    // @ts-expect-error - see index.html
    window.addExclamationMarks();
}

export function addExclamationMarkScriptWithAlert() {
    console.log('Trigger script executed');
    // @ts-expect-error - see index.html
    window.addExclamationMarks('Is this what you wanted?');
}
