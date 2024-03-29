/*
 *  lib/encoders/boolean.js
 *
 *  Vitor Pamplona
 *  PathCheck Foundation
 *  2021-06-01
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
const NAME = "boolean"

/* istanbul ignore next */
exports.encode = (rule, value) => {
    const jsonxt = require("..")

    if (_util.isNull(value)) {
        return rule.NULL || jsonxt.ENCODE.NULL
    } else if (_util.isUndefined(value)) {
        return rule.UNDEFINED || jsonxt.ENCODE.UNDEFINED
    } else if (typeof value != "boolean") {
        throw new Error(`${NAME}: expected value to be boolean (got "${value}")`)
    }

    return value ? "1" : "0";
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
    }

    return value === "1";
}

exports.schema = {
    type: "boolean",
}
