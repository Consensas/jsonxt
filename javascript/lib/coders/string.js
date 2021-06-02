/*
 *  lib/encoders/string.js
 *
 *  David Janes
 *  Consenas
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
const NAME = "string"

/*
  {
    // required
    "encoder": "string"

    // optional
    UNDEFINED: ""       -- how to encode "undefined"
    EMPTY_STRING: "~"   -- how to encode the empty string
    NULL: "~."          -- how to encode "null"

    escape: " "         -- the character to encode as "~"
    compact: []         -- essential, an enumeration, these will be encode as "~BASE32_INDEX"
    prefix: []          -- an enumeration of prefixes, these will be encoded as "~BASE32_INDEX" 
                           but maximum 32 prefixes; cannot be mixed with compact
  },
*/

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

    const _encoder = s => _util.encodeExtended(s, _util.percentEncode(rule.escape || " "))

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

    const _decoder = s => _util.decodeExtended(s, _util.percentEncode(rule.escape || " "))

    if (value.startsWith(jsonxt.ENCODE.ESCAPE)) {
        if (value[1] === jsonxt.ENCODE.ESCAPE) {
            value = value.substring(2)
            value = jsonxt.ENCODE.ESCAPE + _decoder(value)
        } else {
            if (rule.compact) {
                const index = _util.integer_to_base32(value.substring(1))
                if ((index >= 0) && (index < rule.compact.length)) {
                    return rule.compact[index]
                }
            } else if (rule.prefix) {
                const index = _util.integer_to_base32(value.substring(1, 2))
                if ((index >= 0) && (index < rule.prefix.length)) {
                    return rule.prefix[index] + _decoder(value.substring(2))
                }
            }
            
            throw new Error(`did not understand escape sequence "${value}"`)
        }
    } else {
        value = _decoder(value)
    }

    return value
}

exports.schema = {
    type: "string",
}
