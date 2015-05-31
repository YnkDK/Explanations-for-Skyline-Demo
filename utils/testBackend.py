
import urllib
import json
import cookielib
import urllib2
from copy import deepcopy

cookies = cookielib.LWPCookieJar()
handlers = [
    urllib2.HTTPHandler(),
    urllib2.HTTPSHandler(),
    urllib2.HTTPCookieProcessor(cookies)
    ]
opener = urllib2.build_opener(*handlers)

def fetch(uri):
	req = urllib2.Request(uri)
	return opener.open(req)

def dump():
    for cookie in cookies:
        print cookie.name, cookie.value

isMax = {
	"aros": False,
	"beach": False,
	"downtown": False,
	"price": False,
	"rating": True,
	"roomsize": True,
	"wifi": True
}

# 
default = {
	"aros": 'true',
	"arosFrom": 0.10003916481637,
	"arosTo": 12.714817477269,
	"arosType": 'MIN',
	"beach": 'true',
	"beachFrom": 0,
	"beachTo": 17,
	"beachType": 'MIN',
	"downtown": 'true',
	"downtownFrom": 0,
	"downtownTo": 13,
	"downtownType": 'MIN',
	"price": 'true',
	"priceFrom": 40,
	"priceTo": 220,
	"priceType": 'MIN',
	"rating": 'true',
	"ratingFrom": 0.030115750601928,
	"ratingTo": 9.9841456889027,
	"ratingType": 'MAX',
	"roomsize": 'true',
	"roomsizeFrom": 20.278424702576,
	"roomsizeTo": 99.448560920795,
	"roomsizeType": 'MAX',
	"wifi": 'true',
	"wifiFrom": 1.014073666991,
	"wifiTo": 53.988875083735,
	"wifiType": 'MAX'
}
# Get hotels not in skyline using max range
f = fetch('http://localhost:31337/backend/hotels.php?' + urllib.urlencode(default))
hotels = json.loads(f.read())
print 'Hotels not in skyline:', len(hotels["notSkyline"])


for hotel in hotels["notSkyline"]:
	# Reset PHP Session etc
	cookies.clear()
	# Update PHP Session
	fetch('http://localhost:31337/backend/hotels.php?' + urllib.urlencode(default))
	current = hotel["id"]
	print "Running on ID:", current,
	skyNot = fetch('http://localhost:31337/backend/skyNot.php?id={:d}'.format(current)).read()
	# Load response for sky-not query
	qL = json.loads(skyNot)
	# Prepare for new query
	newQuery = deepcopy(default)
	# Update using an epsilon value
	for k,v in qL["qL"].iteritems():
		if isMax[k]:
			newQuery["{:s}To".format(k)] = v - 0.000000001
		else:
			newQuery["{:s}From".format(k)] = v + 0.000000001
	# Request with new query, expect it to be in skyline
	tmp = json.loads(fetch('http://localhost:31337/backend/hotels.php?' + urllib.urlencode(newQuery)).read())
	for t in tmp["skyline"]:
		if t["id"] == hotel["id"]:
			break
	else:
		# If we completed the for-loop without a break, we got an error!
		print '< ERROR',
	print ''
