import util = require('util');

// Helpers for markdown formating messages

export const smallCodeblock = (str: string) => 

    '`' + str + '`';

export const largeCodeblock = (str: string, type: string = '') => 

    '```' + type + '\n' + str + '```\n';

export const inspectCodeblock = (value: any) =>

    largeCodeblock(
        util.inspect(value, {
            compact: false,
        }),
        'ts',
    );
