/*
 *  test/resolve.js
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
const jsonxt = require("..")

const fs = require("fs")
const path = require("path")
const assert = require("assert")

const _util = require("./_util")

const FOLDER = path.join(__dirname, "data")
const WRITE = process.env.WRITE === "1"
const DUMP = process.env.DUMP === "1"

describe("resolve", function() {
    before(function() {
        _util.shims_on()
    })

    after(function() {
        _util.shims_off()
    })

    it("works - (sample-dns @ jsonxt.io - DNS)", async function() {
        const templates$ = await jsonxt.resolve("jsonxt.io", "sample-dns")
        assert.ok(templates$)
    })
    it("works - (sample-wk @ jsonxt.io - well-known)", async function() {
        const templates$ = await jsonxt.resolve("jsonxt.io", "sample-wk.txt")
        assert.ok(templates$)
    })
    it("works - (sample-wk @ jsonxt.io - partial uri)", async function() {
        const templates$ = await jsonxt.resolve("jsonxt.io/.well-known/", "sample-wk.txt")
        assert.ok(templates$)
    })
    it("works - (sample-wk @ jsonxt.io - full uri)", async function() {
        const templates$ = await jsonxt.resolve("https://jsonxt.io/.well-known/", "sample-wk.txt")
        assert.ok(templates$)
    })
    it("works - (templates.json @ jsonxt.io - well-known)", async function() {
        const templates$ = await jsonxt.resolve("jsonxt.io", "templates.json")
        assert.ok(templates$)
    })
    it("end-to-end", async function() {
    })
})
