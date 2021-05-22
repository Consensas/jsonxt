/*
 *  test/coders/did.js
 *
 *  Vitor Pamplona
 *  PathCheck Foundation
 *  2021-03-30
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
const jsonxt = require("../..")
const _util = require("./../_util")
const assert = require("assert")

describe("coders/did:web", function() {
    before(function() {
        _util.shims_on()
    })

    after(function() {
        _util.shims_off()
    })

    const rule_simple = {
    }

    it("works - simple did:web", function() {
        const start = "did:web:example:test#web"
        const got_encoded = jsonxt.encoders["did:web"](rule_simple, start)
        const got_decoded = jsonxt.decoders["did:web"](rule_simple, got_encoded)
        const want = "example%3Atest%23web"

        assert.strictEqual(got_encoded, want)
        assert.strictEqual(got_decoded, start)
    })

})
