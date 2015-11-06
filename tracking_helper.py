class TrackingHelper(object):
    valid_fields = {
        'block_tracking_ads': "Is your browser blocking tracking ads?",
        'block_invisible_trackers': "Is your browser blocking invisible trackers?",
        'dnt': "Is your browser accepting Do Not Track commitments?",
        'canvas_fingerprinting': "Is your browser blocking canvas fingerprint tracking?",
        'known_blockers': "The list of known blockers being used in your browser",
        'cookie_id': "PHP Cookie String",
        'ip': "IP Address, encrypted with HMAC & a rotated key",
        'ip34': "IP Address, 24 most significant bits",
        'timestamp': "Timestamp at time of insertion"
    }
