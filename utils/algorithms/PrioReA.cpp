/* ------------------------------------------------------------------------------
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
** ----------------------------------------------------------------------------*/

#include "PrioReA.hpp"

/**
 *	Get a tuple
 */
STUPLE PrioReA::get(uint32_t pid) {
	if(pid > this->n) {
		fprintf(stderr, "Index out of bounds (Request: %d Max: %d)\n", pid, this->n-1);
		STUPLE err = STUPLE();
		err.pid = -1;
		return err;
	}
	return this->data[pid];
}

/**
 *	Prepare the query, prune by finding close dominations
 */
float PrioReA::query(const STUPLE &q, STUPLE &soln) {
	const int pid = q.pid;
    STUPLE origin;
    /* Init origin to (0, ..., 0). */
    for(uint32_t i = 0; i < this->num_dims; ++i ) { origin.elems[i] = 0.0; }

	/* Init dims */
    vector<uint32_t> dims;
    dims.reserve( NUM_DIMS );
    for(uint32_t i = 0; i < NUM_DIMS; ++i) { dims.push_back( i ); }
    
    /* Corresponds to McSky::getCloseDoms */
	vector<STUPLE> closedoms;
	for ( int i = 0; i < (int)this->n; ++i ) {
    	
		if ( i == pid ) continue; // don't compare to oneself.
		if ( DominateLeft( origin, this->data[i]) && DominateLeft( this->data[i], this->data[pid] ) ) {
   			uint32_t j;
            for ( j = 0; j < closedoms.size(); ++j ) {
                int dt_res = DominanceTest(this->data[i], closedoms.at( j ) );
                if( dt_res == DOM_LEFT )
                    break; //clearly not close dominating.
                else if ( dt_res == DOM_RIGHT ) {
                    closedoms.erase( closedoms.begin() + j ); //old point not close dominating.
                }
            }
            if( j >= closedoms.size() ) {
            	closedoms.push_back( this->data[i] );
        	}     
        }
    }
    
	return this->alg(closedoms, q, origin, soln, dims);
}

/**
 *	The actual algorithm
 */
float PrioReA::alg(	const vector<STUPLE> &points,   //< All points within q_L and q_U
                	const STUPLE &q,                //< The query
                	const STUPLE &origin,           //< (0,0,...,0)
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
                float recurse_score = this->alg(
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
