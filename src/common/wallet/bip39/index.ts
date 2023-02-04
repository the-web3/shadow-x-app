import { Buffer } from 'buffer'
import createHash from 'create-hash'
import pbkdf2_1 from 'pbkdf2'
import randomBytes from './randombytes'
// import randomBytes from 'randombytes'
import * as _wordlists_1 from './_wordlists'
let DEFAULT_WORDLIST = _wordlists_1.default;
const INVALID_MNEMONIC = 'Invalid mnemonic';
const INVALID_ENTROPY = 'Invalid entropy';
const INVALID_CHECKSUM = 'Invalid mnemonic checksum';
const WORDLIST_REQUIRED = 'A wordlist is required but a default could not be found.\n' +
    'Please pass a 2048 word array explicitly.';
function pbkdf2Promise(password: Buffer, saltMixin: Buffer, iterations: number, keylen: number, digest: string): Promise<Buffer> {
    return Promise.resolve().then(() => new Promise((resolve, reject) => {
        const callback = (err: any, derivedKey: any) => {
            if (err) {
                return reject(err);
            }
            else {
                return resolve(derivedKey);
            }
        };
        pbkdf2_1.pbkdf2(password, saltMixin, iterations, keylen, digest, callback);
    }));
}
function normalize(str?: string) {
    return (str || '').normalize('NFKD');
}
function lpad(str: string, padString: string, length: number) {
    while (str.length < length) {
        str = padString + str;
    }
    return str;
}
function binaryToByte(bin: any) {
    return parseInt(bin, 2);
}
function bytesToBinary(bytes: any) {
    return bytes.map((x: any) => lpad(x.toString(2), '0', 8)).join('');
}
function deriveChecksumBits(entropyBuffer: Buffer) {
    const ENT = entropyBuffer.length * 8;
    const CS = ENT / 32;
    const hash = createHash('sha256')
        .update(entropyBuffer)
        .digest();
    return bytesToBinary(Array.from(hash as any)).slice(0, CS)
}
function salt(password?: string) {
    return 'mnemonic' + (password || '');
}

const mnemonicToSeedSync = (mnemonic: string, password?: string): Buffer =>{
    const mnemonicBuffer = Buffer.from(normalize(mnemonic), 'utf8');
    const saltBuffer = Buffer.from(salt(normalize(password)), 'utf8');
    return pbkdf2_1.pbkdf2Sync(mnemonicBuffer, saltBuffer, 2048, 64, 'sha512');
};
const mnemonicToSeed = (mnemonic: string, password?: string): Promise<Buffer>=>{
    return Promise.resolve().then(() => {
        const mnemonicBuffer = Buffer.from(normalize(mnemonic), 'utf8');
        const saltBuffer = Buffer.from(salt(normalize(password)), 'utf8');
        return pbkdf2Promise(mnemonicBuffer, saltBuffer, 2048, 64, 'sha512');
    });
};
const mnemonicToEntropy = (mnemonic: string, wordlist?: string[]): string=>{
    wordlist = wordlist || DEFAULT_WORDLIST;
    if (!wordlist) {
        throw new Error(WORDLIST_REQUIRED);
    }
    const words = normalize(mnemonic).split(' ');
    if (words.length % 3 !== 0) {
        throw new Error(INVALID_MNEMONIC);
    }
    // convert word indices to 11 bit binary strings
    const bits = words
        .map((word) => {
        const index = (wordlist as string[]).indexOf(word);
        if (index === -1) {
            throw new Error(INVALID_MNEMONIC);
        }
        return lpad(index.toString(2), '0', 11);
    })
        .join('');
    // split the binary string into ENT/CS
    const dividerIndex = Math.floor(bits.length / 33) * 32;
    const entropyBits = bits.slice(0, dividerIndex);
    const checksumBits = bits.slice(dividerIndex);
    // calculate the checksum and compare
    const entropyBytes = (entropyBits.match(/(.{1,8})/g)|| []).map(binaryToByte);
    if (entropyBytes.length < 16) {
        throw new Error(INVALID_ENTROPY);
    }
    if (entropyBytes.length > 32) {
        throw new Error(INVALID_ENTROPY);
    }
    if (entropyBytes.length % 4 !== 0) {
        throw new Error(INVALID_ENTROPY);
    }
    const entropy = Buffer.from(entropyBytes);
    const newChecksum = deriveChecksumBits(entropy);
    if (newChecksum !== checksumBits) {
        throw new Error(INVALID_CHECKSUM);
    }
    return entropy.toString('hex');
};
const entropyToMnemonic = (entropy: Buffer | string, wordlist?: string[]): string=>{
    if (!Buffer.isBuffer(entropy)) {
        entropy = Buffer.from(entropy, 'hex');
    }
    wordlist = wordlist || DEFAULT_WORDLIST;
    if (!wordlist) {
        throw new Error(WORDLIST_REQUIRED);
    }
    // 128 <= ENT <= 256
    if (entropy.length < 16) {
        throw new TypeError(INVALID_ENTROPY);
    }
    if (entropy.length > 32) {
        throw new TypeError(INVALID_ENTROPY);
    }
    if (entropy.length % 4 !== 0) {
        throw new TypeError(INVALID_ENTROPY);
    }
    const entropyBits = bytesToBinary(Array.from(entropy));
    const checksumBits = deriveChecksumBits(entropy);

    const bits = entropyBits + checksumBits;

    const chunks = bits.match(/(.{1,11})/g);

    const words = chunks.map((binary: any) => {
        const index = binaryToByte(binary);
        return (wordlist as string[])[index];
    });

    return wordlist[0] === '\u3042\u3044\u3053\u304f\u3057\u3093' // Japanese wordlist
        ? words.join('\u3000')
        : words.join(' ');
};
const generateMnemonic = (strength?: number, rng?: (size: number) => Buffer, wordlist?: string[]): string=>{
    strength = strength || 128;
    if (strength % 32 !== 0) {
        throw new TypeError(INVALID_ENTROPY);
    }
    // const bytes = Buffer.allocUnsafe(strength / 8)
    // console.log(rng, crypto.getRandomValues(bytes))
    rng = rng || randomBytes;
    return entropyToMnemonic((rng as (size: number) => Buffer)(strength / 8), wordlist);
};
const validateMnemonic = (mnemonic: string, wordlist?: string[]): boolean=>{
    try {
        mnemonicToEntropy(mnemonic, wordlist);
    }
    catch (e) {
        return false;
    }
    return true;
};
const setDefaultWordlist = (language: string): void =>{
    const result = _wordlists_1.wordlists[language];
    if (result) {
        DEFAULT_WORDLIST = result;
    }
    else {
        throw new Error('Could not find wordlist for language "' + language + '"');
    }
};
const getDefaultWordlist = (): string =>{
    if (!DEFAULT_WORDLIST) {
        throw new Error('No Default Wordlist set');
    }
    return Object.keys(_wordlists_1.wordlists).filter((lang) => {
        if (lang === 'JA' || lang === 'EN') {
            return false;
        }
        return _wordlists_1.wordlists[lang].every((word: any, index: number) => word === DEFAULT_WORDLIST[index]);
    })[0];

};
export const wordlists = _wordlists_1.wordlists
export {
    mnemonicToSeedSync,
    mnemonicToSeed,
    mnemonicToEntropy,
    entropyToMnemonic,
    generateMnemonic,
    validateMnemonic,
    setDefaultWordlist,
    getDefaultWordlist,
}
