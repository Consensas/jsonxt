/*
 *  lib/encoders/string-base32.js
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
const NAME = "string-base32"

/**
 *  TESTING ONLY (for now, anyway)
 */
exports.encode = (rule, value) => {
    return require("hi-base32").encode(`${value}`).replace(/=*$/, "")
}

/**
 */
exports.decode = (rule, value) => {
    throw new Error(`${NAME}: not implemented`)
}
