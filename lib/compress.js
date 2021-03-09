/**
 *  lib/compress.js
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
const _util = require("./_util")

/**
 */
const compress = (original, template) => {
    const jsonxt = require("..")

    const result = {
        "@xt": "",
    }
    const building = {}
    if (template[""]) {
        Object.assign(building, template[""])
    }

    _.mapValues(template, (to, key) => {
        if (key === "") {
            return
        }

        const original_value = _util.get(original, to)
        if (_.isUndefined(original_value)) {
            return
        }

        const building_value = _util.get(building, to)
        if (_.isEqual(building_value, original_value)) {
            return
        }

        result[key] = original_value
    })

    return result
}

/**
 */
exports.compress = compress
