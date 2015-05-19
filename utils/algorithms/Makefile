CC = g++

SRC = $(wildcard *.cpp)

CXXFLAGS = -O3\
		   -Wall\
		   -std=c++11
		   
all: $(SRC)
	$(CC) -o Sky6 $(CXXFLAGS) -DNUM_DIMS=6 main6.cpp PrioReA.cpp
	$(CC) -o Sky5 $(CXXFLAGS) -DNUM_DIMS=5 main5.cpp PrioReA.cpp
	$(CC) -o Sky4 $(CXXFLAGS) -DNUM_DIMS=4 main4.cpp PrioReA.cpp
	$(CC) -o Sky3 $(CXXFLAGS) -DNUM_DIMS=3 main3.cpp PrioReA.cpp
	$(CC) -o Sky2 $(CXXFLAGS) -DNUM_DIMS=2 main2.cpp PrioReA.cpp
	$(CC) -o Sky1 $(CXXFLAGS) -DNUM_DIMS=1 main1.cpp PrioReA.cpp


