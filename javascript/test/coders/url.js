/*
 *  test/coders/url.js
 *
 *  David Janes
 *  Consenas.com
 *  2021-05-03
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

const fs = require("fs")
const path = require("path")
const assert = require("assert")

const _util = require("./../_util")
const { safeLoad } = require("js-yaml")

const WRITE = process.env.WRITE === "1"
const DUMP = process.env.DUMP === "1"

describe("coders/url", function() {
    before(function() {
        _util.shims_on()
    })

    after(function() {
        _util.shims_off()
    })

    const rule_simple = {
    }

    for (let [ start, want ] of [
        [ "https://google.ca", "~google.ca", ],
        [ "https://www.example.com/hello/world", "~www.example.com~hello~world", ],
        [ "HTTPS://google.ca", "HTTPS%3A~~google.ca", ],
        [ "weird:case idea/something", "weird%3Acase%20idea~something", ],
        [ "did:example:value", "did%3Aexample%3Avalue"],
        [ "", "~"],
        [ "~", "%7E"],
        [ null, "~." ],
        [ undefined, "" ],
    ]) {
        it(`coders/url: "${start}" -> "${want}"`, function() {
            const got_encoded = jsonxt.encoders.url(rule_simple, start)
            const got_decoded = jsonxt.decoders.url(rule_simple, got_encoded)
    
            if (DUMP) {
                console.log("")
                console.log("start:", start)
                console.log("encoded:", got_encoded)
            }
    
            assert.strictEqual(got_encoded, want)
            assert.strictEqual(got_decoded, start)

        })
    }

    it("expected fail - number", async function() {
        const start = 1

        await assert.rejects(async () => {
            const got_encoded = jsonxt.encoders.url(rule_simple, start)
        })
    })
    it("expected fail - number", function() {
        const start = 1

        assert.throws(() => {
            const got_encoded = jsonxt.encoders.url(rule_simple, start)
        })
    })
})
