/*
 *  test/unpack.js
 *
 *  David Janes
 *  Consenas.com
 *  2021-03-15
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

describe("unpack", function() {
    let covid_templates

    before(async function() {
        _util.shims_on()
        covid_templates = await _util.read_json(`covid-templates.json`)
    })

    after(function() {
        _util.shims_off()
    })

    for (let [ NAME, TYPE, VERSION ] of [ 
        [ "w3vc-1-1", "w3vc", "1" ],
        [ "w3vc-1-2", "w3vc", "1" ],
        [ "c4-1-1", "c4", "1" ],
    ]) {
        it(`unpack: ${NAME}`, async function() {
            const templates = await _util.read_json(`covid-templates.json`)
            const original = await _util.read_json(`${NAME}.json`)
            const packed = await _util.read_document(`${NAME}-packed.txt`)

            const unpacked = await jsonxt.unpack(packed, resolver => {
                return templates
            })
            const got = unpacked
            const want = original

            if (DUMP) {
                console.log("original", original)
                console.log("packed", packed)
                console.log("unpacked", unpacked)
            }

            assert.deepEqual(got, want)
        })
    }

    describe("expected failures", function() {
        const NAME = "w3vc-1-1"
        const TYPE = "w3vc"
        const VERSION ="1"

        const RESOLVER = resolver => {
            return covid_templates
        }

        it("works with all parameters", async function() {
            const packed = await _util.read_document(`${NAME}-packed.txt`)
            
            const unpacked = await jsonxt.unpack(packed, RESOLVER)
        })
        it("bad value for packed", async function() {
            const packed = null
            
            assert.rejects(async () => {
                const unpacked = await jsonxt.unpack(packed, RESOLVER)
            })
        })
        it("bad value for resolver", async function() {
            const packed = await _util.read_document(`${NAME}-packed.txt`)
            
            assert.rejects(async () => {
                const unpacked = await jsonxt.unpack(packed, null)
            })
        })
        it("sufficient components (works)", async function() {
            const packed = "jxt:jsonxt.io:w3vc:1:MoH"
            
            const unpacked = await jsonxt.unpack(packed, RESOLVER)
        })
        it("a plethera of components (works)", async function() {
            const packed = "jxt:jsonxt.io:w3vc:1:MoH:xxx:xxx"
            
            const unpacked = await jsonxt.unpack(packed, RESOLVER)
        })
        it("insufficient components (fails)", async function() {
            const packed = "jxt:jsonxt.io:w3vc:1"
            
            assert.rejects(async () => {
                const unpacked = await jsonxt.unpack(packed, RESOLVER)
            })
        })
        it("wrong prefix (fails)", async function() {
            const packed = "xjt:jsonxt.io:w3vc:1:MoH"
            
            assert.rejects(async () => {
                const unpacked = await jsonxt.unpack(packed, RESOLVER)
            })
        })
        it("templates a bad value", async function() {
            const templates = 0
            const packed = "jxt:jsonxt.io:w3vc:1:MoH"
            
            assert.rejects(async () => {
                const unpacked = await jsonxt.unpack(packed, () => templates)
            })
        })
        it("template a bad value", async function() {
            const packed = "jxt:jsonxt.io:w3vc:1:MoH"
            
            assert.rejects(async () => {
                const unpacked = await jsonxt.unpack(packed, () => {
                    return {
                        "w3vc:1": 0,
                    }
                })
            })
        })
    })

    describe("arrays", function() {
        const ARRAY_TEMPLATES = {
            "data:1": {
                "columns": [
                    {"path": "people", "encoder": "array", "encoder_param": "person:1"},
                ],
                "template": {}
            },
            "person:1": {
                "columns": [
                {"path": "given", "encoder": "string"},
                {"path": "family", "encoder": "string"},
                {"path": "ids", "encoder": "array", "encoder_param": "identification:1"},
                ],
                "template": {
                    "type": "Person"
                }
            },
            "identification:1": {
                "columns": [
                {"path": "name", "encoder": "string"},
                {"path": "number", "encoder": "string"}
                ],
                "template": {
                    "type": "IdentificationDocument"
                }
            }
        };

        it("should unpack multiple arrays", async function() {
            const packed = "JXT::data:1:2/Jane/Doe/2/MDL/23EFG3D5CC/Passport/YNW32ND/John/Doe/2/MDL/94568DDS1/Passport/2SC6223"
            const unpacked = await jsonxt.unpack(packed, () => {
                return ARRAY_TEMPLATES;
            });

            const got = unpacked
            const want = {
                "people": [{
                    "type": "Person",
                    "given": "Jane",
                    "family": "Doe",
                    "ids": [{
                        "type": "IdentificationDocument",
                        "name": "MDL",
                        "number": "23EFG3D5CC"
                    }, {
                        "type": "IdentificationDocument",
                        "name": "Passport",
                        "number": "YNW32ND"
                    }]
                }, {
                    "type": "Person",
                    "given": "John",
                    "family": "Doe", 
                    "ids": [{
                        "type": "IdentificationDocument",
                        "name": "MDL",
                        "number": "94568DDS1"
                    }, {
                        "type": "IdentificationDocument",
                        "name": "Passport",
                        "number": "2SC6223"
                    }]
                }]
            };

            assert.deepEqual(got, want)
        })

        it("should unpack empty arrays", async function() {
            const packed = "JXT::data:1:0"
            const want = {
                "people": []
            };
            
            const unpacked = await jsonxt.unpack(packed, () => {
                return ARRAY_TEMPLATES;
            });

            const got = unpacked

            assert.deepEqual(got, want)
        })

        it("should unpack null arrays", async function() {
            const packed = "JXT::data:1:"
            const want = {
                
            };
            
            const unpacked = await jsonxt.unpack(packed, () => {
                return ARRAY_TEMPLATES;
            });
            
            const got = unpacked

            assert.deepEqual(got, want)
        })
    })

    describe("edge cases", function() {
        const NAME = "w3vc-1-1"
        const TYPE = "w3vc"
        const VERSION ="1"
        
        it("no columns", async function() {
            const packed = "jxt:jsonxt.io:w3vc:1:MoH"
            const unpacked = await jsonxt.unpack(packed, () => {
                return {
                    "w3vc:1": {}
                }
            })

            const got = unpacked
            const want = {}

            assert.deepEqual(got, want)
        })
        it("bad decoder - expected fail", async function() {
            const packed = "jxt:jsonxt.io:w3vc:1:MoH"
            assert.rejects(async () => {
                const unpacked = await jsonxt.unpack(packed, () => {
                    return {
                        "w3vc:1": {
                            columns: [
                                {
                                    "path": "a",
                                    "encoder": "does-not-exist",
                                },
                            ],
                        }
                    }
                })
            })
        })
    })

})
