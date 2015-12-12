import hashlib


class FingerprintHelper(object):
    whorl_names = {
        'user_agent': "User Agent",
        'http_accept': "HTTP_ACCEPT Headers",
        'plugins': "Browser Plugin Details",
        'timezone': "Time Zone",
        'video': "Screen Size and Color Depth",
        'fonts': "System Fonts",
        'cookie_enabled': "Are Cookies Enabled?",
        'supercookies': "Limited supercookie test",
        'canvas_hash': "Hash of canvas fingerprint",
        'webgl_hash': "Hash of WebGL fingerprint",
        'dnt_enabled': "DNT Header Enabled?",
        'language': "Language",
        'platform': "Platform",
        'touch_support': "Touch Support"
    }

    legacy_keys = ['user_agent', 'http_accept', 'plugins',
                   'timezone', 'video', 'fonts', 'cookie_enabled', 'supercookies']

    md5_keys = [
        'plugins', 'fonts', 'user_agent', 'http_accept', 'supercookies', 'touch_support']

    @classmethod
    def value_or_md5(cls, whorls):
        # within the live totals table, using the md5 hash of some long string
        # values is more efficient for queries that are just looking for total
        # value count
        md5_whorls = whorls.copy()
        for i in md5_whorls:
            if i in cls.md5_keys:
                md5_whorls[i] = hashlib.md5(
                    md5_whorls[i].encode('ascii', 'ignore')).hexdigest()
        return md5_whorls
