import * as bip39 from '@scure/bip39';
import * as english from '@scure/bip39/wordlists/english';
import * as chinese_simplified from '@scure/bip39/wordlists/simplified-chinese';
import * as chinese_traditional from '@scure/bip39/wordlists/traditional-chinese';
import * as french from '@scure/bip39/wordlists/french';
import * as italian from '@scure/bip39/wordlists/italian';
import * as japanese from '@scure/bip39/wordlists/japanese';
import * as korean from '@scure/bip39/wordlists/korean';
import * as spanish from '@scure/bip39/wordlists/spanish';

export function generateMnemonic(params: any) {
    const  {number, language } = params
    if(!number && !language) throw new Error("Must have language and language");
    switch (language) {
        case 'chinese_simplified':
            if(number === 12) {
                return bip39.generateMnemonic(chinese_simplified.wordlist, 128);
            } else if(number === 15) {
                return bip39.generateMnemonic(chinese_simplified.wordlist, 160);
            } else if(number === 18) {
                return bip39.generateMnemonic(chinese_simplified.wordlist, 192);
            } else if(number === 21) {
                return bip39.generateMnemonic(chinese_simplified.wordlist, 224);
            } else if(number === 24) {
                return bip39.generateMnemonic(chinese_simplified.wordlist, 256);
            } else {
                throw new Error("Don't support this number");
            }
        case 'chinese_traditional':
            if(number === 12) {
                return bip39.generateMnemonic(chinese_traditional.wordlist, 128);
            } else if(number === 15) {
                return bip39.generateMnemonic(chinese_traditional.wordlist, 160);
            } else if(number === 18) {
                return bip39.generateMnemonic(chinese_traditional.wordlist, 192);
            } else if(number === 21) {
                return bip39.generateMnemonic(chinese_traditional.wordlist, 224);
            } else if(number === 24) {
                return bip39.generateMnemonic(chinese_traditional.wordlist, 256);
            } else {
                throw new Error("Don't support this number");
            }
        case 'english':
            if(number === 12) {
                return bip39.generateMnemonic(english.wordlist, 128);
            } else if(number === 15) {
                return bip39.generateMnemonic(english.wordlist, 160);
            } else if(number === 18) {
                return bip39.generateMnemonic(english.wordlist, 192);
            } else if(number === 21) {
                return bip39.generateMnemonic(english.wordlist, 224);
            } else if(number === 24) {
                return bip39.generateMnemonic(english.wordlist, 256);
            } else {
                throw new Error("Don't support this number");
            }
        case 'french':
            if(number === 12) {
                return bip39.generateMnemonic(french.wordlist, 128);
            } else if(number === 15) {
                return bip39.generateMnemonic(french.wordlist, 160);
            } else if(number === 18) {
                return bip39.generateMnemonic(french.wordlist, 192);
            } else if(number === 21) {
                return bip39.generateMnemonic(french.wordlist, 224);
            } else if(number === 24) {
                return bip39.generateMnemonic(french.wordlist, 256);
            } else {
                throw new Error("Don't support this number");
            }
        case 'italian':
            if(number === 12) {
                return bip39.generateMnemonic(italian.wordlist, 128);
            } else if(number === 15) {
                return bip39.generateMnemonic(italian.wordlist, 160);
            } else if(number === 18) {
                return bip39.generateMnemonic(italian.wordlist, 192);
            } else if(number === 21) {
                return bip39.generateMnemonic(italian.wordlist, 224);
            } else if(number === 24) {
                return bip39.generateMnemonic(italian.wordlist, 256);
            } else {
                throw new Error("Don't support this number");
            }
        case 'japanese':
            if(number === 12) {
                return bip39.generateMnemonic(japanese.wordlist, 128);
            } else if(number === 15) {
                return bip39.generateMnemonic(japanese.wordlist, 160);
            } else if(number === 18) {
                return bip39.generateMnemonic(japanese.wordlist, 192);
            } else if(number === 21) {
                return bip39.generateMnemonic(japanese.wordlist, 224);
            } else if(number === 24) {
                return bip39.generateMnemonic(japanese.wordlist, 256);
            } else {
                throw new Error("Don't support this number");
            }
        case 'korean':
            if(number === 12) {
                return bip39.generateMnemonic(korean.wordlist, 128);
            } else if(number === 15) {
                return bip39.generateMnemonic(korean.wordlist, 160);
            } else if(number === 18) {
                return bip39.generateMnemonic(korean.wordlist, 192);
            } else if(number === 21) {
                return bip39.generateMnemonic(korean.wordlist, 224);
            } else if(number === 24) {
                return bip39.generateMnemonic(korean.wordlist, 256);
            } else {
                throw new Error("Don't support this number");
            }
        case 'spanish':
            if(number === 12) {
                return bip39.generateMnemonic(spanish.wordlist, 128);
            } else if(number === 15) {
                return bip39.generateMnemonic(spanish.wordlist, 160);
            } else if(number === 18) {
                return bip39.generateMnemonic(spanish.wordlist, 192);
            } else if(number === 21) {
                return bip39.generateMnemonic(spanish.wordlist, 224);
            } else if(number === 24) {
                return bip39.generateMnemonic(spanish.wordlist, 256);
            } else {
                throw new Error("Don't support this number");
            }
        default:
            throw new Error("Temporarily does not support the situation you want");
    }
}

export function encodeMnemonic(params: any) {
    const {mnemonic, language } = params
    if(!mnemonic && !language) throw new Error("Must have mnemonic and language");
    switch (language) {
        case 'chinese_simplified':
            return bip39.mnemonicToEntropy(mnemonic, chinese_simplified.wordlist);
        case 'chinese_traditional':
            return bip39.mnemonicToEntropy(mnemonic, chinese_traditional.wordlist);
        case 'english':
            return bip39.mnemonicToEntropy(mnemonic, english.wordlist);
        case 'french':
            return bip39.mnemonicToEntropy(mnemonic, french.wordlist);
        case 'italian':
            return bip39.mnemonicToEntropy(mnemonic, italian.wordlist);
        case 'japanese':
            return bip39.mnemonicToEntropy(mnemonic, japanese.wordlist);
        case 'korean':
            return bip39.mnemonicToEntropy(mnemonic, korean.wordlist);
        case 'spanish':
            return bip39.mnemonicToEntropy(mnemonic, spanish.wordlist);
        default:
            throw new Error("Temporarily does not support the situation you want");
    }
}

export function decodeMnemonic(params: any) {
    const { encrytMnemonic, language } = params
    if(!encrytMnemonic && !language) throw new Error("Must have mnemonic and language");
    switch (language) {
        case 'chinese_simplified':
            return bip39.entropyToMnemonic(encrytMnemonic, chinese_simplified.wordlist);
        case 'chinese_traditional':
            return bip39.entropyToMnemonic(encrytMnemonic, chinese_traditional.wordlist);
        case 'english':
            return bip39.entropyToMnemonic(encrytMnemonic, english.wordlist);
        case 'french':
            return bip39.entropyToMnemonic(encrytMnemonic, french.wordlist);
        case 'italian':
            return bip39.entropyToMnemonic(encrytMnemonic, italian.wordlist);
        case 'japanese':
            return bip39.entropyToMnemonic(encrytMnemonic, japanese.wordlist);
        case 'korean':
            return bip39.entropyToMnemonic(encrytMnemonic, korean.wordlist);
        case 'spanish':
            return bip39.entropyToMnemonic(encrytMnemonic, spanish.wordlist);
        default:
            throw new Error("Temporarily does not support the situation you want");
    }
}

export function mnemonicToSeed (params: any){
    const { mnemonic, password } = params;
    if(!mnemonic ) throw new Error("Must have mnemonic");
    return bip39.mnemonicToSeedSync(mnemonic, password);
}

export function validateMnemonic(params: any) {
    const { mnemonic, language } = params;
    if(!mnemonic && !language ) throw new Error("Must have mnemonic and language");
    switch (language) {
        case 'chinese_simplified':
            return bip39.validateMnemonic(mnemonic, chinese_simplified.wordlist);
        case 'chinese_traditional':
            return bip39.validateMnemonic(mnemonic, chinese_traditional.wordlist);
        case 'english':
            return bip39.validateMnemonic(mnemonic, english.wordlist);
        case 'french':
            return bip39.validateMnemonic(mnemonic, french.wordlist);
        case 'italian':
            return bip39.validateMnemonic(mnemonic, italian.wordlist);
        case 'japanese':
            return bip39.validateMnemonic(mnemonic, japanese.wordlist);
        case 'korean':
            return bip39.validateMnemonic(mnemonic, korean.wordlist);
        case 'spanish':
            return bip39.validateMnemonic(mnemonic, spanish.wordlist);
        default:
            throw new Error("Temporarily does not support the situation you want");
    }
}
