<img src="https://consensas-aws.s3.amazonaws.com/icons/jsonxt-logo.png" align="right" />

# JSON External Templates

JSON-XT compresses JSON documents into short URIs, using eXternal Templates.
Depending on the application, these URIs are 25 - 35% of the original
JSON document size.

Great for constrained environments, such as encoding data in QR codes.

See [jsonxt.io](https://jsonxt.io) for more, as well as
[this paper](https://docs.google.com/document/d/1VNwdpAjxrfwIMGhbLTdhTDOJujG9tmrqoBJRWcHALxA)
for a lot more explanation.

## Installation

### Node.JS

    npm install jsonxt

#### Python

    pip install jsonxt

## Use

### Setup (Javascript)

    const jsonxt = require("jsonxt")

    // sample data…
    const original = {
      "@context": {
        "ical": "http://www.w3.org/2002/12/cal/ical#",
        "xsd": "http://www.w3.org/2001/XMLSchema#",
        "ical:dtstart": {
          "@type": "xsd:dateTime"
        }
      },
      "ical:summary": "Lady Gaga Concert",
      "ical:location": "New Orleans Arena, New Orleans, Louisiana, USA",
      "ical:dtstart": "2011-04-09T20:00:00Z"
    }
    const templates = {
      "simple:1": {
        "columns": [
          {
            "path": "ical:summary", 
            "type": "string"
          }, 
          {
            "path": "ical:location", 
            "type": "string"
          }, 
          {
            "path": "ical:dtstart", 
            "type": "isodatetime-epoch-base32"
          }
        ], 
        "template": {
          "@context": {
            "ical": "http://www.w3.org/2002/12/cal/ical#", 
            "ical:dtstart": {
              "@type": "xsd:dateTime"
            }, 
            "xsd": "http://www.w3.org/2001/XMLSchema#"
          }
        }
      }
    }
    const TYPE = "simple"
    const VERSION = "1"

* An example `original` is [here](https://github.com/Consensas/jsonxt/blob/main/data/w3vc-1-1.json)
* An example `templates` is [here](https://github.com/Consensas/jsonxt/blob/main/data/covid-templates.json)

The `templates` can have multiple compression formats encoded,
they will be selected by TYPE and VERSION.

### Encoding

This will compress the original JSON payload into a URI

Javascript:

    const packed = await jsonxt.pack(original, templates, TYPE, VERSION, "example.com")

Which yields (ignore newline)

    jxt:jsonxt.io:simple:1:Lady~Gaga~Concert/
      New~Orleans~Arena%2C~New~Orleans%2C~Louisiana%2C~USA/16Q1EM0

This is a compression of 279 bytes to 101 bytes: 36% of the original size.

See [test code](https://github.com/Consensas/jsonxt/blob/main/javascript/test/pack.js) for a more
fully worked through example.

### Decoding

This will decompress the packed URI into the original URI.

Javascript:

    const unpacked = await jsonxt.unpack(packed, jsonxt.resolve)

Python (package details being worked out):

    unpacked = jsonxt.unpack(packed, jsonxt.resolve)

### Resolving

Resolving takes a "resolver name" like `example.com` embedded in the URI 
and a file name and retrieves a document.

The following rules are used:

* if it has a slash or a colon, it's treated a a URL (`https://` is assumed if no scheme)
* otherwise we check `https://resolver/.well-known/name`

Generally you can just use `jsonxt.resolve`.

## See Also

* [RFC2397](https://tools.ietf.org/html/rfc2397) - The "data" URL scheme
* [RFC3986](https://tools.ietf.org/html/rfc3986) - URI generic syntax
* [RFC4180](https://tools.ietf.org/html/rfc4180) - Common Format and MIME Type for CSV Files
* [RFC8141](https://tools.ietf.org/html/rfc8141) - Uniform Resource Names (URNs)
