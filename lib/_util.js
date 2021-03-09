/**
 *  lib/_util.js
 *
 *  David Janes
 *  Consensas
 *  2021-03-09
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

const _ = require("lodash")

/**
 */
const split = key => key.split(".")

/**
 */
const get = (d, key) => {
    const parts = split(key)

    while (parts.length && _.isPlainObject(d)) {
        d = d[parts.shift()]
    }

    return d
}

/**
 */
const encode = s => encodeURI(s).replace(/%22/g, '"')

/**
 */
const isQuotable = s => {
    if (!_.isString(s)) {
        return false
    } else if (s.indexOf('"') > -1) {
        return true
    } else if (s.match(/^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/)) {
        return true
    } else {
        return false
    }
}

/**
 */
const quote = s => {
    return `"${s.replace(/[\"]/g, '""')}"`
}

/**
 *  API
 */
exports.split = split
exports.get = get
exports.isQuotable = isQuotable
exports.quote = quote
exports.encode = encode
