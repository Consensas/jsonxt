/*
 *  lib/encoders/did.uvci.js
 *
 *  Vitor Pamplona
 *  PathCheck Foundation
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
const NAME = "urn:uvci"

const prefix = "urn:uvci:";

/**
 */
exports.encode = (rule, value) => {
    return _util.prefixRemoverEncode(rule, value, prefix);
}

/**
 */
exports.decode = (rule, value) => {
    return _util.prefixRemoverDecode(rule, value, prefix);
}

exports.schema = {
    type: "string",
}
