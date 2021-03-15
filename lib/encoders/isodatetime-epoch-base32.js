/*
 *  lib/encoders/isodatetime-epoch-base32.js
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
const NAME = "isodatetime-epoch-base32"

/**
 *  Encode full dates (to seconds, not milliseconds) relative 
 *  to the UNIX Epoch as a Base32 Integer
 */
exports.encode = (rule, value) => {
    if (!_util.isString(value)) {
        throw new Error(`${NAME}: expected value to be string`)
    }

    if (!value.match(/^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\dZ$/)) {
        throw new Error(`${NAME}: unexpected value="${value}"`)
    }

    const date = new Date(value)

    return _util.integer_to_base32(Math.round(date.getTime() / 1000))
}

/**
 */
exports.decode = (rule, value) => {
    const seconds = _util.base32_to_integer(value)
    const date = new Date(seconds * 1000)

    return date.toISOString().replace(/....Z$/, "Z")
}
