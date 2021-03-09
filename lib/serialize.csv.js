/**
 *  lib/serialize.csv.js
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

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

/**
 */
const csv = compressed => {
    const jsonxt = require("..")

    if (!_.isString(compressed["@xt"])) {
        return null
    }

    for (let key of _.keys(compressed)) {
        if (!key.match(/^([A-Za-z]|@xt)$/)) {
            return null
        }
    }

    const parts = [ compressed["@xt"] ]
    for (let li = 0; li < letters.length; li++) {
        const value = compressed[letters[li]]

        if (_.isNull(value)) {
            parts.push("")
        } else if (_.isBoolean(value)) {
            parts.push(value ? "true" : "false")
        } else if (_.isNumber(value)) {
            parts.push(jsonxt.util.encode(`${value}`))
        } else if (jsonxt.util.isQuotable(value)) {
            parts.push(jsonxt.util.encode(jsonxt.util.quote(value)))
        } else if (_.isString(value)) {
            parts.push(value)
        } else if (_.isUndefined(value)) {
            parts.push("")
        } else {
            return null
        }
    }

    return "jxt:@" + parts.join(",").replace(/,*$/, "")
}

/**
 */
exports.serialize = {
    csv: csv,
}
