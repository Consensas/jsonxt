/*
 *  lib/encoders/did.js
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
const NAME = "did"

const prefix = "did:";

/**
 */
exports.encode = (rule, value) => {
    const jsonxt = require("..")

    if (_util.isNull(value)) {
        return rule.NULL || jsonxt.ENCODE.NULL
    } else if (_util.isUndefined(value)) {
        return rule.UNDEFINED || jsonxt.ENCODE.UNDEFINED
    } else if (!value.startsWith(prefix)) {
        throw new Error(`${NAME}: expected value to be a ${prefix} (got "${value}")`)
    }

    if (value === "") {
        return rule.EMPTY_STRING || jsonxt.ENCODE.EMPTY_STRING
    } else if (value.startsWith(jsonxt.ENCODE.ESCAPE)) {
        return jsonxt.ENCODE.ESCAPE + jsonxt.ENCODE.ESCAPE + _util.encodeExtended(value.slice(prefix.length+1))
    } else {
        return _util.encodeExtended(value.slice(prefix.length))
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

    if (value.startsWith(jsonxt.ENCODE.ESCAPE)) {
        if (value[1] === jsonxt.ENCODE.ESCAPE) {
            value = value.substring(2)
            value = "~" + prefix+_util.decodeExtended(value)
        } else {
            value = value.substring(1)
            value = "~" + prefix+_util.decodeExtended(value)
        }
    } else {
        value = prefix+_util.decodeExtended(value)
    }

    return value
}

exports.schema = {
    type: "string",
}
