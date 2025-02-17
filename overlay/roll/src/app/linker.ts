import { has, startsWith } from 'lodash';

const NAKED_DIE = /(?<!\d)d/ig;
const LINKER_ID = 'linker';
const LIB_NAMESPACE = 'daedeross.roll';

export const MacroOutputs = ['self', 'gm', 'all', 'none', 'gm-self', 'list'];
export type MacroOutput = typeof MacroOutputs[number];

export function makeMacroLink(macroName: string, display: MacroOutput, args: any, target: string, lib_name: string = LIB_NAMESPACE, cachelib = false) {
    if (display == 'list' && !has(args, 'mlOutputList')) {
        throw new Error('args must contain "mlOutputList" if output is to be sent to "list".')
    }

    var stringArgs;
    if (typeof args === 'object' && args !== null) {
        stringArgs = JSON.stringify(args);
    }
    else {
        stringArgs = args;
    }

    return `macro://${macroName}@lib:${lib_name}/${display}/${(target || 'impersonated')}?${cachelib ? '' : 'cachelib=false&'}${encodeURIComponent(stringArgs)}`;
}

export function makeMacroLinkFromUri(macroUri: string, display: MacroOutput, args: any, target: string, cachelib = false) {
    if (display == 'list' && !has(args, 'mlOutputList')) {
        throw new Error('args must contain "mlOutputList" if output is to be sent to "list".')
    }

    var stringArgs;
    if (typeof args === 'object' && args !== null) {
        stringArgs = JSON.stringify(args);
    }
    else {
        stringArgs = args;
    }

    return `${macroUri}/${display}/${(target || 'impersonated')}?${cachelib ? '' : 'cachelib=false&'}${encodeURIComponent(stringArgs)}`;
}

export const executeMacroLink = (macroName: string, display: MacroOutput, args: any, target: string, lib_name: string = LIB_NAMESPACE, cachelib = false) => {
    executeUri(makeMacroLink(macroName, display, args, target, lib_name, cachelib));
}

export const executeUri = (uri: string) => {
    document.getElementById(LINKER_ID)?.setAttribute('href', uri);
    document.getElementById(LINKER_ID)?.click();
}

export const executeSilentMacro = (macroName: string, args: any, target: string) => {
    executeMacroLink(macroName, 'none', args, target);
}

const SIMPLE_ROLL_MACRO = 'doSimpleRoll';

export const doSimpleRoll = (expression: string) => {
    //const args = expression.replace(NAKED_DIE, () => '1d');
    let args = expression;
    if (startsWith(args, 'd')) {
        args = '1' + expression;
    }
    executeMacroLink(SIMPLE_ROLL_MACRO, 'all', args, 'impersonated');
}
