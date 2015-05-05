/* ---------------------------------------------------------------------------
** This software is implemented as part of a project at Aarhus Univerity Denmark. 
**
** PrioReA.cpp
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
** -------------------------------------------------------------------------*/

//  Can at the momemnt compiles using
//      g++ -c -std=c++11 PrioReA.cpp -DNUM_DIMS=6 
#include "PrioReA.hpp"

/**
 * Copies the coordinates of src to dest.
 */
inline void copyTuple( const STUPLE &src, STUPLE &dest ) {
    for(uint32_t i = 0; i < NUM_DIMS; ++i)
        dest.elems[i] = src.elems[i];
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
        dims.push_back( it->second );
      }
    return;
}

inline uint32_t getMinDim(const STUPLE &p, const STUPLE &origin, const vector<uint32_t> dims ) {
  uint32_t d = dims[0];
  for(uint32_t i = 1; i < dims.size(); ++i) {
    if( p.elems[dims[i]] - origin.elems[dims[i]] < p.elems[d] - origin.elems[d] ) {  d = i; }
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


float PrioReA(  const vector<STUPLE> &points,   //< All points within q_L and q_U
                const STUPLE &q,                //< The query
                const STUPLE &origin,           //<
                STUPLE &soln,                   //< The solution
                vector<uint32_t> &dims ) {      //<

    /* First base case: no points in this partition! */
    if( !points.size() ) {
        copyTuple( origin, soln );
        return 0;
    }
    
    vector<STUPLE> mypoints ( points );
    float score = l1_dist ( q, origin );
    
    for(uint32_t d = 0; d < dims.size(); ++d ) {
        uint32_t cur_dim = dims[d];
        vector<uint32_t> dims_left ( dims );
        dims_left.erase( dims_left.begin() );
        
        /* Sort data by active dimension, and populate metadata. */
        sortByDim( mypoints, origin, cur_dim, dims_left );
        float max = 0;
        for (vector<STUPLE>::iterator it = mypoints.begin(); it != mypoints.end(); ++it) {
            if( it->score + max < score ) {
                STUPLE soln_recursion ( origin );
                vector<uint32_t> dims_recursion ( dims_left );
                float recurse_score = PrioReA(
                    vector<STUPLE> ( mypoints.begin(), it ),
                    q,
                    origin,
                    soln_recursion,
                    dims_recursion 
                );
                if( recurse_score + it->score < score ) {
                    score = it->score + recurse_score;
                    copyTuple( soln_recursion, soln );
                    soln.elems[ cur_dim ] += it->score;
                } else if ( recurse_score >= score ) { //Condition (2) met
                    break;
                }
            } else if ( max >= score ) { //Condition (2) met
                break;
            } else { //Condition (1) met
                // Do nothing. No recurse.
            }
            
            if( it->min_val > max ) { 
                max = it->min_val;
            }
        }
    }
    return score;
}