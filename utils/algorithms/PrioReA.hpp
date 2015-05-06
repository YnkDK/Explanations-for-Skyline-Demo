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

using namespace std;

typedef struct TUPLE {
    float elems[NUM_DIMS];
    int pid;

    void printTuple() {
        printf( "[" );
        for (uint32_t i = 0; i < NUM_DIMS; ++i)
            printf( "%.16f ", elems[i] );
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
