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

// TODO: Make independendt of NUM_DIMS
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

class PrioReA {
private:
	const uint32_t n;
	const uint32_t num_dims;
	STUPLE *data;
	
	/**
	 * The actual implementation of the PriReA
	 */
	float alg(const vector<STUPLE> &points, const STUPLE &q, const STUPLE &origin, STUPLE &soln, vector<uint32_t> &dims);
	
	/*
	 *	THIS PRIVATE SECTION ONLY CONTAINS HELPER FUNCTIONS - SEE PUBLIC BELOW FOR MORE
	 */
	 
	/**
	 *
	 */
	void sortByDim( vector<STUPLE> &p, const STUPLE &o, const uint32_t d, const vector<uint32_t> dims ) {
		for (uint32_t i = 0; i < p.size(); ++i) {
		    p[i].score = p[i].elems[d] - o.elems[d];
		    const uint32_t min_d = getMinDim( p[i], o, dims );
		    p[i].min_val = p[i].elems[min_d] - o.elems[min_d];
		}
		sort( p.begin(), p.end() );
	}
	
	/**
	 *
	 */
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
	 * Returns the L_1 (i.e., Manhattan) distance from p1 to p2.
	 */
	inline float l1_dist( const STUPLE &p1, const STUPLE &p2 ) {
		float x = 0;
		for(uint32_t d = 0; d < this->num_dims; ++d) {
		    float y = p1.elems[d] - p2.elems[d];
		    x += (y > 0) ? y: -1*y;
		}
		return x;
	}
	
	/**
	 *
	 */
	inline bool DominateLeft(const TUPLE &t1, const TUPLE &t2) {
		uint32_t i;
		for (i = 0; i < this->num_dims && t1.elems[i] <= t2.elems[i]; ++i)
		;
		if ( i < this->num_dims )
			return false; // Points are incomparable.

		for (i = 0; i < this->num_dims; ++i) {
			if ( t1.elems[i] < t2.elems[i] ) {
		  		return true; // t1 dominates t2
			}
		}
		return false; // Points are equal.
	}
	
	/*
	 * 2-way dominance test with NO assumption for distinct value condition.
	 */
	inline int DominanceTest(const TUPLE &t1, const TUPLE &t2) {
		bool t1_better = false, t2_better = false;

		for (uint32_t i = 0; i < this->num_dims; i++) {
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
	
	/**
	 * Copies the coordinates of src to dest.
	 */
	inline void copyTuple( const STUPLE &src, STUPLE &dest ) {
		for(uint32_t i = 0; i < this->num_dims; ++i)
		    dest.elems[i] = src.elems[i];
	}
public:
	/**
	 * Returns the pid'th tuple
	 */
	STUPLE get(uint32_t pid);
	
	/**
	 *	Makes a query on q, sets the solution in soln and returns the score
	 */
	float query(const STUPLE &q, STUPLE &soln);
	
	/**
	 * Prepares all the input data
	 */
	PrioReA(vector<vector<float>> &input) : 
		n(input.size()),
		num_dims(input[0].size()) {
		
		this->data = new STUPLE[this->n];
		/* Corresponds to McSky::Init  */
		for(uint32_t i = 0; i < this->n; i++) {
		    this->data[i].pid = i;
		    for(uint32_t j = 0; j < this->num_dims; j++) {
		        this->data[i].elems[j] = input[i][j];
		    }
		}			
	}
	
	/**
	 *	Clean up the memory
	 */
	~PrioReA() {
		delete[] this->data;
	}
};

