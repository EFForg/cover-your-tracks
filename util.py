import hmac


def number_format(num, places=0):
    """Format a number with grouped thousands and given decimal places"""

    places = max(0, places)
    tmp = "%.*f" % (places, num)
    point = tmp.find(".")
    integer = (point == -1) and tmp or tmp[:point]
    decimal = (point != -1) and tmp[point:] or ""

    count = 0
    formatted = []
    for i in range(len(integer), 0, -1):
        count += 1
        formatted.append(integer[i - 1])
        if count % 3 == 0 and i - 1:
            formatted.append(",")

    integer = "".join(formatted[::-1])
    return integer + decimal


def get_ip_hmacs(ip_addr, key):
    # result looks like 192.168.1
    google_style_ip_split = ip_addr.split(".")[0:3]
    # we're not handling ipv6
    google_style_ip_raw = ".".join(google_style_ip_split)

    google_style_ip = hmac.new(key, google_style_ip_raw).digest()
    ip = hmac.new(key, ip_addr).digest()
    return ip, google_style_ip
