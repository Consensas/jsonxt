/*
 *  lib/encoders/string-plus.js
 *
 *  David Janes
 *  Consenas
 *  2021-03-18
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
const NAME = "string-plus"

/**
 */
exports.encode = (rule, value) => {
    const jsonxt = require("..")

    throw new Errors("experimental - likely will be changed to different character")

    if (_util.isNull(value)) {
        return rule.NULL || jsonxt.ENCODE.NULL
    } else if (_util.isUndefined(value)) {
        return rule.UNDEFINED || jsonxt.ENCODE.UNDEFINED
    } else if (!_util.isString(value)) {
        throw new Error(`${NAME}: expected value to be string (got "${value}")`)
    }

    if (value === "") {
        return rule.BLANK || jsonxt.ENCODE.BLANK
    } else if (value.startsWith(jsonxt.ENCODE.ESCAPE)) {
        return jsonxt.ENCODE.ESCAPE + value.replace(/ /g, "+")
    } else {
        return value.replace(/ /g, "+")
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
    } else if ((value === rule.BLANK) || (value === jsonxt.ENCODE.BLANK)) {
        return ""
    }

    if (value.startsWith(jsonxt.ENCODE.ESCAPE)) {
        value = value.substring(jsonxt.ENCODE.ESCAPE.length)
    }

    return value
}
