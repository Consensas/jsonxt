/**
 *  lib/urn.csv.js
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

const _util = require("./_util")

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

/**
 */
const csv = compressed => {
    const jsonxt = require("..")

    const xt = compressed["@xt"]
    if (!_util.isString(xt)) {
        return null
    }

    for (let key of _util.keys(compressed)) {
        if (!key.match(/^([A-Za-z]|@xt)$/)) {
            return null
        }
    }

    const parts = []
    if (_util.isQuotable(xt)) {
        parts.push(
            _util.encode(
                _util.quote(xt.replace(/^https:[/][/]/, ""))
            )
        )
    } else {
        parts.push(
            _util.encode(
                xt.replace(/^https:[/][/]/, "")
            )
        )
    }

    for (let li = 0; li < letters.length; li++) {
        const value = compressed[letters[li]]

        if (_util.isNull(value)) {
            parts.push("null")
        } else if (_util.isBoolean(value)) {
            parts.push(value ? "true" : "false")
        } else if (_util.isNumber(value)) {
            parts.push(_util.encode(`${value}`))
        } else if (_util.isQuotable(value)) {
            parts.push(_util.encode(_util.quote(value)))
        } else if (_util.isString(value)) {
            parts.push(value)
        } else if (_util.isUndefined(value)) {
            parts.push("")
        } else {
            return null
        }
    }

    return "jxt:c:" + parts.join("/").replace(/[/]*$/, "")
}

/**
 */
csv.unpack = urn => {
    // required lead
    if (!urn.startsWith("jxt:@")) {
        return null
    }

    urn = urn.substring(5)

    const parts = []
    while (urn.length) {
        if (urn[0] === ",") {
            parts.push(undefined)
            urn = urn.substring(1)
            continue
        }

        let pi = 0

        if (urn[0] === '"') {
            for (pi = 1; pi < urn.length; pi++) {
                if ((urn[pi] === '"') && (urn[pi + 1] !== '"')) {
                    break
                }
            }

            pi ++
            parts.push(_util.unquote(_util.decode(urn.substring(0, pi))))
        } else {
            for (pi = 1; pi < urn.length; pi++) {
                if (urn[pi] === ',') {
                    break
                }
            }

            parts.push(_util.unstring(_util.decode(urn.substring(0, pi))))
        }

        if (urn[pi] === ",") {
            pi++
        }

        urn = urn.substring(pi)
    }

    let xt = parts.shift()
    if (xt && xt.startsWith("//")) {
        xt = "https:" + xt
    }

    const d = {
        "@xt": xt,
    }

    for (let li = 0; li < parts.length && li < letters.length; li++) {
        if (!_util.isUndefined(parts[li])) {
            d[letters[li]] = parts[li]
        }
    }

    return d
}

/**
 */
exports.urn = {
    csv: csv,
}
