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
    require("./unpack"),
    require("./resolve"),
    {
        resolvers: require("./resolvers"),
        schemas: {},
        encoders: {
            "integer-base32": require("./coders/integer-base32").encode,
            "float-string": require("./coders/float-string").encode,
            "boolean": require("./coders/boolean").encode,
            "isodate-1900-base32": require("./coders/isodate-1900-base32").encode,
            "isodatetime-epoch-base32": require("./coders/isodatetime-epoch-base32").encode,
            "isoyyyymm-2020-base32": require("./coders/isoyyyymm-2020-base32").encode,
            "json": require("./coders/json").encode,
            "string-base32": require("./coders/string-base32").encode,
            "uuid-base32": require("./coders/uuid-base32").encode,
            "intstr-base32": require("./coders/intstr-base32").encode,
            "hex-base32": require("./coders/hex-base32").encode,
            "ascii-base32": require("./coders/ascii-base32").encode,
            "base64-base32": require("./coders/base64-base32").encode,
            "multibase-base36": require("./coders/multibase-base36").encode,
            "string": require("./coders/string").encode,
        },
        decoders: {
            "integer-base32": require("./coders/integer-base32").decode,
            "float-string": require("./coders/float-string").decode,
            "boolean": require("./coders/boolean").decode,
            "isodate-1900-base32": require("./coders/isodate-1900-base32").decode,
            "isodatetime-epoch-base32": require("./coders/isodatetime-epoch-base32").decode,
            "isoyyyymm-2020-base32": require("./coders/isoyyyymm-2020-base32").decode,
            "json": require("./coders/json").decode,
            "string-base32": require("./coders/string-base32").decode,
            "uuid-base32": require("./coders/uuid-base32").decode,
            "intstr-base32": require("./coders/intstr-base32").decode,
            "hex-base32": require("./coders/hex-base32").decode,
            "ascii-base32": require("./coders/ascii-base32").decode,
            "base64-base32": require("./coders/base64-base32").decode,
            "multibase-base36": require("./coders/multibase-base36").decode,
            "string": require("./coders/string").decode,
        },
    }
)

module.exports.ENCODE = {
    ESCAPE: "$",
    SPACE: "+",
    TERM_INDEX: "*",
    UNDEFINED: "",
    EMPTY_STRING: "$",
    NULL: "$.",
}
