/*
 *  test/coders/base64-base32.js
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

const fs = require("fs")
const path = require("path")
const assert = require("assert")

const _util = require("./../_util")

const WRITE = process.env.WRITE === "1"
const DUMP = process.env.DUMP === "1"

describe("coders/float-string", function() {
    before(function() {
        _util.shims_on()
    })

    after(function() {
        _util.shims_off()
    })

    const rule = { 
    }

    it("works - zero", function() {
        const start = 0
        const got_encoded = jsonxt.encoders["float-string"](rule, start)
        const got_decoded = jsonxt.decoders["float-string"](rule, got_encoded)
        const want = '0'

        if (DUMP) {
            console.log("")
            console.log("start:", start)
            console.log("encoded:", got_encoded)
        }

        assert.strictEqual(got_encoded, want)
        assert.strictEqual(got_decoded, start)
    })

    it("works - floating point number", function() {
        const start = 2.34
        const got_encoded = jsonxt.encoders["float-string"](rule, start)
        const got_decoded = jsonxt.decoders["float-string"](rule, got_encoded)
        const want = "2.34"

        if (DUMP) {
            console.log("")
            console.log("start:", start)
            console.log("encoded:", got_encoded)
        }

        assert.strictEqual(got_encoded, want)
        assert.strictEqual(got_decoded, start)
    })

    it("works - negative floating point number", function() {
        const start = -2.34
        const got_encoded = jsonxt.encoders["float-string"](rule, start)
        const got_decoded = jsonxt.decoders["float-string"](rule, got_encoded)
        const want = "-2.34"

        if (DUMP) {
            console.log("")
            console.log("start:", start)
            console.log("encoded:", got_encoded)
        }

        assert.strictEqual(got_encoded, want)
        assert.strictEqual(got_decoded, start)
    })

    it("works - integer", function() {
        const start = 4
        const got_encoded = jsonxt.encoders["float-string"](rule, start)
        const got_decoded = jsonxt.decoders["float-string"](rule, got_encoded)
        const want = "4"

        if (DUMP) {
            console.log("")
            console.log("start:", start)
            console.log("encoded:", got_encoded)
        }

        assert.strictEqual(got_encoded, want)
        assert.strictEqual(got_decoded, start)
    })

    it("works - thousands separator", function() {
        const start = 40000.03
        const got_encoded = jsonxt.encoders["float-string"](rule, start)
        const got_decoded = jsonxt.decoders["float-string"](rule, got_encoded)
        const want = "40000.03"

        if (DUMP) {
            console.log("")
            console.log("start:", start)
            console.log("encoded:", got_encoded)
        }

        assert.strictEqual(got_encoded, want)
        assert.strictEqual(got_decoded, start)
    })

    it("works - null", function() {
        const start = null
        const got_encoded = jsonxt.encoders["float-string"](rule, start)
        const got_decoded = jsonxt.decoders["float-string"](rule, got_encoded)
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
        const got_encoded = jsonxt.encoders["float-string"](rule, start)
        const got_decoded = jsonxt.decoders["float-string"](rule, got_encoded)
        const want = ""

        if (DUMP) {
            console.log("")
            console.log("start:", start)
            console.log("encoded:", got_encoded)
        }

        assert.strictEqual(got_encoded, want)
        assert.strictEqual(got_decoded, start)
    })

    it("expected fail - string", function() {
        const start = "1"

        assert.rejects(async () => {
            const got_encoded = jsonxt.encoders["float-string"](rule, start)
        })
    })
    it("expected fail - string", function() {
        const start = "3.14"

        assert.rejects(async () => {
            const got_encoded = jsonxt.encoders["float-string"](rule, start)
        })
    })
    it("expected fail - boolean", function() {
        const start = true

        assert.rejects(async () => {
            const got_encoded = jsonxt.encoders["float-string"](rule, start)
        })
    })
})
