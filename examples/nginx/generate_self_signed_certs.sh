#!/bin/bash

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
commonName_default = panopticlick.eff.org
commonName_max  = 64

[ v3_req ]
# Extensions to add to a certificate request
basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = panopticlick.eff.org
DNS.2 = trackersimulator.org
DNS.3 = firstpartysimulator.org
DNS.4 = firstpartysimulator.net
DNS.5 = eviltracker.net
DNS.6 = do-not-tracker.org
EOF

openssl genrsa -out extra/private/panopticlick.eff.org.key 4092
openssl req -new -batch -out extra/private/panopticlick.eff.org.csr -key extra/private/panopticlick.eff.org.key -config /tmp/gen_cert.cnf 
openssl x509 -req -days 3650 -in extra/private/panopticlick.eff.org.csr -signkey extra/private/panopticlick.eff.org.key -out extra/certs/panopticlick.eff.org.pem

DOMAINS="trackersimulator.org firstpartysimulator.org firstpartysimulator.net eviltracker.net do-not-tracker.org"

cd extra/private
for x in $DOMAINS; do
  ln -sf panopticlick.eff.org.key $x.key
done
cd ../certs

for x in $DOMAINS; do
  ln -sf panopticlick.eff.org.pem $x.pem
done
cd ../..
