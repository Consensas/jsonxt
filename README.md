# jsonxt
JSON External Templates

URL friendly JSON compression using eXternal Templates.
For constrained environments, such as QR codes.

See [jsonxt.io](https://jsonxt.io) for more.

## Installation

    npm install jsonxt

## Use
### Encoding

    const jsonxt = require("jsonxt")

    compressed = jsonxt.compress(original, template, "https://example.com/template")
    url = jsonxt.urn.csv(compressed)
    url = jsonxt.urn.json(compressed)

### Decoding

    unpacked = jsonxt.urn.unpack(url)
    decompressed = await jsonxt.decompress(unpacked, template_url => {
        return template
    })

## See Also

* [RFC4180](https://tools.ietf.org/html/rfc4180) - Common Format and MIME Type for CSV Files
* [RFC2397](https://tools.ietf.org/html/rfc2397) - The "data" URL scheme
* [RFC3986](https://tools.ietf.org/html/rfc3986) - 
* [RFC8141](https://tools.ietf.org/html/rfc8141) - 


## URN 

    namestring    = assigned-name
    assigned-name = "urn" ":" NID ":" NSS
    NID           = (alphanum) 0*30(ldh) (alphanum)
    ldh           = alphanum / "-"
    NSS           = pchar *(pchar / "/")

    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
    reserved      = gen-delims / sub-delims
    gen-delims    = ":" / "/" / "?" / "#" / "[" / "]" / "@"
    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
                    / "*" / "+" / "," / ";" / "="

