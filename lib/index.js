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
        encoders: {
            "isodate-1900-base32": require("./coders/isodate-1900-base32").encode,
            "isodatetime-epoch-base32": require("./coders/isodatetime-epoch-base32").encode,
            "isoyyyymm-2020-base32": require("./coders/isoyyyymm-2020-base32").encode,
            "md5-base32": require("./coders/md5-base32").encode,
            "string-base32": require("./coders/string-base32").encode,
            "string": require("./coders/string").encode,
            // "string-plus": require("./coders/string-plus").encode,
            "string-empty": require("./coders/string-empty").encode,
            "integer": require("./coders/integer").encode,
            "integer-base32": require("./coders/integer-base32").encode,
        },
        decoders: {
            "isodate-1900-base32": require("./coders/isodate-1900-base32").decode,
            "isodatetime-epoch-base32": require("./coders/isodatetime-epoch-base32").decode,
            "isoyyyymm-2020-base32": require("./coders/isoyyyymm-2020-base32").decode,
            "md5-base32": require("./coders/md5-base32").decode,
            "string-base32": require("./coders/string-base32").decode,
            "string": require("./coders/string").decode,
            // "string-plus": require("./coders/string-plus").decode,
            "string-empty": require("./coders/string-empty").decode,
            "integer": require("./coders/integer").decode,
            "integer-base32": require("./coders/integer-base32").decode,

            "pathcheck-numeric": require("./coders/pathcheck-numeric").decode,
            "pathcheck-string": require("./coders/pathcheck-string").decode,
            "pathcheck-shortstring": require("./coders/pathcheck-shortstring").decode,
        },
    }
)

module.exports.ENCODE = {
    ESCAPE: "~",
    BLANK: "~~",
    UNDEFINED: "",
    NULL: "~0",
}
