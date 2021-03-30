<img src="https://consensas-aws.s3.amazonaws.com/icons/jsonxt-logo.png" align="right" />

# jsonxt
JSON External Templates

URL friendly JSON compression using eXternal Templates.
For constrained environments, such as QR codes.

See [jsonxt.io](https://jsonxt.io) for more.

## Installation

    npm install jsonxt

## Use

### Setup

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

* An example `original` is [here](https://github.com/Consensas/jsonxt/blob/main/test/data/w3vc-1-1.json)
* An example `templates` is [here](https://github.com/Consensas/jsonxt/blob/main/test/data/covid-templates.json)

The `templates` can have multiple compression formats encoded,
they will be selected by TYPE and VERSION.

### Encoding

This will compress the original JSON payload into a URI

    const packed = await jsonxt.pack(original, templates, TYPE, VERSION, "example.com")

Which yields (ignore newline)

    jxt:example.com:simple:1:Lady%20Gaga%20Concert/
    New%20Orleans%20Arena%2C%20New%20Orleans%2C%20Louisiana%2C%20USA/16Q1EM0

See [test code](https://github.com/Consensas/jsonxt/blob/main/test/pack.js) for a more
fully worked through example.

### Decoding

This will decompress the packed URI into the original URI.

    const unpacked = await jsonxt.unpack(packed, jsonxt.resolve)

See [test code](https://github.com/Consensas/jsonxt/blob/main/test/resolve.js) for a more
fully worked through example.

### Resolving

Resolving takes a "resolver name" like `example.com` embedded in the URI 
and a file name and retrieves a document.

The following rules are used:

* if it has a slash or a colon, it's treated a a URL (`https://` is assumed if no scheme)
* otherwise we check `https://resolver/.well-known/name`
* otherwise we check DNS `name._jsonxt.resolver` for a TXT record, with any extension stripped from `name`

Generally you can just use `jsonxt.resolve`.

## See Also

* [RFC2397](https://tools.ietf.org/html/rfc2397) - The "data" URL scheme
* [RFC3986](https://tools.ietf.org/html/rfc3986) - URI generic syntax
* [RFC4180](https://tools.ietf.org/html/rfc4180) - Common Format and MIME Type for CSV Files
* [RFC8141](https://tools.ietf.org/html/rfc8141) - Uniform Resource Names (URNs)
