/*
 *  test/util.js
 *
 *  David Janes
 *  Consenas.com
 *  2021-03-19
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
const jsonxt = require("..")

const fs = require("fs")
const path = require("path")
const assert = require("assert")

const _util = require("./_util")
const util = require("../lib/_util")

const FOLDER = path.join(__dirname, "data")
const WRITE = process.env.WRITE === "1"
const DUMP = process.env.DUMP === "1"

describe("_util", function() {
    before(function() {
        _util.shims_on()
    })

    after(function() {
        _util.shims_off()
    })

    it("_util.isEqual", function() {
        assert.ok(util.isEqual({}, {}))
        assert.ok(!util.isEqual({}, null))
        assert.ok(util.isEqual(
            {
                "a": 1,
                "b": {
                    c: [ 1, 2, 3 ],
                },
            }, 
            {
                "a": 1,
                "b": {
                    c: [ 1, 2, 3 ],
                },
            },
        ))
    })

    it("_util.isBuffer", function() {
        assert.ok(util.isBuffer(Buffer.from("")))
        assert.ok(!util.isBuffer(""))
        assert.ok(!util.isBuffer({}))
        assert.ok(!util.isBuffer([]))
        assert.ok(!util.isBuffer(0))
        assert.ok(!util.isBuffer(1))
        assert.ok(!util.isBuffer(-10))
        assert.ok(!util.isBuffer(null))
        assert.ok(!util.isBuffer(undefined))
    })

    it("_util.isArray", function() {
        assert.ok(!util.isArray(Buffer.from("")))
        assert.ok(!util.isArray(""))
        assert.ok(!util.isArray({}))
        assert.ok(util.isArray([]))
        assert.ok(util.isArray([ 1, 3 ]))
        assert.ok(!util.isArray(0))
        assert.ok(!util.isArray(1))
        assert.ok(!util.isArray(-10))
        assert.ok(!util.isArray(null))
        assert.ok(!util.isArray(undefined))
    })

    it("_util.isBoolean", function() {
        assert.ok(!util.isBoolean(Buffer.from("")))
        assert.ok(!util.isBoolean(""))
        assert.ok(!util.isBoolean({}))
        assert.ok(!util.isBoolean([]))
        assert.ok(!util.isBoolean([ 1, 3 ]))
        assert.ok(!util.isBoolean(0))
        assert.ok(!util.isBoolean(1))
        assert.ok(!util.isBoolean(-10))
        assert.ok(!util.isBoolean(null))
        assert.ok(!util.isBoolean(undefined))
        assert.ok(util.isBoolean(true))
        assert.ok(util.isBoolean(false))
    })

    it("_util.delete - shallow", function() {
        const d = {
            "a": "b",
            "c": {
                "d": [ 1, 2, 3 ],
            },
        }

        util.delete(d, "a")

        const got = d
        const want = {
            "c": {
                "d": [ 1, 2, 3 ],
            },
        }

        assert.deepEqual(got, want)
    })
    it("_util.delete - deep", function() {
        const d = {
            "a": "b",
            "c": {
                "d": [ 1, 2, 3 ],
            },
        }

        util.delete(d, "c.d")

        const got = d
        const want = {
            "a": "b",
            "c": {},
        }

        assert.deepEqual(got, want)
    })
    it("_util.delete - super deep and does not exist", function() {
        const d = {
            "a": "b",
            "c": {
                "d": [ 1, 2, 3 ],
                "e": {
                    "f": {
                        "g": 234
                    },
                },
            },
        }
        const want = _.cloneDeep(d)

        util.delete(d, "c.e.f.g.h")

        const got = d

        assert.deepEqual(got, want)
    })
    it("_util.delete - deep and does not exist", function() {
        const d = {
            "a": "b",
            "c": {
                "d": [ 1, 2, 3 ],
            },
        }

        util.delete(d, "a.x")

        const got = d
        const want = {
            "a": "b",
            "c": {
                "d": [ 1, 2, 3 ],
            },
        }

        assert.deepEqual(got, want)
    })

    for (let [ uri, encoded ] of [
            [ "https://google.ca", "https%3A~~google.ca", ],
            [ "HTTPS://google.ca", "HTTPS%3A~~google.ca", ],
            [ "weird:case idea/something", "weird%3Acase%20idea~something", ],
        ]) {
            it("_util.encodeExtendedSlash: " + uri, function() {
                const got = util.encodeExtendedSlash(uri);
                const want = encoded
                if (DUMP) {
                    console.log("GOT", got)
                    console.log("WANT", want)                    
                }
                assert.strictEqual(got, want)
        })
        it("_util.decodeExtendedSlash: " + uri, function() {
            const got = util.decodeExtendedSlash(encoded);
            const want = uri
            if (DUMP) {
                console.log("GOT", got)
                console.log("WANT", want)                    
            }
            assert.strictEqual(got, want)
        })
    }

    it("_util.percentEncode: works where expected", function() {
        assert.strictEqual(util.percentEncode(" "), "%20")
        assert.strictEqual(util.percentEncode("/"), "%2F")
        assert.strictEqual(util.percentEncode(":"), "%3A")
        assert.strictEqual(util.percentEncode("~"), "%7E")
        assert.strictEqual(util.percentEncode("a"), "%61")
    })

    it("_util.percentEncode: fails where expected", function() {
        assert.throws(() => { util.percentEncode("\t") })
        assert.throws(() => { util.percentEncode("444") })
        assert.throws(() => { util.percentEncode("") })
        assert.throws(() => { util.percentEncode("🥳") })
    })
})
