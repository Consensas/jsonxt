/*
 *  test/resolvers/uri.js
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

const fs = require("fs")
const path = require("path")
const assert = require("assert")

const _util = require("./../_util")

const WRITE = process.env.WRITE === "1"
const DUMP = process.env.DUMP === "1"

describe("resolvers/uri", function() {
    before(function() {
        _util.shims_on()
    })

    after(function() {
        _util.shims_off()
    })

    it("works (sample1.txt @ jsonxt.io/.well-known)", async function() {
        const RESOLVER_NAME = "jsonxt.io/.well-known"
        const RESOLVER_KEY = "sample1.txt"

        const got = await jsonxt.resolvers.uri(RESOLVER_NAME, RESOLVER_KEY)
        const want = "value1\n"

        assert.strictEqual(got, want)
    })
    it("works - expected null (doesnotexist @ jsonxt.io/.well-known)", async function() {
        const RESOLVER_NAME = "jsonxt.io/.well-known"
        const RESOLVER_KEY = "doesnotexist"

        const got = await jsonxt.resolvers.uri(RESOLVER_NAME, RESOLVER_KEY)
        const want = null

        assert.strictEqual(got, want)
    })
    it("works - expected null (doesnotexist @ jsonxt.io)", async function() {
        const RESOLVER_NAME = "jsonxt.io"
        const RESOLVER_KEY = "doesnotexist"

        const got = await jsonxt.resolvers.uri(RESOLVER_NAME, RESOLVER_KEY)
        const want = null

        assert.strictEqual(got, want)
    })
    it("works - expected null (doesnotexist @ jsonxt.io/)", async function() {
        const RESOLVER_NAME = "jsonxt.io/"
        const RESOLVER_KEY = "doesnotexist"

        const got = await jsonxt.resolvers.uri(RESOLVER_NAME, RESOLVER_KEY)
        const want = null

        assert.strictEqual(got, want)
    })
})
