/*
 *  test/coders/string.js
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

describe("coders/string", function() {
    before(function() {
        _util.shims_on()
    })

    after(function() {
        _util.shims_off()
    })

    const rule_simple = {
    }
    const rule_compact = {
        compact: [
            "Foo",
            "Bar",
            "Hello, World",
        ],
    }
    const rule_prefix_slash = {
        escape: "/",
        prefix: [
            "http://",
            "https://",
            "ftp://",
        ],
    }
    const rule_prefix_colon = {
        escape: ":",
        prefix: [
            "urn:uvci:",
            "did:",
            "did:web:",
        ],
    }

    it("works - simple string", function() {
        const start = "Hello World"
        const got_encoded = jsonxt.encoders.string(rule_simple, start)
        const got_decoded = jsonxt.decoders.string(rule_simple, got_encoded)
        const want = "Hello$World"

        if (DUMP) {
            console.log("")
            console.log("start:", start)
            console.log("encoded:", got_encoded)
        }

        assert.strictEqual(got_encoded, want)
        assert.strictEqual(got_decoded, start)
    })

    it("works - empty string", function() {
        const start = ""
        const got_encoded = jsonxt.encoders.string(rule_simple, start)
        const got_decoded = jsonxt.decoders.string(rule_simple, got_encoded)
        const want = "$"

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
        const got_encoded = jsonxt.encoders.string(rule_simple, start)
        const got_decoded = jsonxt.decoders.string(rule_simple, got_encoded)
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
        const got_encoded = jsonxt.encoders.string(rule_simple, start)
        const got_decoded = jsonxt.decoders.string(rule_simple, got_encoded)
        const want = ""

        if (DUMP) {
            console.log("")
            console.log("start:", start)
            console.log("encoded:", got_encoded)
        }

        assert.strictEqual(got_encoded, want)
        assert.strictEqual(got_decoded, start)
    })

    it("works - starts with $", function() {
        const start = "$hello"
        const got_encoded = jsonxt.encoders.string(rule_simple, start)
        const got_decoded = jsonxt.decoders.string(rule_simple, got_encoded)
        const want = "$$hello"

        if (DUMP) {
            console.log("")
            console.log("start:", start)
            console.log("encoded:", got_encoded)
        }

        assert.strictEqual(got_encoded, want)
        assert.strictEqual(got_decoded, start)
    })

    it("works - compact (in set)", function() {
        const start = "Hello, World"
        const got_encoded = jsonxt.encoders.string(rule_compact, start)
        const got_decoded = jsonxt.decoders.string(rule_compact, got_encoded)
        const want = "$2"

        if (DUMP) {
            console.log("")
            console.log("start:", start)
            console.log("encoded:", got_encoded)
        }

        assert.strictEqual(got_encoded, want)
        assert.strictEqual(got_decoded, start)
    })

    it("works - compact (out of set)", function() {
        const start = "Hello, World!"
        const got_encoded = jsonxt.encoders.string(rule_compact, start)
        const got_decoded = jsonxt.decoders.string(rule_compact, got_encoded)
        const want = "Hello%2C$World!"

        if (DUMP) {
            console.log("")
            console.log("start:", start)
            console.log("encoded:", got_encoded)
        }

        assert.strictEqual(got_encoded, want)
        assert.strictEqual(got_decoded, start)
    })

    // prefix
    it("works - prefix with slash encoding", function() {
        const start = "https://google.ca/hello/world"
        const got_encoded = jsonxt.encoders.string(rule_prefix_slash, start)
        const got_decoded = jsonxt.decoders.string(rule_prefix_slash, got_encoded)
        const want = "$1google.ca$hello$world"

        if (DUMP) {
            console.log("")
            console.log("start:", start)
            console.log("encoded:", got_encoded)
        }

        assert.strictEqual(got_encoded, want)
        assert.strictEqual(got_decoded, start)
    })
    it("works - prefix with colon encoding", function() {
        const start = "urn:uvci:example:test#web"
        const got_encoded = jsonxt.encoders.string(rule_prefix_colon, start)
        const got_decoded = jsonxt.decoders.string(rule_prefix_colon, got_encoded)
        const want = "$0example$test%23web"

        if (DUMP) {
            console.log("")
            console.log("start:", start)
            console.log("encoded:", got_encoded)
        }

        assert.strictEqual(got_encoded, want)
        assert.strictEqual(got_decoded, start)
    })
    it("works - prefix with colon encoding", function() {
        const start = "did:web:example:test#web"
        const got_encoded = jsonxt.encoders.string(rule_prefix_colon, start)
        const got_decoded = jsonxt.decoders.string(rule_prefix_colon, got_encoded)
        const want = "$1web$example$test%23web"

        if (DUMP) {
            console.log("")
            console.log("start:", start)
            console.log("encoded:", got_encoded)
        }

        assert.strictEqual(got_encoded, want)
        assert.strictEqual(got_decoded, start)
    })

    // -- fails -- 
    it("expected fail - number", function() {
        const start = 1

        assert.throws(() => {
            const got_encoded = jsonxt.encoders.string(rule_simple, start)
        })
    })
    it("expected fail - simple meaningless escape", function() {
        const start = "$3783"

        assert.throws(() => {
            const got_encoded = jsonxt.decoders.string(rule_simple, start)
        })
    })
    it("expected fail - bad compact (low)", function() {
        const start = "$-10"

        assert.throws(() => {
            const got_encoded = jsonxt.decoders.string(rule_compact, start)
        })
    })
    it("expected fail - bad compact (high)", function() {
        const start = "$10"

        assert.throws(() => {
            const got_encoded = jsonxt.decoders.string(rule_compact, start)
        })
    })
})
