#!/usr/bin/python
# -*- coding: UTF-8 -*-
import json
from pprint import pprint
from sys import argv
from random import choice, randint
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
with open('aarhus.json', 'rb') as f:
	# Source: http://dawa.aws.dk/adresser?format=json&kommunekode=0751
	data = json.load(f)

##
#	Define functions
##
def get_data(address):
	"""
	Extracts the coordinates and the address name, e.g.
	Stationsvangen 81, 8541 Skødstrup at (10.3038663068088, 56.2617675784168)
	"""
	coordinates = address["adgangsadresse"]["adgangspunkt"]["koordinater"]
	address_text = "{:s} {:s}, {:s} {:s}".format(
		address["adgangsadresse"]["vejstykke"]["navn"].encode('utf-8'),
		address["adgangsadresse"]["husnr"],
		address["adgangsadresse"]["postnummer"]["nr"],
		address["adgangsadresse"]["postnummer"]["navn"].encode('utf-8')
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
hotels = dict()
while len(hotels) != num_hotels:
	res = get_data(choice(data))
	hotels[res[1]] = {
		"coordinates": res[0]
	}

for hotel in hotels.keys():
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
			hotels[hotel][name] = d
		else:
			# Find dist
			hotels[hotel][name] = dist(coord, hotel_coord)
	# Rate the hotel
	hotels[hotel]["rating"] = choice(ratings)
	# Give it stars
	hotels[hotel]["stars"] = randint(1,5)
	# TODO: Give it a price depending on the above
pprint(hotels)
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
