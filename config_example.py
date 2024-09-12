debug = True
secret_key = ''  # import os; os.urandom(24)
public = False
epoched = False
epoch_days = 45
sentry_dsn = None  # change if you're using sentry exception handler

# database settings
db_host = 'localhost'
db_username = 'coveryourtracks'
db_password = 'changeme'
db_database = 'coveryourtracks'
db_port = 3306

# file for key material to use with hmac'ing ip addresses. 16 bytes
keyfile = '/path/to/some/keyfile'

# a password which authorizes various administrative tasks
admin_password = 'changeme'

# if your site wishes to use Matomo for analytics
use_matomo = False
matomo_url = 'anon-stats.eff.org'
matomo_site_id = '40'

# the domains for first-party trackers. order matters, only 3
first_party_trackers = [
    'coveryourtracks.eff.org',
    'firstpartysimulator.net',
    'firstpartysimulator.org'
]

third_party_trackers = {
    'ad_server': 'trackersimulator.org',
    'tracker_server': 'eviltracker.net',
    'dnt_server': 'do-not-tracker.org'
}
