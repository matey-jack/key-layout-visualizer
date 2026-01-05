import { msKlcScancodes } from "../layout/ansiLayoutModel.ts";

export function getKlc(mergedMapping: string[][]): string {
    const middlePart: string[] = [];
    msKlcScancodes.forEach((row, rowIdx) => {
        row.forEach((sc, colIdx) => {
            if (typeof sc === "number") {
                const character = mergedMapping[rowIdx]?.[colIdx];
                const klcLine = character ? klcKeys[character as keyof typeof klcKeys] : undefined;
                if (klcLine) {
                    const scHex = sc.toString(16).toUpperCase().padStart(2, "0");
                    middlePart.push(scHex + "\t" + klcLine);
                }
            }
        });
    });
    return klcHeader + "\n" + middlePart.join("\n") + "\n" + klcFooter;
}

export const klcHeader = `
KBD\tUSANSI\t"US - ANSI - no AltGr"

COPYRIGHT\t"(c) 2026 Robert 'Jack' Will"

COMPANY\t"RJW"

LOCALENAME\t"en-US"

LOCALEID\t"00000409"

VERSION\t1.0

SHIFTSTATE

0\t//Column 4
1\t//Column 5 : Shft
2\t//Column 6 :       Ctrl

LAYOUT\t\t;an extra '@' at the end is a dead key

//SC\tVK_\t\tCap\t0\t1\t2
//--\t----\t\t----\t----\t----\t----
`

export const klcKeys = {
    "1": "1\t\t0\t1\t0021\t-1\t\t// DIGIT ONE, EXCLAMATION MARK, <none>",
    "2": "2\t\t0\t2\t0040\t-1\t\t// DIGIT TWO, COMMERCIAL AT, <none>",
    "3": "3\t\t0\t3\t0023\t-1\t\t// DIGIT THREE, NUMBER SIGN, <none>",
    "4": "4\t\t0\t4\t0024\t-1\t\t// DIGIT FOUR, DOLLAR SIGN, <none>",
    "5": "5\t\t0\t5\t0025\t-1\t\t// DIGIT FIVE, PERCENT SIGN, <none>",
    "6": "6\t\t0\t6\t005e\t-1\t\t// DIGIT SIX, CIRCUMFLEX ACCENT, <none>",
    "7": "7\t\t0\t7\t0026\t-1\t\t// DIGIT SEVEN, AMPERSAND, <none>",
    "8": "8\t\t0\t8\t002a\t-1\t\t// DIGIT EIGHT, ASTERISK, <none>",
    "9": "9\t\t0\t9\t0028\t-1\t\t// DIGIT NINE, LEFT PARENTHESIS, <none>",
    "0": "0\t\t0\t0\t0029\t-1\t\t// DIGIT ZERO, RIGHT PARENTHESIS, <none>",
    "-": "OEM_MINUS\t0\t002d\t005f\t-1\t\t// HYPHEN-MINUS, LOW LINE, <none>",
    "=": "OEM_PLUS\t0\t003d\t002b\t-1\t\t// EQUALS SIGN, PLUS SIGN, <none>",
    "q": "Q\t\t1\tq\tQ\t-1\t\t// LATIN SMALL LETTER Q, LATIN CAPITAL LETTER Q, <none>",
    "w": "W\t\t1\tw\tW\t-1\t\t// LATIN SMALL LETTER W, LATIN CAPITAL LETTER W, <none>",
    "e": "E\t\t1\te\tE\t-1\t\t// LATIN SMALL LETTER E, LATIN CAPITAL LETTER E, <none>",
    "r": "R\t\t1\tr\tR\t-1\t\t// LATIN SMALL LETTER R, LATIN CAPITAL LETTER R, <none>",
    "t": "T\t\t1\tt\tT\t-1\t\t// LATIN SMALL LETTER T, LATIN CAPITAL LETTER T, <none>",
    "y": "Y\t\t1\ty\tY\t-1\t\t// LATIN SMALL LETTER Y, LATIN CAPITAL LETTER Y, <none>",
    "u": "U\t\t1\tu\tU\t-1\t\t// LATIN SMALL LETTER U, LATIN CAPITAL LETTER U, <none>",
    "i": "I\t\t1\ti\tI\t-1\t\t// LATIN SMALL LETTER I, LATIN CAPITAL LETTER I, <none>",
    "o": "O\t\t1\to\tO\t-1\t\t// LATIN SMALL LETTER O, LATIN CAPITAL LETTER O, <none>",
    "p": "P\t\t1\tp\tP\t-1\t\t// LATIN SMALL LETTER P, LATIN CAPITAL LETTER P, <none>",
    "[": "OEM_4\t\t0\t005b\t007b\t001b\t\t// LEFT SQUARE BRACKET, LEFT CURLY BRACKET, ESCAPE",
    "]": "OEM_6\t\t0\t005d\t007d\t001d\t\t// RIGHT SQUARE BRACKET, RIGHT CURLY BRACKET, INFORMATION SEPARATOR THREE",
    "a": "A\t\t1\ta\tA\t-1\t\t// LATIN SMALL LETTER A, LATIN CAPITAL LETTER A, <none>",
    "s": "S\t\t1\ts\tS\t-1\t\t// LATIN SMALL LETTER S, LATIN CAPITAL LETTER S, <none>",
    "d": "D\t\t1\td\tD\t-1\t\t// LATIN SMALL LETTER D, LATIN CAPITAL LETTER D, <none>",
    "f": "F\t\t1\tf\tF\t-1\t\t// LATIN SMALL LETTER F, LATIN CAPITAL LETTER F, <none>",
    "g": "G\t\t1\tg\tG\t-1\t\t// LATIN SMALL LETTER G, LATIN CAPITAL LETTER G, <none>",
    "h": "H\t\t1\th\tH\t-1\t\t// LATIN SMALL LETTER H, LATIN CAPITAL LETTER H, <none>",
    "j": "J\t\t1\tj\tJ\t-1\t\t// LATIN SMALL LETTER J, LATIN CAPITAL LETTER J, <none>",
    "k": "K\t\t1\tk\tK\t-1\t\t// LATIN SMALL LETTER K, LATIN CAPITAL LETTER K, <none>",
    "l": "L\t\t1\tl\tL\t-1\t\t// LATIN SMALL LETTER L, LATIN CAPITAL LETTER L, <none>",
    ";": "OEM_1\t\t0\t003b\t003a\t-1\t\t// SEMICOLON, COLON, <none>",
    "'": "OEM_7\t\t0\t0027\t0022\t-1\t\t// APOSTROPHE, QUOTATION MARK, <none>",
    "`~": "OEM_3\t\t0\t0060\t007e\t-1\t\t// GRAVE ACCENT, TILDE, <none>",
    "\\": "OEM_5\t\t0\t005c\t007c\t001c\t\t// REVERSE SOLIDUS, VERTICAL LINE, INFORMATION SEPARATOR FOUR",
    "z": "Z\t\t1\tz\tZ\t-1\t\t// LATIN SMALL LETTER Z, LATIN CAPITAL LETTER Z, <none>",
    "x": "X\t\t1\tx\tX\t-1\t\t// LATIN SMALL LETTER X, LATIN CAPITAL LETTER X, <none>",
    "c": "C\t\t1\tc\tC\t-1\t\t// LATIN SMALL LETTER C, LATIN CAPITAL LETTER C, <none>",
    "v": "V\t\t1\tv\tV\t-1\t\t// LATIN SMALL LETTER V, LATIN CAPITAL LETTER V, <none>",
    "b": "B\t\t1\tb\tB\t-1\t\t// LATIN SMALL LETTER B, LATIN CAPITAL LETTER B, <none>",
    "n": "N\t\t1\tn\tN\t-1\t\t// LATIN SMALL LETTER N, LATIN CAPITAL LETTER N, <none>",
    "m": "M\t\t1\tm\tM\t-1\t\t// LATIN SMALL LETTER M, LATIN CAPITAL LETTER M, <none>",
    ",": "OEM_COMMA\t0\t002c\t003c\t-1\t\t// COMMA, LESS-THAN SIGN, <none>",
    ".": "OEM_PERIOD\t0\t002e\t003e\t-1\t\t// FULL STOP, GREATER-THAN SIGN, <none>",
    "/": "OEM_2\t\t0\t002f\t003f\t-1\t\t// SOLIDUS, QUESTION MARK, <none>",
    " ": "SPACE\t\t0\t0020\t0020\t0020\t\t// SPACE, SPACE, SPACE",
};

export const klcFooter = `
39\tSPACE\t\t0\t0020\t0020\t0020\t\t// SPACE, SPACE, SPACE
56\tOEM_102\t0\t005c\t007c\t001c\t\t// REVERSE SOLIDUS, VERTICAL LINE, INFORMATION SEPARATOR FOUR
53\tDECIMAL\t0\t002e\t002e\t-1\t\t// FULL STOP, FULL STOP, 


KEYNAME

01\tEsc
0e\tBackspace
0f\tTab
1c\tEnter
1d\tCtrl
2a\tShift
36\t"Right Shift"
37\t"Num *"
38\tAlt
39\tSpace
3a\t"Caps Lock"
3b\tF1
3c\tF2
3d\tF3
3e\tF4
3f\tF5
40\tF6
41\tF7
42\tF8
43\tF9
44\tF10
45\tPause
46\t"Scroll Lock"
47\t"Num 7"
48\t"Num 8"
49\t"Num 9"
4a\t"Num -"
4b\t"Num 4"
4c\t"Num 5"
4d\t"Num 6"
4e\t"Num +"
4f\t"Num 1"
50\t"Num 2"
51\t"Num 3"
52\t"Num 0"
53\t"Num Del"
54\t"Sys Req"
57\tF11
58\tF12
7c\tF13
7d\tF14
7e\tF15
7f\tF16
80\tF17
81\tF18
82\tF19
83\tF20
84\tF21
85\tF22
86\tF23
87\tF24

KEYNAME_EXT

1c\t"Num Enter"
1d\t"Right Ctrl"
35\t"Num /"
37\t"Prnt Scrn"
38\t"Right Alt"
45\t"Num Lock"
46\tBreak
47\tHome
48\tUp
49\t"Page Up"
4b\tLeft
4d\tRight
4f\tEnd
50\tDown
51\t"Page Down"
52\tInsert
53\tDelete
54\t<00>
56\tHelp
5b\t"Left Windows"
5c\t"Right Windows"
5d\tApplication

DESCRIPTIONS

0409\tUS - ANSI - no AltGr
LANGUAGENAMES

0409\tEnglish (United States)
ENDKBD
`