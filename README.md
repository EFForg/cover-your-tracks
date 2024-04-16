# Cover Your Tracks (formerly Panopticlick)

How Unique - and Trackable - Is Your Browser?

## Installation

The easiest way to set up an instance of Cover Your Tracks is with `docker` and `docker-compose`, but it can be installed on a host machine if desired.

### Partial Installation on Host

You may need to install `libmysqlclient-dev` and `python3.11-dev` for Debian-based systems.

    pip install pipenv
    pipenv --python 3.11
    pipenv install
    cp config_example.py config.py

Then modify the relevant variables in config.py

Now, you can run

    pipenv run python main.py

### Full Docker Installation

To generate self-signed certificates for the Cover Your Tracks hosts, cd into `examples/nginx` and run

    ./generate_self_signed_certs.sh

Change each of the secrets in `docker/secrets/` to a random value.

Then, from the git root, run

    docker-compose up

## Admin Routes

The following routes allow you to perform administrative tasks on the application.  For each of the following `curl` commands, be sure to change the `password` to what you've set as the admin password in your `config.py` or `docker-compose.yml` file.  Remove the `--insecure` flag in production.

### `POST /refresh-key`

To have the application re-read the keyfile, which contains the key to the HMAC function for storing IP addresses, issue the following command:

    curl -X POST -H 'Content-Type: application/json' -d '{"password": "changeme"}' --insecure https://coveryourtracks.eff.org/refresh-key

### `POST /migrate-db`

To migrate the database to the latest version of the application, issue the following command:

    curl -X POST -H 'Content-Type: application/json' -d '{"password": "changeme"}' --insecure https://coveryourtracks.eff.org/migrate-db

### `POST /epoch-update-totals`

To update the totals table to reflect the number of times we've seen each fingerprinting characteristic in the last epoch (45 days), issue the following command:

    curl -X POST -H 'Content-Type: application/json' -d '{"password": "changeme"}' --insecure https://coveryourtracks.eff.org/epoch-update-totals

## Viewing Locally

Unless you've changed the server names specified in `config.py`, you'll have to add the following line to your `/etc/hosts` file:

    127.0.0.1 coveryourtracks.eff.org trackersimulator.org firstpartysimulator.org firstpartysimulator.net eviltracker.net do-not-tracker.org

If you generated the certs yourself, in Firefox you'll have to go into private browsing mode to see the "I Understand the Risks" dialogue.  You may also have to manually go to each of the above domains and go through the certificate exception process for each one in order for the application to be fully functional. Or with chrome, you can start chrome with the `--ignore-certificate-errors` flag, but beware this will ignore *all* certificate errors.

## License

This project is licensed under the Affero General Public License, version 3.  See the LICENSE file for details.

## Credits

This is a rewrite of the original Cover Your Tracks codebase, developed by Peter Eckersley at the Electronic Frontier Foundation.  Currently maintained by William Budington.
