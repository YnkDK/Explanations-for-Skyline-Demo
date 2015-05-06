CC = g++

TARGET = Sky

SRC = $(wildcard *.cpp)

DIMS=6

CXXFLAGS = -O3\
		   -DNUM_DIMS=$(DIMS)\
		   -Wall\
		   -std=c++11
		   
all: $(SRC)
	$(CC) -o $(TARGET) $(CXXFLAGS) $(SRC)

