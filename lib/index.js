/*
 *  lib/index.js
 *
 *  David Janes
 *  Consenas
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

module.exports = Object.assign(
    {},
    require("./pack"),
    {
        encoders: {
            "isodate-1900-base32": require("./encoders/isodate-1900-base32").encode,
            "isodatetime-epoch-base32": require("./encoders/isodatetime-epoch-base32").encode,
            "isoyyyymm-2020-base32": require("./encoders/isoyyyymm-2020-base32").encode,
            "md5-base32": require("./encoders/md5-base32").encode,
            "string-base32": require("./encoders/string-base32").encode,
            "string": require("./encoders/string").encode,
            "integer": require("./encoders/integer").encode,
            "integer-base32": require("./encoders/integer-base32").encode,
        },
        decoders: {
            "isodate-1900-base32": require("./encoders/isodate-1900-base32").decode,
            "isodatetime-epoch-base32": require("./encoders/isodatetime-epoch-base32").decode,
            "isoyyyymm-2020-base32": require("./encoders/isoyyyymm-2020-base32").decode,
            "md5-base32": require("./encoders/md5-base32").decode,
            "string-base32": require("./encoders/string-base32").decode,
            "string": require("./encoders/string").decode,
            "integer": require("./encoders/integer").decode,
            "integer-base32": require("./encoders/integer-base32").decode,
        },
    }
)
