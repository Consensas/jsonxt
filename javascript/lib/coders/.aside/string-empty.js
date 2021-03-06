/*
 *  lib/encoders/string-empty.js
 *
 *  David Janes
 *  Consenas
 *  2021-03-19
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
const NAME = "string-empty"

/**
 *  Null and Undefined are coded as ""
 */
exports.encode = (rule, value) => {
    const jsonxt = require("..")

    if (_util.isNull(value)) {
        return ""
    } else if (_util.isUndefined(value)) {
        return ""
    } else if (!_util.isString(value)) {
        throw new Error(`${NAME}: expected value to be string (got "${value}")`)
    }

    value = _util.encodeExtended(value)

    return value
}

/**
 */
exports.decode = (rule, value) => {
    value = _util.decodeExtended(value)

    return value
}
