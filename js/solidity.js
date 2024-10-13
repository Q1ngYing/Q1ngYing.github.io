// common.js 的内容
function isNegativeLookbehindAvailable() {
    try {
        new RegExp('(?<!.)');
        return true;
    } catch (_) {
        return false;
    }
}

var SOL_NUMBER = {
    className: 'number',
    begin: /\b(0[xX][a-fA-F0-9_]+|[0-9_]+(\.[0-9_]+)?([eE][-+]?[0-9_]+)?)\b/,
    relevance: 0,
};

var HEX_APOS_STRING_MODE = {
    className: 'string',
    begin: "hex'",
    end: "'",
    contains: [hljs.BACKSLASH_ESCAPE],
};

var HEX_QUOTE_STRING_MODE = {
    className: 'string',
    begin: 'hex"',
    end: '"',
    contains: [hljs.BACKSLASH_ESCAPE],
};

// 复制其余 common.js 中的定义

var solAposStringMode = function (hljs) {
    return {
        className: 'string',
        begin: "'",
        end: "'",
        contains: [hljs.BACKSLASH_ESCAPE],
    };
};

var solQuoteStringMode = function (hljs) {
    return {
        className: 'string',
        begin: '"',
        end: '"',
        contains: [hljs.BACKSLASH_ESCAPE],
    };
};

// Solidity 语法高亮定义（来自 solidity.js）
function hljsDefineSolidity(hljs) {
    var SOL_APOS_STRING_MODE = solAposStringMode(hljs);
    var SOL_QUOTE_STRING_MODE = solQuoteStringMode(hljs);

    var SOL_KEYWORDS = {
        keyword:
            'var bool string int uint byte bytes fixed ufixed enum struct mapping address ' +
            'new delete if else for while continue break return throw emit try catch revert ' +
            'unchecked function modifier event constructor fallback receive error virtual override ' +
            'constant immutable anonymous indexed storage memory calldata external public internal payable pure view private returns ' +
            'import from as using global pragma contract interface library is abstract type assembly',
        literal:
            'true false wei gwei szabo finney ether seconds minutes hours days weeks years',
        built_in:
            'self this super selfdestruct suicide now msg block tx abi blockhash gasleft assert require Error Panic sha3 sha256 keccak256 ripemd160 ecrecover addmod mulmod log0 log1 log2 log3 log4'
    };

    var SOL_OPERATORS = {
        className: 'operator',
        begin: /[+\-!~*\/%<>&^|=]/
    };

    var SOL_LEXEMES_RE = /[A-Za-z_$][A-Za-z_$0-9]*/;

    var SOL_FUNC_PARAMS = {
        className: 'params',
        begin: /\(/, end: /\)/,
        excludeBegin: true,
        excludeEnd: true,
        lexemes: SOL_LEXEMES_RE,
        keywords: SOL_KEYWORDS,
        contains: [
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            SOL_APOS_STRING_MODE,
            SOL_QUOTE_STRING_MODE,
            SOL_NUMBER,
            'self'
        ]
    };

    return {
        aliases: ['sol'],
        keywords: SOL_KEYWORDS,
        lexemes: SOL_LEXEMES_RE,
        contains: [
            SOL_APOS_STRING_MODE,
            SOL_QUOTE_STRING_MODE,
            HEX_APOS_STRING_MODE,
            HEX_QUOTE_STRING_MODE,
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            SOL_NUMBER,
            SOL_OPERATORS,
            {
                className: 'function',
                lexemes: SOL_LEXEMES_RE,
                beginKeywords: 'function modifier event constructor fallback receive error', end: /[{;]/, excludeEnd: true,
                contains: [
                    hljs.TITLE_MODE,
                    SOL_FUNC_PARAMS,
                    hljs.C_LINE_COMMENT_MODE,
                    hljs.C_BLOCK_COMMENT_MODE
                ],
                illegal: /%/,
            }
        ],
        illegal: /#/,
    };
}

// Yul 语法高亮定义（来自 yul.js）
function hljsDefineYul(hljs) {
    var YUL_KEYWORDS = {
        keyword:
            'let function if switch case default for break continue leave not' +
            'object code data',
        built_in:
            'mstore mload sload sstore msize create call callcode delegatecall staticcall log0 log1 log2 log3 log4'
    };

    return {
        aliases: ['yul'],
        keywords: YUL_KEYWORDS,
        contains: [
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            solAposStringMode(hljs),
            solQuoteStringMode(hljs),
            SOL_NUMBER
        ]
    };
}

// 注册 Solidity 和 Yul 的语言支持
if (typeof module !== 'undefined' && module.exports) {
    module.exports = function (hljs) {
        hljs.registerLanguage('solidity', hljsDefineSolidity);
        hljs.registerLanguage('yul', hljsDefineYul);
    };
} else {
    hljs.registerLanguage('solidity', hljsDefineSolidity);
    hljs.registerLanguage('yul', hljsDefineYul);
}
