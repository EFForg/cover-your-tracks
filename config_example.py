debug = True
secret_key = ''  # import os; os.urandom(24)
public = False
epoched = False
session_lifetime = 90 # in days
sentry_dsn = None  # change if you're using sentry exception handler

# database settings
db_host = 'localhost'
db_username = 'panopticlick'
db_password = 'changeme'
db_database = 'panopticlick'
db_port = 3306

# file for key material to use with hmac'ing ip addresses. 16 bytes
keyfile = '/path/to/some/keyfile'

# a list of comma-separated IPs which are authorized to refresh key material
# from the keyfile via /refresh-key
refresh_key_password = 'changeme'

# the domains for first-party trackers. order matters, only 3
first_party_trackers = [
    'panopticlick.eff.org',
    'firstpartysimulator.net',
    'firstpartysimulator.org'
]

third_party_trackers = {
    'ad_server': 'trackersimulator.org',
    'tracker_server': 'eviltracker.net',
    'dnt_server': 'do-not-tracker.org'
}
