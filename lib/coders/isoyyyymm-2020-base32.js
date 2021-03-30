/*
 *  lib/encoders/isoyyyymm-2020-base32.js
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
const NAME = "isoyyyymm-2020-base32"

/**
 *  Encode YYYY-MM dates relative to 2020 (e.g. Expiry Dates)
 *  as a Base 32 Integer
 */
exports.encode = (rule, value) => {
    const jsonxt = require("..")

    if (_util.isNull(value)) {
        return rule.NULL || jsonxt.ENCODE.NULL
    } else if (_util.isUndefined(value)) {
        return rule.UNDEFINED || jsonxt.ENCODE.UNDEFINED
    } else if (!_util.isString(value)) {
        throw new Error(`${NAME}: expected value to be string`)
    }

    if (!value.match(/^\d\d\d\d-\d\d$/)) {
        throw new Error(`${NAME}: unexpected value="${value}"`)
    }

    const date = new Date(value + "-01T12:00:00Z")
    
    return _util.integer_to_base32(
        (date.getFullYear() - 2020) * 100 +
        date.getMonth()
    )
}

/**
 */
exports.decode = (rule, value) => {
    const jsonxt = require("..")

    if ((value === rule.NULL) || (value === jsonxt.ENCODE.NULL)) {
        return null
    } else if ((value === rule.UNDEFINED) || (value === jsonxt.ENCODE.UNDEFINED)) {
        return undefined
    }

    const i = _util.base32_to_integer(value)

    const yyyy = Math.floor(i / 100) % 100 + 2020
    const mm = i % 100 + 1

    return [
        `${yyyy}`.padStart(4, "0"),
        `${mm}`.padStart(2, "0"),
    ].join("-")
}
