import os
import distutils.util

try:
    from config import *
except ImportError:
    from config_example import *


def env_bool(env, default):
    if os.environ.get(env):
        return distutils.util.strtobool(os.environ.get(env))
    else:
        return default


def env_str(env, default):
    return os.getenv(env, default)


def env_int(env, default):
    if os.environ.get(env):
        return int(os.environ.get(env))
    else:
        return default

debug = env_bool('DEBUG', debug)
secret_key = env_str('SECRET_KEY', secret_key).encode("utf-8", "surrogateescape")
public = env_bool('PUBLIC', public)
epoched = env_bool('EPOCHED', epoched)
epoch_days = env_int('EPOCH_DAYS', epoch_days)
sentry_dsn = env_str('SENTRY_DSN', sentry_dsn)
db_host = env_str('DB_HOST', db_host)
db_username = env_str('DB_USERNAME', db_username)
db_password = env_str('DB_PASSWORD', db_password)
db_database = env_str('DB_DATABASE', db_database)
db_port = env_int('DB_PORT', db_port)
keyfile = env_str('KEYFILE', keyfile)
admin_password = env_str('ADMIN_PASSWORD', admin_password)
use_matomo = env_bool('USE_MATOMO', use_matomo)
matomo_url = env_str('MATOMO_URL', matomo_url)
matomo_site_id = env_str('MATOMO_SITE_ID', matomo_site_id)
first_party_trackers = [
    env_str('FIRST_PARTY_TRACKERS_1', first_party_trackers[0]),
    env_str('FIRST_PARTY_TRACKERS_2', first_party_trackers[1]),
    env_str('FIRST_PARTY_TRACKERS_3', first_party_trackers[2])
]
third_party_trackers = {
    'ad_server': env_str('THIRD_PARTY_TRACKERS_AD_SERVER', third_party_trackers['ad_server']),
    'tracker_server': env_str('THIRD_PARTY_TRACKERS_TRACKER_SERVER', third_party_trackers['tracker_server']),
    'dnt_server': env_str('THIRD_PARTY_TRACKERS_DNT_SERVER', third_party_trackers['dnt_server'])
}
