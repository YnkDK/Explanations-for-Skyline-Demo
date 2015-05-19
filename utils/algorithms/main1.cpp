/* ------------------------------------------------------------------------------
** This software is implemented as part of a project at Aarhus Univerity Denmark. 
**
** main.cpp
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
#include <iostream>
#include <cstring>
#include <string>
#include <sstream>

struct membuf : std::streambuf
{
    membuf(char* begin, char* end) {
        this->setg(begin, begin, end);
    }
};

int main(int argc, char **argv) {
    // TODO: Use arguments to select which dimensions that should be used
    uint32_t pid = atoi(argv[1]);
    //
    std::string line = argv[2];
    std::stringstream ss(line);
    std::string item;
    float tmp[1];
    
    vector<vector<float>> lines;
    while (std::getline(ss, item, '|')) {
        sscanf(item.c_str(), "%f", &tmp[0]);
 	    vector<float> tmp2;
	    tmp2.push_back(tmp[0]);
        lines.push_back(tmp2);
    }


    	STUPLE *data = new STUPLE[lines.size()];
	/* Corresponds to McSky::Init  */
	for(uint32_t i = 0; i < lines.size(); i++) {
	    data[i].pid = i;
	    for(uint32_t j = 0; j < NUM_DIMS; j++) {
	        data[i].elems[j] = lines[i][j];
	    }
	}	
	
	STUPLE origin;
    /* Init origin to (0, ..., 0). */
    for(uint32_t i = 0; i < NUM_DIMS; ++i ) { origin.elems[i] = 0.0; }

	/* Init dims */
    vector<uint32_t> dims;
    dims.reserve( NUM_DIMS );
    for(uint32_t i = 0; i < NUM_DIMS; ++i) { dims.push_back( i ); }
    
    /* Corresponds to McSky::getCloseDoms */
	vector<STUPLE> closedoms;
	for ( uint32_t i = 0; i < lines.size(); ++i ) {
    	
		if ( i == pid ) continue; // don't compare to oneself.
		if ( DominateLeft( origin, data[i]) && DominateLeft( data[i], data[pid] ) ) {
   			uint32_t j;
            for ( j = 0; j < closedoms.size(); ++j ) {
                int dt_res = DominanceTest(data[i], closedoms.at( j ) );
                if( dt_res == DOM_LEFT )
                    break; //clearly not close dominating.
                else if ( dt_res == DOM_RIGHT ) {
                    closedoms.erase( closedoms.begin() + j ); //old point not close dominating.
                }
            }
            if( j >= closedoms.size() ) {
            	closedoms.push_back( data[i] );
        	}     
        }
    }
    STUPLE q = data[pid];
	STUPLE soln;
	PrioReA(closedoms, q, origin, soln, dims);

	for(int i = 0; i < NUM_DIMS-1; i++) {
		std::cout << soln.elems[i] << ",";
	}
	std::cout << soln.elems[NUM_DIMS-1];
    return 0;
}
