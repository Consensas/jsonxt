/*
 *  test/resolvers/dns.js
 *
 *  David Janes
 *  Consenas.com
 *  2021-03-26
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

const dns = require("dns")
const fs = require("fs")
const path = require("path")
const assert = require("assert")

const _util = require("./../_util")

const WRITE = process.env.WRITE === "1"
const DUMP = process.env.DUMP === "1"

describe("resolvers/dns", function() {
    const RESOLVER_NAME_FAIL = "__FAIL"
    const RESOLVER_NAME_EDGE1 = "__EDGE1"
    const RESOLVER_NAME_EDGE2 = "__EDGE2"
    let resolveTxt

    before(function() {
        _util.shims_on()

        resolveTxt = dns.promises.resolveTxt
        dns.promises.resolveTxt = async name => {
            if (name.endsWith(RESOLVER_NAME_FAIL)) {
                throw new Error()
            }
            if (name.endsWith(RESOLVER_NAME_EDGE1)) {
                return []
            }
            if (name.endsWith(RESOLVER_NAME_EDGE2)) {
                return [ "" ]
            }

            return await resolveTxt(name)
        }
    })

    after(function() {
        _util.shims_off()

        dns.promises.resolveTxt = resolveTxt
    })

    it("works (sample1 @ jsonxt.io)", async function() {
        const RESOLVER_NAME = "jsonxt.io"
        const RESOLVER_KEY = "sample1"

        const got = await jsonxt.resolvers.dns(RESOLVER_NAME, RESOLVER_KEY)
        const want = "value1"

        assert.strictEqual(got, want)
    })
    it("ignores extension (sample1.txt @ jsonxt.io)", async function() {
        const RESOLVER_NAME = "jsonxt.io"
        const RESOLVER_KEY = "sample1.txt"

        const got = await jsonxt.resolvers.dns(RESOLVER_NAME, RESOLVER_KEY)
        const want = "value1"

        assert.strictEqual(got, want)
    })
    it("works - expected null (doesnotexist @ jsonxt.io)", async function() {
        const RESOLVER_NAME = "jsonxt.io"
        const RESOLVER_KEY = "doesnotexist"

        const got = await jsonxt.resolvers.dns(RESOLVER_NAME, RESOLVER_KEY)
        const want = null

        assert.strictEqual(got, want)
    })
    it("works - edge case, empty list", async function() {
        const RESOLVER_NAME = RESOLVER_NAME_EDGE1
        const RESOLVER_KEY = "doesnotexist"

        const got = await jsonxt.resolvers.dns(RESOLVER_NAME, RESOLVER_KEY)
        const want = null

        assert.strictEqual(got, want)
    })
    it("works - edge case, empty response", async function() {
        const RESOLVER_NAME = RESOLVER_NAME_EDGE2
        const RESOLVER_KEY = "doesnotexist"

        const got = await jsonxt.resolvers.dns(RESOLVER_NAME, RESOLVER_KEY)
        const want = null

        assert.strictEqual(got, want)
    })
    it("expected failure", async function() {
        const RESOLVER_NAME = RESOLVER_NAME_FAIL
        const RESOLVER_KEY = "doesnotexist"

        assert.rejects(async () => {
            await jsonxt.resolvers.dns(RESOLVER_NAME, RESOLVER_KEY)
        })
    })
})
