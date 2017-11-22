#!/bin/bash

DOMAINS="panopticlick.eff.org trackersimulator.org firstpartysimulator.org firstpartysimulator.net eviltracker.net do-not-tracker.org"

for x in $DOMAINS; do
cat <<EOF > /tmp/gen_cert.cnf
[req]
distinguished_name = req_distinguished_name
req_extensions = v3_req
default_md = sha256

[req_distinguished_name]
countryName = Country Name (2 letter code)
countryName_default = US
stateOrProvinceName = State or Province Name (full name)
stateOrProvinceName_default = California
localityName = Locality Name (eg, city)
localityName_default = San Francisco
organizationalUnitName  = Organizational Unit Name (eg, section)
organizationalUnitName_default  = Electronic Frontier Foundation
commonName = Common Name (ie hostname or username)
commonName_default = $x
commonName_max  = 64

[ v3_req ]
# Extensions to add to a certificate request
basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
EOF

openssl genrsa -out extra/private/$x.key 4092
openssl req -new -batch -out extra/private/$x.csr -key extra/private/$x.key -config /tmp/gen_cert.cnf 
openssl x509 -req -days 3650 -in extra/private/$x.csr -signkey extra/private/$x.key -out extra/certs/$x.pem
done
