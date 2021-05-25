/*
 *  test/pack.js
 *
 *  David Janes
 *  Consenas.com
 *  2021-03-12
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

describe("pack", function() {
    const RESOLVER_NAME = "jsonxt.io"

    before(function() {
        _util.shims_on()
    })

    after(function() {
        _util.shims_off()
    })

    for (let [ NAME, TYPE, VERSION, TEMPLATES ] of [ 
        [ "w3vc-1-1", "w3vc", "1", "covid-templates.json", ],
        [ "w3vc-1-2", "w3vc", "1", "covid-templates.json", ],
        [ "w3vc-1qr-1", "w3vc", "1qr", "covid-templates.json", ],
        [ "c4-1-1", "c4", "1", "covid-templates.json", ],
        [ "simple-1-1", "simple", "1", "covid-templates.json", ],
        [ "ibm-1-1", "ibm", "1", "ibm-templates.json", ],
    ]) {
        it(`compress: ${NAME}`, async function() {
            const templates = await _util.read_json(TEMPLATES)
            const original = await _util.read_json(`${NAME}.json`)

            const packed = await jsonxt.pack(original, templates, TYPE, VERSION, RESOLVER_NAME)
            const got = packed

            const FILE = `${NAME}-packed.txt`
            if (DUMP) {
                const p = Math.round(got.length / JSON.stringify(original).length * 100)
                console.log("packed", got, got.length, `${p}%`)
            }
            if (WRITE) {
                await _util.write_document(got, FILE)
            }
            const want = await _util.read_document(FILE)

            assert.deepEqual(got, want)
        })
        it(`compress (uppercase): ${NAME}`, async function() {
            const templates = await _util.read_json(TEMPLATES)
            const original = await _util.read_json(`${NAME}.json`)

            const packed = await jsonxt.pack(original, templates, TYPE, VERSION, RESOLVER_NAME, {
                uppercase: true,
            })
            const got = packed

            const FILE = `${NAME}-packed-upper.txt`
            if (DUMP) {
                const p = Math.round(got.length / JSON.stringify(original).length * 100)
                console.log("packed", got, got.length, `${p}%`)
            }
            if (WRITE) {
                await _util.write_document(got, FILE)
            }
            const want = await _util.read_document(FILE)

            assert.deepEqual(got, want)
        })
    }
    describe("edge cases", function() {
        it("TYPE in upper case", async function() {
            const NAME = "w3vc-1-1"
            const TYPE = "w3vc"
            const VERSION ="1"

            const templates = await _util.read_json(`covid-templates.json`)
            const original = await _util.read_json(`${NAME}.json`)
            const packed = await jsonxt.pack(original, templates, TYPE.toUpperCase(), VERSION, RESOLVER_NAME)
        })
        it("TYPE in lower case", async function() {
            const NAME = "w3vc-1-1"
            const TYPE = "w3vc"
            const VERSION ="1"

            const templates = await _util.read_json(`covid-templates.json`)
            const original = await _util.read_json(`${NAME}.json`)
            const packed = await jsonxt.pack(original, templates, TYPE.toLowerCase(), VERSION, RESOLVER_NAME)
        })
        it("VERSION in upper case", async function() {
            const NAME = "w3vc-1-1"
            const TYPE = "w3vc"
            const VERSION ="1qr"

            const templates = await _util.read_json(`covid-templates.json`)
            const original = await _util.read_json(`${NAME}.json`)
            const packed = await jsonxt.pack(original, templates, TYPE, VERSION.toUpperCase(), RESOLVER_NAME)
        })
        it("VERSION in lower case", async function() {
            const NAME = "w3vc-1-1"
            const TYPE = "w3vc"
            const VERSION ="1qr"

            const templates = await _util.read_json(`covid-templates.json`)
            const original = await _util.read_json(`${NAME}.json`)
            const packed = await jsonxt.pack(original, templates, TYPE, VERSION.toLowerCase(), RESOLVER_NAME)
        })
    })
    describe("expected failures", function() {
        const NAME = "w3vc-1-1"
        const TYPE = "w3vc"
        const VERSION ="1"

        it("works with all parameters", async function() {
            const templates = await _util.read_json(`covid-templates.json`)
            const original = await _util.read_json(`${NAME}.json`)
            const packed = await jsonxt.pack(original, templates, TYPE, VERSION, RESOLVER_NAME)
        })
        it("missing original", async function() {
            const templates = await _util.read_json(`covid-templates.json`)
            const original = await _util.read_json(`${NAME}.json`)

            assert.rejects(async () => {
                const packed = await jsonxt.pack(null, templates, TYPE, VERSION, RESOLVER_NAME)
            })
        })
        it("missing templates", async function() {
            const templates = await _util.read_json(`covid-templates.json`)
            const original = await _util.read_json(`${NAME}.json`)

            assert.rejects(async () => {
                const packed = await jsonxt.pack(original, null, TYPE, VERSION, RESOLVER_NAME)
            })
        })
        it("missing type", async function() {
            const templates = await _util.read_json(`covid-templates.json`)
            const original = await _util.read_json(`${NAME}.json`)

            assert.rejects(async () => {
                const packed = await jsonxt.pack(original, templates, null, VERSION, RESOLVER_NAME)
            })
        })
        it("missing version", async function() {
            const templates = await _util.read_json(`covid-templates.json`)
            const original = await _util.read_json(`${NAME}.json`)

            assert.rejects(async () => {
                const packed = await jsonxt.pack(original, templates, TYPE, null, RESOLVER_NAME)
            })
        })
        it("numeric version", async function() {
            const templates = await _util.read_json(`covid-templates.json`)
            const original = await _util.read_json(`${NAME}.json`)

            assert.rejects(async () => {
                const packed = await jsonxt.pack(original, templates, TYPE, 1, RESOLVER_NAME)
            })
        })
        it("missing resolver", async function() {
            const templates = await _util.read_json(`covid-templates.json`)
            const original = await _util.read_json(`${NAME}.json`)

            assert.rejects(async () => {
                const packed = await jsonxt.pack(original, templates, TYPE, VERSION, null)
            })
        })
        it("template is not defined", async function() {
            const templates = await _util.read_json(`covid-templates.json`)
            const original = await _util.read_json(`${NAME}.json`)

            assert.rejects(async () => {
                const packed = await jsonxt.pack(original, templates, TYPE + "XXXXX", VERSION, RESOLVER_NAME)
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

        it("should pack multiple arrays", async function() {
            const json = {
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
            
            const unpacked = await jsonxt.pack(json, ARRAY_TEMPLATES, "data", "1", RESOLVER_NAME);

            const got = unpacked
            const want = "jxt:jsonxt.io:data:1:2/Jane/Doe/2/MDL/23EFG3D5CC/Passport/YNW32ND/John/Doe/2/MDL/94568DDS1/Passport/2SC6223";

            assert.deepEqual(got, want)
        });

        it("should pack empty arrays", async function() {
            const json = {
                "people": []
            };
            
            const unpacked = await jsonxt.pack(json, ARRAY_TEMPLATES, "data", "1", RESOLVER_NAME);

            const got = unpacked
            const want = "jxt:jsonxt.io:data:1:0";

            assert.deepEqual(got, want)
        })

        it("should pack null arrays", async function() {
            const json = {
                
            };
            
            const unpacked = await jsonxt.pack(json, ARRAY_TEMPLATES, "data", "1", RESOLVER_NAME);

            const got = unpacked
            const want = "jxt:jsonxt.io:data:1:";

            assert.deepEqual(got, want)
        })
    })

    describe("mixed arrays", function() {
        const MIXED_ARRAY_TEMPLATES = {
            "data:1": {
                "columns": [
                    {"path": "id", "encoder": "string"},
                    {"path": "people", "encoder": "array", "encoder_param": "person:1"},
                    {"path": "type", "encoder": "string"},
                ],
                "template": {}
            },
            "person:1": {
                "columns": [
                    {"path": "given", "encoder": "string"},
                    {"path": "family", "encoder": "string"},
                ],
                "template": {
                    "type": "Person"
                }
            },
        };

        it("should pack and unpack arrays between other fields", async function() {
            const json = {
                "id": "identification",
                "people": [{
                    "type": "Person",
                    "given": "Jane",
                    "family": "Doe",
                }, {
                    "type": "Person",
                    "given": "John",
                    "family": "Doe", 
                }], 
                "type": "myType"
            };
            
            const packed = await jsonxt.pack(json, MIXED_ARRAY_TEMPLATES, "data", "1", RESOLVER_NAME);
            const unpacked = await jsonxt.unpack(packed, () => {
                return MIXED_ARRAY_TEMPLATES;
            });

            assert.deepEqual(json, unpacked);
        });

        it("should pack and unpack arrays between other fields, with first being null", async function() {
            const json = {
                "people": [{
                    "type": "Person",
                    "given": "Jane",
                    "family": "Doe",
                }, {
                    "type": "Person",
                    "given": "John",
                    "family": "Doe", 
                }], 
                "type": "myType"
            };
            
            const packed = await jsonxt.pack(json, MIXED_ARRAY_TEMPLATES, "data", "1", RESOLVER_NAME);
            const unpacked = await jsonxt.unpack(packed, () => {
                return MIXED_ARRAY_TEMPLATES;
            });

            assert.deepEqual(json, unpacked);
        });


        it("should pack and unpack arrays between other fields, with last being null", async function() {
            const json = {
                "id": "identification",
                "people": [{
                    "type": "Person",
                    "given": "Jane",
                    "family": "Doe",
                }, {
                    "type": "Person",
                    "given": "John",
                    "family": "Doe", 
                }]
            };
            
            const packed = await jsonxt.pack(json, MIXED_ARRAY_TEMPLATES, "data", "1", RESOLVER_NAME);
            const unpacked = await jsonxt.unpack(packed, () => {
                return MIXED_ARRAY_TEMPLATES;
            });

            assert.deepEqual(json, unpacked);
        });

        it("should pack and unpack arrays between other fields, with array being null", async function() {
            const json = {
                "id": "identification",
                "type": "myType"
            };
            
            const packed = await jsonxt.pack(json, MIXED_ARRAY_TEMPLATES, "data", "1", RESOLVER_NAME);
            console.log(packed);
            const unpacked = await jsonxt.unpack(packed, () => {
                return MIXED_ARRAY_TEMPLATES;
            });

            assert.deepEqual(json, unpacked);
        });

        it("should pack empty arrays", async function() {
            const json = {
                "people": []
            };
            
            const packed = await jsonxt.pack(json, MIXED_ARRAY_TEMPLATES, "data", "1", RESOLVER_NAME);
            const unpacked = await jsonxt.unpack(packed, () => { return MIXED_ARRAY_TEMPLATES; });

            assert.deepEqual(json, unpacked);
        })

        it("should pack null arrays", async function() {
            const json = {
                
            };
            
            const packed = await jsonxt.pack(json, MIXED_ARRAY_TEMPLATES, "data", "1", RESOLVER_NAME);
            const unpacked = await jsonxt.unpack(packed, () => { return MIXED_ARRAY_TEMPLATES; });

            assert.deepEqual(json, unpacked);
        })
    })

    describe("EU's DGC", function() {
        const DGC_TEMPLATES = {
            "dgc:1": {
                "columns": [
                    {"path": "credentialSubject.personalInformation.familyName", "encoder": "string"},
                    {"path": "credentialSubject.personalInformation.givenName", "encoder": "string"},
                    {"path": "credentialSubject.personalInformation.stdFamilyName", "encoder": "string"},
                    {"path": "credentialSubject.personalInformation.stdGivenName", "encoder": "string"},
                    {"path": "credentialSubject.personalInformation.birthDate", "encoder": "isodate-1900-base32"},
                    {"path": "credentialSubject.personalInformation.gender", "encoder": "string"},

                    {"path": "credentialSubject.proofOfVaccination", "encoder": "array", "encoder_param": "dgc.vaxComponent:1" },
                    {"path": "credentialSubject.proofOfCovidTest", "encoder": "array", "encoder_param": "dgc.testComponent:1" },
                    {"path": "credentialSubject.proofOfRecovery", "encoder": "array", "encoder_param": "dgc.recvComponent:1" },
                    
                    {"path": "issuanceDate", "encoder": "isodatetime-epoch-base32"},
                    {"path": "expirationDate", "encoder": "isodatetime-epoch-base32"},
                    {"path": "issuer", "encoder": "did:web"},
                    {"path": "id", "encoder": "string"},
                    {"path": "proof.created", "encoder": "isodatetime-epoch-base32"},
                    {"path": "proof.proofValue", "encoder": "base64-base32"},
                    {"path": "proof.verificationMethod", "encoder": "did:web"}
                ],
                "template": {
                    "@context": [
                        "https://www.w3.org/2018/credentials/v1",
                        "https://w3id.org/pathogen/v1",
                        "https://w3id.org/security/bbs/v1"
                    ],
                    "type": [
                        "VerifiableCredential"
                    ],
                    "credentialSubject": {
                        "@context": [
                        "https://w3id.org/pathogen/v1"
                        ],
                        "type": "DGCCertificate",
                        "personalInformation": {
                        "@context": [
                            "https://w3id.org/pathogen/v1"
                        ],
                        "type": "DGCSubject"
                        }
                    },
                    "proof": {
                        "type": "BbsBlsSignature2020",
                        "proofPurpose": "assertionMethod"
                    }
                }
            }, 
            "dgc.testComponent:1": {
                "columns": [
                {"path": "id", "encoder": "urn:uvci"},
                {"path": "issuerName", "encoder": "string"},
                {"path": "testInformation.countryOfTestAdminstration", "encoder": "string"},
                {"path": "testInformation.testType", "encoder": "string"},
                {"path": "testInformation.testResult", "encoder": "string"},
                {"path": "testInformation.testCenter", "encoder": "string"},
                {"path": "testInformation.diseaseTestedFrom", "encoder": "string"},
                {"path": "testInformation.testName", "encoder": "string"},
                {"path": "testInformation.testManufacturer", "encoder": "string"},
                {"path": "testInformation.sampleCollectionDateTime", "encoder": "isodatetime-epoch-base32"},
                {"path": "testInformation.testResultDate", "encoder": "isodatetime-epoch-base32"},
                {"path": "testInformation.testValidatorId", "encoder": "string"}
                ],
                "template": {
                "@context": [
                    "https://w3id.org/pathogen/v1"
                ],
                "type": "DGCProofOfCovidTest",
                "testInformation": {
                    "@context": [
                        "https://w3id.org/pathogen/v1"
                    ],          
                    "type": "DGCTestInformation"
                }
                }
            },
            "dgc.vaxComponent:1": {
                "columns": [
                {"path": "id", "encoder": "urn:uvci"},
                {"path": "issuerName", "encoder": "string"},
                {"path": "countryOfVaccination", "encoder": "string"},
                {"path": "vaccinationInformation.diseaseProtectedFrom", "encoder": "string"},
                {"path": "vaccinationInformation.prophylaxis", "encoder": "string"},
                {"path": "vaccinationInformation.dateOfVaccination", "encoder": "isodate-1900-base32"},
                {"path": "vaccinationInformation.dose", "encoder": "integer-base32"},
                {"path": "vaccinationInformation.totalDoses", "encoder": "integer-base32"},
                {"path": "vaccinationInformation.code", "encoder": "string"},
                {"path": "vaccinationInformation.marketingAuthHolder", "encoder": "string"},
                {"path": "vaccinationInformation.medicinalProductName", "encoder": "string"}
                ],
                "template": {
                "@context": [
                    "https://w3id.org/pathogen/v1"
                ],
                "type": "DGCProofOfVaccination",
                "vaccinationInformation": {
                    "@context": [
                        "https://w3id.org/pathogen/v1"
                    ],          
                    "type": "DGCVaccinationInformation"
                }
                }
            }, 
            "dgc.recvComponent:1": {
                "columns": [
                {"path": "id", "encoder": "urn:uvci"},
                {"path": "issuerName", "encoder": "string"},
                {"path": "countryOfTest", "encoder": "string"},
                {"path": "infectionInformation.validFrom", "encoder": "isodate-1900-base32"},
                {"path": "infectionInformation.validUntil", "encoder": "isodate-1900-base32"},
                {"path": "infectionInformation.diseaseRecoveredFrom", "encoder": "string"},
                {"path": "infectionInformation.dateFirstPositive", "encoder": "isodate-1900-base32"}
                ],
                "template": {
                "type": "DGCProofOfRecovery",
                "infectionInformation": {
                    "@context": [
                        "https://w3id.org/pathogen/v1"
                    ],          
                    "type": "DGCInfectionInformation"
                }
                }
            }
        };

        it("should pack the EU's DGC monstrosity", async function() {
            const CombinedDGC = {
                    "@context": ["https://www.w3.org/2018/credentials/v1", "https://w3id.org/dgc/v1", "https://w3id.org/security/bbs/v1"],
                    "type": ["VerifiableCredential"],
                    "credentialSubject": {
                        "@context": ["https://w3id.org/dgc/v1"],
                        "type": "DGCCertificate",
                        "personalInformation": {
                            "@context": ["https://w3id.org/dgc/v1"],
                            "type": "DGCSubject",
                            "familyName": "d'Arsøns - van Halen",
                            "givenName": "François-Joan",
                            "stdFamilyName": "DARSONS<VAN<HALEN",
                            "stdGivenName": "FRANCOIS<JOAN",
                            "birthDate": "2009-02-28"
                        },
                        "proofOfRecovery": [{
                            "@context": ["https://w3id.org/dgc/v1"],
                            "type": "DGCProofOfRecovery",
                            "id": "urn:uvci:01:NL:LSP/REC/1289821",
                            "issuerName": "Ministry of VWS",
                            "countryOfTest": "NL",
                            "infectionInformation": {
                                "@context": ["https://w3id.org/dgc/v1"],
                                "type": "DGCInfectionInformation",
                                "diseaseRecoveredFrom": "840539006",
                                "dateFirstPositive": "2021-04-21",
                                "validFrom": "2021-05-01",
                                "validUntil": "2021-10-21"
                            }
                        }],
                        "proofOfVaccination": [{
                            "@context": ["https://w3id.org/dgc/v1"],
                            "type": "DGCProofOfVaccination",
                            "id": "urn:uvci:01:NL:PlA8UWS60Z4RZXVALl6GAZ",
                            "issuerName": "Ministry of VWS",
                            "countryOfVaccination": "NL",
                            "vaccinationInformation": {
                                "@context": ["https://w3id.org/dgc/v1"],
                                "type": "DGCVaccinationInformation",
                                "diseaseProtectedFrom": "840539006",
                                "prophylaxis": "1119349007",
                                "dateOfVaccination": "2021-05-05",
                                "dose": 1,
                                "totalDoses": 2,
                                "code": "1119349007",
                                "marketingAuthHolder": "ORG-100030215",
                                "medicinalProductName": "EU/1/20/1528"
                            }
                        }, {
                            "@context": ["https://w3id.org/dgc/v1"],
                            "type": "DGCProofOfVaccination",
                            "id": "urn:uvci:01:NL:ATS342XDYS358FDFH3GTK5",
                            "issuerName": "Ministry of VWS",
                            "countryOfVaccination": "NL",
                            "vaccinationInformation": {
                                "@context": ["https://w3id.org/dgc/v1"],
                                "type": "DGCVaccinationInformation",
                                "diseaseProtectedFrom": "840539006",
                                "prophylaxis": "1119349007",
                                "dateOfVaccination": "2021-05-25",
                                "dose": 2,
                                "totalDoses": 2,
                                "code": "1119349007",
                                "marketingAuthHolder": "ORG-100030215",
                                "medicinalProductName": "EU/1/20/1528"
                            }
                        }],
                        "proofOfCovidTest": [{
                            "@context": ["https://w3id.org/dgc/v1"],
                            "type": "DGCProofOfCovidTest",
                            "id": "urn:uvci:01:NL:GGD/81AAH16AZ",
                            "issuerName": "Ministry of VWS",
                            "countryOfTestAdminstration": "NL",
                            "testInformation": {
                                "@context": ["https://w3id.org/dgc/v1"],
                                "type": "DGCTestInformation",
                                "diseaseTestedFrom": "840539006",
                                "testName": "COVID PCR",
                                "testManufacturer": "1232",
                                "testType": "LP217198-3",
                                "sampleCollectionDateTime": "2021-02-13T14:20:00Z",
                                "testResultDate": "2021-02-13T14:40:01Z",
                                "testResult": "260415000",
                                "testCenter": "GGD Fryslân, L-Heliconweg"
                            }
                        }, {
                            "@context": ["https://w3id.org/dgc/v1"],
                            "type": "DGCProofOfCovidTest",
                            "id": "urn:uvci:01:NL:GGD/23BBS36BC",
                            "issuerName": "Ministry of VWS",
                            "countryOfTestAdminstration": "NL",
                            "testInformation": {
                                "@context": ["https://w3id.org/dgc/v1"],
                                "type": "DGCTestInformation",
                                "diseaseTestedFrom": "840539006",
                                "testName": "NAAT TEST",
                                "testManufacturer": "1343",
                                "testType": "LP6464-4",
                                "sampleCollectionDateTime": "2021-04-13T14:20:00Z",
                                "testResultDate": "2021-04-13T14:40:01Z",
                                "testResult": "260373001",
                                "testCenter": "GGD Fryslân, L-Heliconweg"
                            }
                        }]
                    }
                };
            
            const unpacked = await jsonxt.pack(CombinedDGC, DGC_TEMPLATES, "dgc", "1", RESOLVER_NAME);

            const got = unpacked
            const want = "jxt:jsonxt.io:dgc:1:d'Ars%C3%B8ns~-~van~Halen/Fran%C3%A7ois-Joan/DARSONS%3CVAN%3CHALEN/FRANCOIS%3CJOAN/3AGM//2/01%3ANL%3APlA8UWS60Z4RZXVALl6GAZ/Ministry~of~VWS/NL/840539006/1119349007/3MBL/1/2/1119349007/ORG-100030215/EU%2F1%2F20%2F1528/01%3ANL%3AATS342XDYS358FDFH3GTK5/Ministry~of~VWS/NL/840539006/1119349007/3MC9/2/2/1119349007/ORG-100030215/EU%2F1%2F20%2F1528/2/01%3ANL%3AGGD%2F81AAH16AZ/Ministry~of~VWS//LP217198-3/260415000/GGD~Frysl%C3%A2n%2C~L-Heliconweg/840539006/COVID~PCR/1232/1G2FO0G/1G2FP61//01%3ANL%3AGGD%2F23BBS36BC/Ministry~of~VWS//LP6464-4/260373001/GGD~Frysl%C3%A2n%2C~L-Heliconweg/840539006/NAAT~TEST/1343/1G7BA4G/1G7BBA1//1/01%3ANL%3ALSP%2FREC%2F1289821/Ministry~of~VWS/NL/3MBH/3MJV/840539006/3MAJ";

            assert.deepEqual(got, want)
        });
    })

    it("edge case - no columns", async function() {
        const template = {}

        const TYPE = "template"
        const VERSION = "1"
        const original = {}

        const got = await jsonxt.pack.payload(original, template, TYPE, VERSION, RESOLVER_NAME)
        const want = ""

        assert.deepEqual(got, want)
    })
    it("expected fail - bad unknown encoder", async function() {
        const template = {
            "columns": [
                {
                    "path": "a",
                    "encoder": "does-not-exist",
                },
            ],
        }

        const TYPE = "template"
        const VERSION = "1"
        const original = {}

        assert.rejects(async () => {
            const packed = await jsonxt.pack.payload(original, template, TYPE, VERSION, RESOLVER_NAME)
        })
    })
})
