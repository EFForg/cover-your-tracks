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
        'supercookies': "Limited supercookie test"
    }

    md5_keys = [
        'plugins', 'fonts', 'user_agent', 'http_accept', 'supercookies']

    @classmethod
    def value_or_md5(cls, whorls):
        # within the live totals table, using the md5 hash of some long string
        # values is more efficient for queries that are just looking for total
        # value count
        md5_whorls = whorls.copy()
        for i in md5_whorls:
            if i in cls.md5_keys:
                md5_whorls[i] = hashlib.md5(md5_whorls[i]).hexdigest()
        return md5_whorls
