/*
 *  test/coders/multibase-base36.js
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

const TESTCLASS = "multibase-base36";

describe("coders/multibase-base36", function() {
    before(function() {
        _util.shims_on()
    })

    after(function() {
        _util.shims_off()
    })

    const rule = { 
    }

    it("works - zero", function() {
        const start = ''
        const got_encoded = jsonxt.encoders[TESTCLASS](rule, start)
        const got_decoded = jsonxt.decoders[TESTCLASS](rule, got_encoded)
        const want = "$"

        if (DUMP) {
            console.log("")
            console.log("start:", start)
            console.log("encoded:", got_encoded)
        }

        assert.strictEqual(got_encoded, want)
        assert.strictEqual(got_decoded, start)
    })

    it("works - multibase signature", function() {
        const start = "z44RDDFBvPHfSLQQC13cggevnts7DFQRUXQg9YfYrNx5m4PAoqR3qFydGwtUsEvQL4WwjRX2Lp2m87H6NKRuaHEKC"
        const got_encoded = jsonxt.encoders[TESTCLASS](rule, start)
        const got_decoded = jsonxt.decoders[TESTCLASS](rule, got_encoded)
        const want = "3UN30D2FI1ZQGHWK7OJFX06V3O1FJ13KOX48Z4GOA370XTC064WBO7T7YCEJY1BBGI23PIEC7CAA3EKQ3UL0TMA3QSG7A8O8RQMF7"

        if (DUMP) {
            console.log("")
            console.log("start:", start)
            console.log("encoded:", got_encoded)
        }

        assert.strictEqual(got_encoded, want)
        assert.strictEqual(got_decoded, start)
    })

    it("works - multibase Key", function() {
        const start = "z5Q2WLLaD7aJ44s6Aw6qXf1vNor9quCe1ZLhHqc63yhfFF63tbuTgPHgCzXKUbkHAGm8oE9jiQpCPepD88Jgyy7FW"
        const got_encoded = jsonxt.encoders[TESTCLASS](rule, start)
        const got_decoded = jsonxt.decoders[TESTCLASS](rule, got_encoded)
        const want = "3UXQ5XT2QETCC7HXT8T4JDQ33JIGGZSBB4BHT1C1I2TIVKKII2ZJH2PPO2RKZ42HWMSPGPOM3RS6OWA5URVH6821EP5SRRBWDUFSX"

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
        const got_encoded = jsonxt.encoders[TESTCLASS](rule, start)
        const got_decoded = jsonxt.decoders[TESTCLASS](rule, got_encoded)
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
        const got_encoded = jsonxt.encoders[TESTCLASS](rule, start)
        const got_decoded = jsonxt.decoders[TESTCLASS](rule, got_encoded)
        const want = ""

        if (DUMP) {
            console.log("")
            console.log("start:", start)
            console.log("encoded:", got_encoded)
        }

        assert.strictEqual(got_encoded, want)
        assert.strictEqual(got_decoded, start)
    })

    it("expected fail - number", function() {
        const start = 1

        assert.rejects(async () => {
            const got_encoded = jsonxt.encoders[TESTCLASS](rule, start)
        })
    })
    it("expected fail - number", function() {
        const start = 3.14

        assert.rejects(async () => {
            const got_encoded = jsonxt.encoders[TESTCLASS](rule, start)
        })
    })
    it("expected fail - boolean", function() {
        const start = true

        assert.rejects(async () => {
            const got_encoded = jsonxt.encoders[TESTCLASS](rule, start)
        })
    })
})
