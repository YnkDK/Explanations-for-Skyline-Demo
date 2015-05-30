#!/usr/bin/python
# -*- coding: UTF-8 -*-
import json
from sys import argv
from random import choice, randint, uniform
from utils import load_data, get_data, haversine_dist

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
	"downtown": (10.203955, 56.150150), # Aarhus H
	"aros": (10.199743, 56.153931) # ARoS
}

if __name__ == '__main__':
	##
	#	Load the data
	##
	data = load_data()



	##
	#	Generate the random hotels
	##
	print "Generating random hotels..."
	hotels = dict()
	hotel_names = set()
	identifier = 0
	while len(hotel_names) != num_hotels:
		res = get_data(choice(data))
		if res[0] is None:
			continue
		if res[1] not in hotel_names:
			hotels[identifier] = {
				"coordinates": res[0],
				"address": res[1]
			}
			hotel_names.add(res[1])
			identifier += 1

	# At this points the hotels have an address and longtitude and lattitude
	# Add some nice attributes
	for key in hotels.keys():
		# Calculate the distances to sights/attractions
		hotel_coord = hotels[key]["coordinates"]
		for sight_name, coord in dists.iteritems():
			if isinstance(coord, list):
				# This could be beaches, now
				# find the closest one
				minDist = float("inf")
				for c in coord:
					d = haversine_dist(c, hotel_coord)
					if d < minDist:
						minDist = d
			else:
				# Find dist
				d = haversine_dist(coord, hotel_coord)
			# The current hotel gets a distance to the current sight
			hotels[key][sight_name] = d
		
		# Now add the average user rating
		hotels[key]["rating"] = uniform(0, 10)
		# Room size
		hotels[key]["roomsize"] = uniform(20, 100)
		# WiFi
		hotels[key]["wifi"] = uniform(1, 54)
		# Finally calculate the price dependent on the other attributes
		price = 20 # Base line
		for sight_name in dists.keys():
			# Calculate the distances to each sight
			price += uniform(10,15)/hotels[key][sight_name]
		price += uniform(0.5, 1)*hotels[key]["roomsize"]
		price += uniform(0.1, 0.5)*hotels[key]["wifi"]
		hotels[key]["price"] = price

	##
	#	Dump the result
	##
	print "Dumps hotels"
	with open('hotels.json', 'wb') as f:
		f.write(json.dumps(hotels, ensure_ascii=False))
	
	
