from math import radians, cos, asin, sqrt
import json
def load_data():
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
	return data
	
def haversine_dist(a, b):
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
	
def get_data(address):
	"""
	Extracts the coordinates and the address name, e.g.
	Stationsvangen 81, 8541 Skoedstrup at (10.3038663068088, 56.2617675784168)
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
