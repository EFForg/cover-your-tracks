import hashlib


class FingerprintHelper(object):
    whorl_v2_names = {
        'user_agent': "User Agent",
        'http_accept': "HTTP_ACCEPT Headers",
        'plugins': "Browser Plugin Details",
        'timezone': "Time Zone Offset",
        'timezone_string': "Time Zone",
        'video': "Screen Size and Color Depth",
        'fonts_v2': "System Fonts",
        'cookie_enabled': "Are Cookies Enabled?",
        'supercookies_v2': "Limited supercookie test",
        'canvas_hash_v2': "Hash of canvas fingerprint",
        'webgl_hash_v2': "Hash of WebGL fingerprint",
        'webgl_vendor_renderer': "WebGL Vendor & Renderer",
        'dnt_enabled': "DNT Header Enabled?",
        'language': "Language",
        'platform': "Platform",
        'touch_support': "Touch Support",
        'ad_block': "Ad Blocker Used",
        'audio': "AudioContext fingerprint",
        'cpu_class': "CPU Class",
        'hardware_concurrency': "Hardware Concurrency",
        'device_memory': "Device Memory (GB)"
    }

    whorl_v3_names = {
        'user_agent': "User Agent",
        'http_accept': "HTTP_ACCEPT Headers",
        'loads_remote_fonts': "Loads Remote Fonts",
        'plugins': "Browser Plugin Details",
        'timezone': "Time Zone Offset",
        'timezone_string': "Time Zone",
        'video': "Screen Size and Color Depth",
        'fonts_v2': "System Fonts",
        'cookie_enabled': "Are Cookies Enabled?",
        'supercookies_v2': "Limited supercookie test",
        'canvas_hash_v2': "Hash of canvas fingerprint",
        'webgl_hash_v2': "Hash of WebGL fingerprint",
        'webgl_vendor_renderer': "WebGL Vendor & Renderer",
        'dnt_enabled': "DNT Header Enabled?",
        'language': "Language",
        'platform': "Platform",
        'touch_support': "Touch Support",
        'ad_block': "Ad Blocker Used",
        'audio': "AudioContext fingerprint",
        'cpu_class': "CPU Class",
        'hardware_concurrency': "Hardware Concurrency",
        'device_memory': "Device Memory (GB)"
    }

    # Which keys should be added to the expansion fingerprint tables?
    fingerprint_expansion_keys = {
        'v2': [
            'fonts_v2',
            'supercookies_v2',
            'canvas_hash_v2',
            'webgl_hash_v2',
            'timezone_string',
            'webgl_vendor_renderer',
            'ad_block',
            'audio',
            'cpu_class',
            'hardware_concurrency',
            'device_memory'
        ],
        'v3': [
            'loads_remote_fonts'
        ]
    }

    # Any value that is ever expected to be over 255 characters (the length of
    # the 'value' field in 'totals') should be contained in this list.
    md5_keys = [
        'plugins',
        'fonts_v2',
        'user_agent',
        'http_accept',
        'supercookies_v2',
        'touch_support',
        'webgl_vendor_renderer',
        'cpu_class'
    ]

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
