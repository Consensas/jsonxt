import sys
import os
import json
import pprint
import copy
import collections
import _util
import decoders

def unpack_payload(payload, template):
    minors = payload.split("/")

    template = _util.Template(template)
    unpacked = template.template

    for li in xrange(0, len(template.columns)):
        packed_value = ""
        if li < len(minors): packed_value = minors[li] 

        rule = template.columns[li]

        decoder_name = rule.encoder.replace("-", "_")
        if not hasattr(decoders, decoder_name):
            raise Error("unknown decoding: ${rule.encoder}")
            continue

        decoder = getattr(decoders, decoder_name)
        unpacked_value = decoder(rule, packed_value)
        
        _util.set(unpacked, rule.path, unpacked_value)

    return unpacked

def unpack(packed, resolver_resolver):
    if not _util.isString(packed):
        raise Error("jsonxt.unpack: 'packed' not String")
    if not _util.isFunction(resolver_resolver):
        raise Error("jsonxt.unpack: 'resolver_resolver' not Function")

    majors = packed.split(":")

    if len(majors) < 5:
        raise Error("jsonxt.unpack: expected at least 5 parts")

    schema = _util.decode(majors[0].lower())
    resolver_name = _util.decode(majors[1].lower())
    type = _util.decode(majors[2].lower())
    version = _util.decode(majors[3].lower())

    if schema != "jxt":
        raise Error("jsonxt.unpack: unknown schema '${schema}'")

    templates = resolver_resolver(resolver_name, "templates.json")
    if _util.isString(templates):
        templates = json.loads(templates)
    if not _util.isPlainObject(templates):
        raise Error("jsonxt.unpack: 'templates' not Plain Object")

    type_version = "%(type)s:%(version)s" % {
        "type": type,
        "version": version,
    }

    template = templates[type_version]
    if not _util.isPlainObject(template):
        raise Error("jsonxt.unpack: 'templates['${type}:${version}']' not String")

    return unpack_payload(majors[4], template)
    
__dirname__ = os.path.dirname(os.path.abspath(__file__))
TESTS = os.path.join(__dirname__, "..", "test", "data")

with open(os.path.join(TESTS, "c4-1-1-packed.txt")) as fin:
    uri = fin.read()

def resolver(resolver_name, resolver_type):
    with open(os.path.join(TESTS, "covid-templates.json")) as fin:
        return fin.read()

result = unpack(uri, resolver)
print(json.dumps(result, indent=2))
