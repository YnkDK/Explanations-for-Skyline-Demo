#!/usr/bin/python
# -*- coding: UTF-8 -*-
import json
from pprint import pprint
from sys import argv
from random import choice, randint, uniform
from math import radians, cos, asin, sqrt

##
#	Define constants
##
num_hotels = int(argv[1])
dists = {
	"beach": [
		(10.247888, 56.087895), # Moesgård Beach (South)
		(10.223856, 56.121784), # Ballehage Beach (South-mid)
		(10.231409, 56.176097), # The Permanent (North-mid)
		(10.282564, 56.202461)  # Åkrogen Beach (North)
	],
	"downtown": (10.203955, 56.150150) # Aarhus H
}
ratings = [ 
		0. ,  0.1,  0.2,  0.3,  0.4,  0.5,  0.6,  0.7,  0.8,  0.9,  1. ,
        1.1,  1.2,  1.3,  1.4,  1.5,  1.6,  1.7,  1.8,  1.9,  2. ,  2.1,
        2.2,  2.3,  2.4,  2.5,  2.6,  2.7,  2.8,  2.9,  3. ,  3.1,  3.2,
        3.3,  3.4,  3.5,  3.6,  3.7,  3.8,  3.9,  4. ,  4.1,  4.2,  4.3,
        4.4,  4.5,  4.6,  4.7,  4.8,  4.9,  5. ,  5.1,  5.2,  5.3,  5.4,
        5.5,  5.6,  5.7,  5.8,  5.9,  6. ,  6.1,  6.2,  6.3,  6.4,  6.5,
        6.6,  6.7,  6.8,  6.9,  7. ,  7.1,  7.2,  7.3,  7.4,  7.5,  7.6,
        7.7,  7.8,  7.9,  8. ,  8.1,  8.2,  8.3,  8.4,  8.5,  8.6,  8.7,
        8.8,  8.9,  9. ,  9.1,  9.2,  9.3,  9.4,  9.5,  9.6,  9.7,  9.8,
        9.9, 10.0
]
##
#	Load the data
##
try:
	with open('aarhus.json', mode='rb') as f:
		# Source: http://dawa.aws.dk/adresser?format=json&kommunekode=0751
		print 'Loading json...'
		data = json.load(f)
except IOError:
	import urllib2
	url = "http://dawa.aws.dk/adresser?format=json&kommunekode=0751"

	u = urllib2.urlopen(url)
	with open('aarhus.json', 'wb') as f:
		meta = u.info()
		file_size = 466045503
		print "Downloading aarhus.json (~488MB)"

		file_size_dl = 0
		block_sz = 8192
		while True:
			buffer = u.read(block_sz)
			if not buffer:
				break

			file_size_dl += len(buffer)
			f.write(buffer)
			status = r"%10d  [%3.2f%%]" % (file_size_dl, file_size_dl * 100. / file_size)
			status = status + chr(8)*(len(status)+1)
			print status,
	status = r"Done!"
	print status + chr(8)*(len(status)+1),
	print ''
	
	with open('aarhus.json', 'rb') as f:
		print 'Loading json...'
		data = json.load(f, encoding="utf8")

##
#	Define functions
##
def get_data(address):
	"""
	Extracts the coordinates and the address name, e.g.
	Stationsvangen 81, 8541 Skødstrup at (10.3038663068088, 56.2617675784168)
	"""
	zipcode = int(address["adgangsadresse"]["postnummer"]["nr"])
	if not (8000 <= zipcode <= 8270):
		return None, None
	coordinates = address["adgangsadresse"]["adgangspunkt"]["koordinater"]
	address_text = "{:s} {:s}, {:s} {:s}".format(
		address["adgangsadresse"]["vejstykke"]["navn"].encode("utf-8"),
		address["adgangsadresse"]["husnr"],
		address["adgangsadresse"]["postnummer"]["nr"],
		address["adgangsadresse"]["postnummer"]["navn"].encode("utf-8")
	)
	return tuple(coordinates), address_text

def dist(a, b):
	"""
	Use the Haversine formula to estimate the distance
	between the a and b
	Soruce: http://en.wikipedia.org/wiki/Haversine_formula
	"""
	# Mean radius of earth (http://en.wikipedia.org/wiki/Earth_radius)
	r = 6371
	# Convert to radians
	a1, a2 = map(radians, a)
	b1, b2 = map(radians, b)
	# haversin(phi2-phi1)
	h1 = (1.0-cos(b2 - a2))/2.0
	# haversin(lambda2 - lambda1)
	h2 = (1.0-cos(b1 - a1))/2.0
	# The haversine formula
	h = h1 + cos(a2)*cos(b2)*h2
	# Solve for d  using arcsine
	d = 2*r*asin(sqrt(h))
	return d
	
##
#	Generate the random hotels
##
print "Generating random hotels..."
hotels = dict()
identifier = 0
while len(hotels) != num_hotels:
	res = get_data(choice(data))
	if res[0] is None:
		continue
	hotels[identifier] = {
		"coordinates": res[0],
		"address": res[1]
	}
	identifier += 1

maxStars = 0
maxPools = 0
maxRating = 0
for hotel in hotels.keys():
	# price
	hotels[hotel]["price"] = 20
	# Calculate distances to sights/attractions
	hotel_coord = hotels[hotel]["coordinates"]
	for name, coord in dists.iteritems():
		if isinstance(coord, list):
			# Find smallest dist
			minDist = float("inf")
			for c in coord:
				d = dist(c, hotel_coord)
				if d < minDist:
					minDist = d
		else:
			# Find dist
			d = dist(coord, hotel_coord)
		hotels[hotel][name] = d
		hotels[hotel]["price"] += uniform(10,15)/d
	# Rate the hotel
	rating = choice(ratings)
	hotels[hotel]["rating"] = rating
	if maxRating < rating:
		maxRating = rating
	# Give it stars
	stars = randint(1,5)
	hotels[hotel]["stars"] = stars
	hotels[hotel]["price"] += stars*uniform(15, 25)
	if maxStars < stars:
		maxStars = stars
	# It might have some pools
	pools = randint(0,5)
	hotels[hotel]["pools"] = pools
	hotels[hotel]["price"] += pools * uniform(4,6)
	if maxPools < pools:
		maxPools = pools
##
#	Dump the result
##
print "Dumps hotels"
with open('hotels.json', 'wb') as f:
	f.write(json.dumps(hotels, ensure_ascii=False))
	
with open('hotels.csv', 'wb') as f:
	formatted = ",".join(["{:f}"]*(len(hotels[0])-2)) + "\n"
	print formatted
	for h in hotels.keys():
		# TODO: This is hardcoded
		print hotels[h]
		f.write(formatted.format(
			hotels[h]["price"],
			hotels[h]["beach"],
			hotels[h]["downtown"],
			maxPools-hotels[h]["pools"],
			maxRating-hotels[h]["rating"],
			maxStars-hotels[h]["stars"]
		))
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
