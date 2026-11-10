"""Transparent lexical/message rules. No fetching, external AI or persistence."""
import re
from .features import EXTRACT, parse_url, extract_features

BRANDS = {'paypal', 'google', 'microsoft', 'apple', 'amazon', 'netflix', 'facebook'}

def one_edit(a, b):
    if abs(len(a)-len(b)) > 1 or a == b:
        return False
    if len(a)==len(b):
        return sum(x!=y for x,y in zip(a,b))==1
    if len(a)>len(b): a,b=b,a
    return any(b[:i]+b[i+1:]==a for i in range(len(b)))

def url_findings(url):
    _, parts, host = parse_url(url)
    f=extract_features(url)
    domain=EXTRACT(host)
    findings=[]
    def add(kind, evidence, explanation):
        findings.append({'kind':kind,'evidence':evidence,'explanation':explanation})
    if f['ip_host']:
        add('IP-based address',host,'This address uses an IP instead of a recognizable domain. That can obscure who operates it; it is not proof of phishing.')
    if parts.username is not None:
        add('Misleading user information',parts.netloc,'Text before @ is not the destination. The actual hostname is '+host+'.')
    if f['punycode']:
        add('Internationalized hostname',host,'Encoded international characters can resemble familiar letters. Many legitimate sites also use them; verify the exact domain independently.')
    for brand in sorted(BRANDS):
        if brand in domain.subdomain.lower().split('.') and domain.domain != brand:
            add('Brand name in a subdomain',brand, f'The name {brand} appears before the real registrable domain, {domain.top_domain_under_public_suffix or host}. A subdomain does not establish affiliation.')
        normalized=domain.domain.translate(str.maketrans({'0':'o','1':'l','3':'e','5':'s'}))
        if one_edit(domain.domain,brand) or (normalized==brand and normalized!=domain.domain):
            add('Possible spelling trick',domain.domain,f'This hostname resembles {brand}, but differs in spelling. This limited brand rule is a warning to verify, not a claim of impersonation.')
    if f['subdomains']>=3:
        add('Deep subdomain structure',host,'Several subdomain levels can make the actual registered domain harder to spot.')
    if f['length']>150 or f['percent_signs']>=3 or f['hyphens']>=4:
        add('Unusual URL structure',f"{f['length']} characters; {f['percent_signs']} percent signs; {f['hyphens']} hyphens",'Long or heavily encoded addresses can conceal destinations or parameters. Tracking links can also look like this.')
    if parts.port not in (None,80,443):
        add('Unusual network port',str(parts.port),'This port is uncommon for public websites. Confirm it was expected.')
    return {'findings':findings,'rule_summary':'Warning signs detected' if findings else 'No obvious warning signs detected',
            'hostname':host,'registrable_domain':domain.top_domain_under_public_suffix or host,
            'transport_note':'HTTPS encrypts the connection; it does not prove a website is legitimate.' if parts.scheme=='https' else 'HTTP does not encrypt the connection. Do not enter sensitive information.',
            'analysis_type':'Rule-based URL observations, separate from the trained model verdict'}

RULES=[
 ('Urgent language',r'\b(?:urgent|immediately|act now|within 24 hours|last chance|account (?:will be )?(?:suspended|closed))\b','Pressure can discourage you from checking the request independently.'),
 ('Claimed authority or identity',r'\b(?:IT support|help ?desk|security team|your bank|CEO|Microsoft|PayPal|Amazon|Google|Apple)\b','A familiar organization or authority can be impersonated. Pasted text alone cannot authenticate the sender.'),
 ('Credential request',r'\b(?:verify your account|confirm your password|enter your password|sign in|log in|verification code|one[- ]time (?:code|password)|social security number)\b','Unexpected requests for passwords, codes or personal data can enable account theft.'),
 ('Payment request',r'\b(?:wire transfer|gift cards?|pay now|payment overdue|send money|bank details|credit card|bitcoin|crypto(?:currency)?)\b','Unexpected payments or financial-detail requests should be verified through a known contact channel.')]
LINK=re.compile(r'(?i)\b(?:https?://[^\s<>"\x27]+|www\.[^\s<>"\x27]+|(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,63}(?:/[^\s<>"\x27]*)?)')

def analyze_message(text):
    findings=[]
    for kind, pattern, explanation in RULES:
        for match in re.finditer(pattern,text,re.I):
            # Dart string offsets are UTF-16 code units, not Python codepoints.
            start=len(text[:match.start()].encode('utf-16-le'))//2
            end=len(text[:match.end()].encode('utf-16-le'))//2
            findings.append({'kind':kind,'evidence':match.group(),'explanation':explanation,'start':start,'end':end})
    links=[]
    for match in LINK.finditer(text):
        if match.start()>0 and text[match.start()-1]=='@': continue
        value=match.group().rstrip('.,;:!?)]}')
        if value not in links: links.append(value)
    return {'analysis_type':'Rule-based message analysis; no email model or AI service is connected.',
        'summary':'Review the highlighted warning signs' if findings else 'No obvious warning signs detected',
        'findings':findings[:100],'links':links[:10], 'links_found':len(links),'links_omitted':max(0,len(links)-10),
        'limitations':'Rules can miss phishing and flag innocent phrases. Sender authenticity, attachments, shortened-link destinations and hidden HTML targets are not verified. Nothing is opened or fetched.',
        'privacy':'Message content is processed by your configured backend and is not saved by this application. Only separately submitted URL scans enter device history.'}
