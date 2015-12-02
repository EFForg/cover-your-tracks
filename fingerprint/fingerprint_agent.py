class FingerprintAgent(object):

    def __init__(self, request):
        self.request = request

    def detect_server_whorls(self):
        vars = {}
        # get cookie enabled
        if self.request.cookies:
            vars['cookie_enabled'] = 'Yes'
        else:
            vars['cookie_enabled'] = 'No'

        # get user_agent
        vars['user_agent'] = self._get_header('User-Agent')
        # get http_accept
        vars['http_accept'] = " ".join([
            self._get_header('Accept'),
            self._get_header('Accept-Charset'),
            self._get_header('Accept-Encoding'),
            self._get_header('Accept-Language')
        ])

        vars['dnt_enabled'] = (self._get_header('DNT') != "")

        # these are dummies:
        vars['plugins'] = "no javascript"
        vars['video'] = "no javascript"
        vars['timezone'] = "no javascript"
        vars['fonts'] = "no javascript"
        vars['supercookies'] = "no javascript"
        vars['canvas_hash'] = "no javascript"
        vars['webgl_hash'] = "no javascript"
        vars['language'] = "no javascript"
        vars['platform'] = "no javascript"
        vars['touch_support'] = "no javascript"

        return vars

    def _get_header(self, header):
        return self.request.headers.get(header) or ""
