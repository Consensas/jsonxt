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

* An example `original` is [here](https://github.com/Consensas/jsonxt/blob/main/test/data/w3vc-1-1.json)
* An example `templates` is [here](https://github.com/Consensas/jsonxt/blob/main/test/data/templates.json)

The `templates` can have multiple compression formats encoded,
they will be selected by TYPE and VERSION.

### Encoding

This will compress the original JSON payload into a URI

    const packed = await jsonxt.pack(original, templates, TYPE, VERSION, "example.com")

See [test code](https://github.com/Consensas/jsonxt/blob/main/test/pack.js) for a more
fully worked through example.

### Decoding

This will decompress the packed URI into the original URI.

    const unpacked = await jsonxt.unpack(packed, resolver => {
        return templates
    })

Note that resolver will be handed e.g. "example.com" and you are expected 
to come up with the `templates`.

See [test code](https://github.com/Consensas/jsonxt/blob/main/test/unpack.js) for a more
fully worked through example.

## Resolving

## See Also

* [RFC2397](https://tools.ietf.org/html/rfc2397) - The "data" URL scheme
* [RFC3986](https://tools.ietf.org/html/rfc3986) - URI generic syntax
* [RFC4180](https://tools.ietf.org/html/rfc4180) - Common Format and MIME Type for CSV Files
* [RFC8141](https://tools.ietf.org/html/rfc8141) - Uniform Resource Names (URNs)
