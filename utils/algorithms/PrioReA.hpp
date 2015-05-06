/* ------------------------------------------------------------------------------
** This software is implemented as part of a project at Aarhus Univerity Denmark. 
**
** PrioReA.hpp
** Implementation of Prioritized Recursion Algorithm, which an adaption of the
** work performed by:
**
** Sean Chester and Ira Assent. (2015).
** "Explanations for skyline query results."
** Proceedings of the 18th International Conference on Extending
** DatabaseTechnology (EDBT 2015), pp. 349-360. DOI:  10.5441/002/edbt.2015.31
**
** Licensed under CC BY-NC 4.0
**
** Author: Martin Storgaard, Jesper M. Kristensen and Lars Christensen
** Supervisors: Ira Assent and Sean Chester
**
** 4th quarter 2015
** ----------------------------------------------------------------------------*/
#include <map>
#include <vector>
#include <cstdint>
#include <algorithm>
#include <stdio.h>

#define DOM_LEFT   0
#define DOM_RIGHT  1
#define DOM_INCOMP  2

using namespace std;

typedef struct TUPLE {
    float elems[NUM_DIMS];
    int pid;

    void printTuple() {
        printf( "[" );
        for (uint32_t i = 0; i < NUM_DIMS; ++i)
            printf( "%13.8f ", elems[i] );
        printf( "]\n" );
    }

    uint32_t numset( const TUPLE &origin ) {
        uint32_t n = 0;
            for(uint32_t i = 0; i < NUM_DIMS; ++i )
                if( elems[i] > origin.elems[i] ) { ++n; }
        return n;
    }

} TUPLE;

// Sort-based Tuple
typedef struct STUPLE: TUPLE {
    float score; // value on dimension of interest
    float min_val; //minimum value on other dimensions

    // By default, STUPLEs are sorted by score value
    bool operator<(const STUPLE &rhs) const {
        return score > rhs.score;
    }
} STUPLE;

// Define the algorithm
float PrioReA(  const vector<STUPLE> &points, const STUPLE &q, const STUPLE &origin, STUPLE &soln, vector<uint32_t> &dims );

/*
 *	FROM HERE ONLY HELPER FUNCTIONS ARE DEFINED
 */
 
 
/**
 * Copies the coordinates of src to dest.
 */
inline void copyTuple( const STUPLE &src, STUPLE &dest ) {
    for(uint32_t i = 0; i < NUM_DIMS; ++i)
        dest.elems[i] = src.elems[i];
}

/*
 * 2-way dominance test with NO assumption for distinct value condition.
 */
inline int DominanceTest(const TUPLE &t1, const TUPLE &t2) {
	bool t1_better = false, t2_better = false;

	for (uint32_t i = 0; i < NUM_DIMS; i++) {
		if ( t1.elems[i] < t2.elems[i] )
			t1_better = true;
		else if ( t1.elems[i] > t2.elems[i] )
			t2_better = true;

		if ( t1_better && t2_better )
			return DOM_INCOMP;
	}
	if ( !t1_better && t2_better )
		return DOM_RIGHT;
	if ( !t2_better && t1_better )
		return DOM_LEFT;

	//    if ( !t1_better && !t2_better )
	//      return DOM_INCOMP; //equal
	return DOM_INCOMP;
}

inline bool DominateLeft(const TUPLE &t1, const TUPLE &t2) {
	uint32_t i;
	for (i = 0; i < NUM_DIMS && t1.elems[i] <= t2.elems[i]; ++i)
	;
	if ( i < NUM_DIMS )
		return false; // Points are incomparable.

	for (i = 0; i < NUM_DIMS; ++i) {
		if ( t1.elems[i] < t2.elems[i] ) {
	  		return true; // t1 dominates t2
		}
	}
	return false; // Points are equal.
}

/**
 * Returns the L_1 (i.e., Manhattan) distance from p1 to p2.
 */
inline float l1_dist( const STUPLE &p1, const STUPLE &p2 ) {
    float x = 0;
    for(uint32_t d = 0; d < NUM_DIMS; ++d) {
        float y = p1.elems[d] - p2.elems[d];
        x += (y > 0) ? y: -1*y;
    }
    return x;
}

/**
 * Selects the index of dims for the dimension in which q is closest to o and
 * removes it from dims.
 */
void sort_dims( const STUPLE &q, const STUPLE &o, vector<uint32_t> &dims ) {
    map<float, uint32_t> m;
    for (uint32_t i = 0; i < dims.size(); ++i) {
        m.insert( pair<float, uint32_t> ( q.elems[dims[i]] - o.elems[dims[i]], dims[i] ) );
    }
    dims.clear();
    for(map<float, uint32_t>::iterator it = m.begin(); it != m.end(); ++it ) {
        // Push the dimensions back, now in sorted order    
        dims.push_back( it->second );
    }
    return;
}

inline uint32_t getMinDim(const STUPLE &p, const STUPLE &origin, const vector<uint32_t> dims ) {
  uint32_t d = dims[0];
  for(uint32_t i = 1; i < dims.size(); ++i) {
    if( p.elems[dims[i]] - origin.elems[dims[i]] < p.elems[d] - origin.elems[d] ) {
        d = i;
    }
  }
  return d;
}

/**
 * Sorts tuples in p by dimension d, meanwhile updating their min distances from 
 * the origin, o, with respect to other dimensions in dim.
 */
void sortByDim( vector<STUPLE> &p, const STUPLE &o, const uint32_t d, const vector<uint32_t> dims ) {
    for (uint32_t i = 0; i < p.size(); ++i) {
        p[i].score = p[i].elems[d] - o.elems[d];
        const uint32_t min_d = getMinDim( p[i], o, dims );
        p[i].min_val = p[i].elems[min_d] - o.elems[min_d];
    }
    sort( p.begin(), p.end() );
}
