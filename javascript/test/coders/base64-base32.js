/*
 *  test/coders/base64-base32.js
 *
 *  David Janes
 *  Consenas.com
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

describe("coders/base64-base32", function() {
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
        const got_encoded = jsonxt.encoders["base64-base32"](rule, start)
        const got_decoded = jsonxt.decoders["base64-base32"](rule, got_encoded)
        const want = "~"

        if (DUMP) {
            console.log("")
            console.log("start:", start)
            console.log("encoded:", got_encoded)
        }

        assert.strictEqual(got_encoded, want)
        assert.strictEqual(got_decoded, start)
    })

    it("works - base64 Phrase", function() {
        const start = "VGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZy4="
        const got_encoded = jsonxt.encoders["base64-base32"](rule, start)
        const got_decoded = jsonxt.decoders["base64-base32"](rule, got_encoded)
        const want = "KRUGKIDROVUWG2ZAMJZG653OEBTG66BANJ2W24DTEBXXMZLSEB2GQZJANRQXU6JAMRXWOLQ"

        if (DUMP) {
            console.log("")
            console.log("start:", start)
            console.log("encoded:", got_encoded)
        }

        assert.strictEqual(got_encoded, want)
        assert.strictEqual(got_decoded, start)
    })

    it("works - base64 Signature", function() {
        const start = "tXPYwy6d/TkXsRjPl7DIFnj5XN2QIwb4f9MFZdnCiUxx4aw8GzhXwjyulJzneTgHGbqow8TlmtmDEYZQvU0iin5d8F2vkmVryXx1ui6vAflRcF+FnR+aatEoOSgvm/5S5PilmQFTWQ1utMsdS3XdMQ=="
        const got_encoded = jsonxt.encoders["base64-base32"](rule, start)
        const got_decoded = jsonxt.decoders["base64-base32"](rule, got_encoded)
        const want = "WVZ5RQZOTX6TSF5RDDHZPMGICZ4PSXG5SARQN6D72MCWLWOCRFGHDYNMHQNTQV6CHSXJJHHHPE4AOGN2VDB4JZM23GBRDBSQXVGSFCT6LXYF3L4SMVV4S7DVXIXK6APZKFYF7BM5D6NGVUJIHEUC7G76KLSPRJMZAFJVSDLOWTFR2S3V3UYQ"

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
        const got_encoded = jsonxt.encoders["base64-base32"](rule, start)
        const got_decoded = jsonxt.decoders["base64-base32"](rule, got_encoded)
        const want = "~."

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
        const got_encoded = jsonxt.encoders["base64-base32"](rule, start)
        const got_decoded = jsonxt.decoders["base64-base32"](rule, got_encoded)
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
            const got_encoded = jsonxt.encoders["base64-base32"](rule, start)
        })
    })
    it("expected fail - number", function() {
        const start = 3.14

        assert.rejects(async () => {
            const got_encoded = jsonxt.encoders["base64-base32"](rule, start)
        })
    })
    it("expected fail - boolean", function() {
        const start = true

        assert.rejects(async () => {
            const got_encoded = jsonxt.encoders["base64-base32"](rule, start)
        })
    })
})
