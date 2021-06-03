/*
 *  test/coders/isoyyyymm-2020-base32.js
 *
 *  David Janes
 *  Consenas.com
 *  2021-04-01
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

const WRITE = process.env.WRITE === "1"
const DUMP = process.env.DUMP === "1"

describe("coders/isoyyyymm-2020-base32", function() {
    before(function() {
        _util.shims_on()
    })

    after(function() {
        _util.shims_off()
    })

    const rule = {
    }

    for (let [ start, want ] of [
        [ "2021-03", "36", ],
        [ "2020-01", "0", ],
        [ "2001-01", "-1RC", ],
        [ "1985-01", "-3DC", ],
    ]) {
        it(`works - ${start}`, function() {
            const got_encoded = jsonxt.encoders["isoyyyymm-2020-base32"](rule, start)
            const got_decoded = jsonxt.decoders["isoyyyymm-2020-base32"](rule, got_encoded)

            if (DUMP) {
                console.log("")
                console.log("start:", start)
                console.log("encoded:", got_encoded)
            }

            assert.strictEqual(got_encoded, want)
            assert.strictEqual(got_decoded, start)
        })
    }

    it("works - null", function() {
        const start = null
        const got_encoded = jsonxt.encoders["isoyyyymm-2020-base32"](rule, start)
        const got_decoded = jsonxt.decoders["isoyyyymm-2020-base32"](rule, got_encoded)
        const want = "$."

        if (DUMP) {
            console.log("")
            console.log("start:", start)
            console.log("encoded:", got_encoded)
        }

        assert.strictEqual(got_encoded, want)
        assert.strictEqual(got_decoded, start)
    })

    it("works - undefined", function() {
        const start = undefined
        const got_encoded = jsonxt.encoders["isoyyyymm-2020-base32"](rule, start)
        const got_decoded = jsonxt.decoders["isoyyyymm-2020-base32"](rule, got_encoded)
        const want = ""

        if (DUMP) {
            console.log("")
            console.log("start:", start)
            console.log("encoded:", got_encoded)
        }

        assert.strictEqual(got_encoded, want)
        assert.strictEqual(got_decoded, start)
    })

    it("expected fail - empty string", function() {
        const start = "hello"

        assert.throws(() => {
            const got_encoded = jsonxt.encoders["isoyyyymm-2020-base32"](rule, start)
        })
    })
    it("expected fail - wrong date format (YYYY-MM-DD)", function() {
        const start = "2001-01-01"

        assert.throws(() => {
            const got_encoded = jsonxt.encoders["isoyyyymm-2020-base32"](rule, start)
        })
    })
    it("expected fail - wrong date format (timestamp with milliseconds)", function() {
        const start = "2021-04-01T11:45:05.467Z"

        assert.throws(() => {
            const got_encoded = jsonxt.encoders["isoyyyymm-2020-base32"](rule, start)
        })
    })
    it("expected fail - string", function() {
        const start = "hello"

        assert.throws(() => {
            const got_encoded = jsonxt.encoders["isoyyyymm-2020-base32"](rule, start)
        })
    })
    it("expected fail - number", function() {
        const start = 3.14

        assert.throws(() => {
            const got_encoded = jsonxt.encoders["isoyyyymm-2020-base32"](rule, start)
        })
    })
    it("expected fail - boolean", function() {
        const start = true

        assert.throws(() => {
            const got_encoded = jsonxt.encoders["isoyyyymm-2020-base32"](rule, start)
        })
    })
})
