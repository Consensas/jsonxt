/*
 *  lib/encoders/uuid-base32.js
 *
 *  Vitor Pamplona
 *  PathCheck Foundation
 *  2021-03-16
 *
 *  Copyright (2013-2021) Consensas
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

"use strict"

const _util = require("../_util")
const NAME = "uuid-base32"
const Base32 = require("base32url")


function validate(uuid) {
  return typeof uuid === 'string' && /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i.test(uuid);
}

function parse(uuid) {
  if (!validate(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16);

  // Parse ########-....-....-....-............
  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = (v >>> 16) & 0xff;
  arr[2] = (v >>> 8) & 0xff;
  arr[3] = v & 0xff;

  // Parse ........-####-....-....-............
  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff;

  // Parse ........-....-####-....-............
  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff;

  // Parse ........-....-....-####-............
  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff;

  // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)
  arr[10] = ((v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000) & 0xff;
  arr[11] = (v / 0x100000000) & 0xff;
  arr[12] = (v >>> 24) & 0xff;
  arr[13] = (v >>> 16) & 0xff;
  arr[14] = (v >>> 8) & 0xff;
  arr[15] = v & 0xff;

  return arr;
}

const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (
    byteToHex[arr[offset + 0]] +
    byteToHex[arr[offset + 1]] +
    byteToHex[arr[offset + 2]] +
    byteToHex[arr[offset + 3]] +
    '-' +
    byteToHex[arr[offset + 4]] +
    byteToHex[arr[offset + 5]] +
    '-' +
    byteToHex[arr[offset + 6]] +
    byteToHex[arr[offset + 7]] +
    '-' +
    byteToHex[arr[offset + 8]] +
    byteToHex[arr[offset + 9]] +
    '-' +
    byteToHex[arr[offset + 10]] +
    byteToHex[arr[offset + 11]] +
    byteToHex[arr[offset + 12]] +
    byteToHex[arr[offset + 13]] +
    byteToHex[arr[offset + 14]] +
    byteToHex[arr[offset + 15]]
  ).toLowerCase();

  // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields
  if (!validate(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

/**
 */
exports.encode = (rule, value) => {
    const jsonxt = require("..")

    if (_util.isNull(value)) {
        return rule.NULL || jsonxt.ENCODE.NULL
    } else if (_util.isUndefined(value)) {
        return rule.UNDEFINED || jsonxt.ENCODE.UNDEFINED
    } else if (!_util.isString(value)) {
        throw new Error(`${NAME}: expected value to be string for ${rule.path} (got "${value}")`)
    }

    const _encoder = s => Base32.encode(parse(s))

    if (rule.compact && (rule.compact.indexOf(value) > -1)) {
        return jsonxt.ENCODE.ESCAPE + _util.integer_to_base32(rule.compact.indexOf(value))
    }

    if (rule.prefix) {
        for (let pi = 0; pi < rule.prefix.length && pi < 32; pi++) {
            const prefix = rule.prefix[pi]
            if (!value.startsWith(prefix)) {
                continue
            }

            return jsonxt.ENCODE.ESCAPE + _util.integer_to_base32(pi) + _encoder(value.substring(prefix.length))
        }
    }

    if (value === "") {
        return rule.EMPTY_STRING || jsonxt.ENCODE.EMPTY_STRING
    } else if (value.startsWith(jsonxt.ENCODE.ESCAPE)) {
        return jsonxt.ENCODE.ESCAPE + jsonxt.ENCODE.ESCAPE + _encoder(value.substring(1))
    } else {
        return _encoder(value)
    }
}

/**
 */
exports.decode = (rule, value) => {
    const jsonxt = require("..")

    if ((value === rule.NULL) || (value === jsonxt.ENCODE.NULL)) {
        return null
    } else if ((value === rule.UNDEFINED) || (value === jsonxt.ENCODE.UNDEFINED)) {
        return undefined
    } else if ((value === rule.EMPTY_STRING) || (value === jsonxt.ENCODE.EMPTY_STRING)) {
        return ""
    }

    const _decoder = s => stringify(Base32.decode(s))

    if (value.startsWith(jsonxt.ENCODE.ESCAPE)) {
        if (value[1] === jsonxt.ENCODE.ESCAPE) {
            value = value.substring(2)
            value = jsonxt.ENCODE.ESCAPE + _decoder(value)
        } else {
            if (rule.compact) {
                const index = _util.base32_to_integer(value.substring(1))
                if ((index >= 0) && (index < rule.compact.length)) {
                    return rule.compact[index]
                }
            } else if (rule.prefix) {
                const index = _util.base32_to_integer(value.substring(1, 2))
                if ((index >= 0) && (index < rule.prefix.length)) {
                    return rule.prefix[index] + _decoder(value.substring(2))
                }
            }
            
            throw new Error(`did not understand escape sequence for "${rule.path}" "${value}"`)
        }
    } else {
        value = _decoder(value)
    }

    return value
}

exports.schema = {
    type: "string",
}
