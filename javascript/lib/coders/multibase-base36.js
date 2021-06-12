/*
 *  lib/encoders/multibase-base36.js
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
const NAME = "multibase-base36"

const multibase = require('multibase')

const textDecoder = new TextDecoder();

const decodeText = (bytes) => textDecoder.decode(bytes)

/**
 *  TESTING ONLY (for now, anyway)
 */
/* istanbul ignore next */
exports.encode = (rule, value) => {
    const jsonxt = require("..")

    if (_util.isNull(value)) {
        return rule.NULL || jsonxt.ENCODE.NULL
    } else if (_util.isUndefined(value)) {
        return rule.UNDEFINED || jsonxt.ENCODE.UNDEFINED
    } else if (!_util.isString(value)) {
        throw new Error(`${NAME}: expected value to be string (got "${value}")`)
    }

    // decodes a base, adds the base representation to the first char of the decoded array, encode in base36 and then remove the Base36 marker
    const _encoder = mBase => {
        let bytes = multibase.decode(mBase);
        let enc_bytes = new Uint8Array(bytes.length+1);
        enc_bytes.set(new  Uint8Array([mBase.charCodeAt(0)]), 0);
        enc_bytes.set(bytes, 1);
        return decodeText(multibase.encode('base36upper', enc_bytes)).substring(1)
    }

    if (value === "") {
        return rule.EMPTY_STRING || jsonxt.ENCODE.EMPTY_STRING
    } else if (value.startsWith(jsonxt.ENCODE.ESCAPE)) {
        return jsonxt.ENCODE.ESCAPE + jsonxt.ENCODE.ESCAPE + _encoder(`${value}`)
    } else {
        return _encoder(`${value}`)
    }
}

/**
 */
/* istanbul ignore next */
exports.decode = (rule, value) => {
    const jsonxt = require("..")

    if ((value === rule.NULL) || (value === jsonxt.ENCODE.NULL)) {
        return null
    } else if ((value === rule.UNDEFINED) || (value === jsonxt.ENCODE.UNDEFINED)) {
        return undefined
    } else if ((value === rule.EMPTY_STRING) || (value === jsonxt.ENCODE.EMPTY_STRING)) {
        return ""
    }

    // adds Base36 identifier, decodes Base36, removes first byte and turns into the representation to encode in the original form. 
    const _decoder = base36 => {
        let decodedArray = multibase.decode("K"+base36);
        let encodeTo = decodedArray[0];
        let base = decodedArray.slice(1);
        return decodeText(multibase.encode(String.fromCharCode(encodeTo), base));
    }

    if (value.startsWith(jsonxt.ENCODE.ESCAPE)) {
        if (value[1] === jsonxt.ENCODE.ESCAPE) {
            value = value.substring(2)
            value = "$" + _decoder(`${value}`)
        } else {
            value = value.substring(1)
            value = "$" + _decoder(`${value}`)
        }
    } else {
        value = _decoder(`${value}`)
    }

    return value
}

exports.schema = {
    type: "multibase-base36",
}
