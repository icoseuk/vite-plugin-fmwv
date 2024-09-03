export function reportingScript(script, parameter, option = 0) {
    window.alert('I am FileMaker and I am reporting on something: ' + parameter);
    return 'I just reported.';
}