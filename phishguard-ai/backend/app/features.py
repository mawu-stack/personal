"""Shared, network-free lexical representation for training and inference."""
import ipaddress
import math
import re
from collections import Counter
from urllib.parse import urlsplit, urlunsplit
import tldextract

SCHEMA_VERSION = 'lexical-v1'
EXTRACT = tldextract.TLDExtract(suffix_list_urls=(), cache_dir=None, include_psl_private_domains=True)
FEATURES = ['length', 'host_length', 'path_length', 'query_length', 'dots', 'hyphens',
            'digits', 'digit_ratio', 'slashes', 'percent_signs', 'at_signs', 'query_params',
            'subdomains', 'ip_host', 'explicit_port', 'https', 'entropy', 'sensitive_words', 'punycode']

def parse_url(value):
    if not isinstance(value, str):
        raise ValueError('Enter a URL as text.')
    value = value.strip()
    if not value or len(value) > 2048 or re.search(r'[\s<>"\\\x00-\x1f\x7f]', value):
        raise ValueError('Use a URL of 1–2048 characters without spaces, markup or backslashes.')
    # Missing schemes are consistently interpreted as HTTP in both paths.
    if '://' not in value:
        if re.match(r'^[a-zA-Z][a-zA-Z0-9+.-]*:', value) and not re.match(r'^[^/:]+:\d+(?:/|$)', value):
            raise ValueError('Only HTTP and HTTPS URLs are supported.')
        value = 'http://' + value
    try:
        parts = urlsplit(value)
        if parts.scheme.lower() not in ('http', 'https') or not parts.hostname:
            raise ValueError()
        host = parts.hostname.encode('idna').decode('ascii').lower().rstrip('.')
        port = parts.port
        try:
            ipaddress.ip_address(host)
        except ValueError:
            if '.' not in host or any(not re.fullmatch(r'[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?', s) for s in host.split('.')):
                raise ValueError()
        if port is not None and not 1 <= port <= 65535:
            raise ValueError()
    except (ValueError, UnicodeError):
        raise ValueError('Enter a valid HTTP(S) URL with a dotted hostname or IP address.') from None
    return value, parts, host

def canonical_url(value):
    _, p, host = parse_url(value)
    authority = ('[' + host + ']') if ':' in host else host
    if p.username is not None:
        authority = p.netloc.rsplit('@', 1)[0] + '@' + authority
    if p.port is not None:
        authority += ':' + str(p.port)
    return urlunsplit((p.scheme.lower(), authority, p.path or '/', p.query, ''))

def domain_group(value):
    _, _, host = parse_url(value)
    e = EXTRACT(host)
    return e.top_domain_under_public_suffix or host

def extract_features(value):
    value, p, host = parse_url(value)
    try:
        ipaddress.ip_address(host)
        ip_host = 1
    except ValueError:
        ip_host = 0
    digits = sum(c.isdigit() for c in value)
    counts = Counter(value)
    e = EXTRACT(host)
    values = [len(value), len(host), len(p.path), len(p.query), value.count('.'), value.count('-'),
              digits, digits / len(value), value.count('/'), value.count('%'), value.count('@'),
              len(p.query.split('&')) if p.query else 0,
              len(e.subdomain.split('.')) if e.subdomain else 0, ip_host, int(p.port is not None),
              int(p.scheme == 'https'), -sum((n/len(value))*math.log2(n/len(value)) for n in counts.values()),
              sum(value.lower().count(w) for w in ('login', 'verify', 'account', 'secure', 'update', 'password', 'bank')),
              int('xn--' in host)]
    return dict(zip(FEATURES, values))
