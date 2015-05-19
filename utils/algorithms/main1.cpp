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
    uint32_t query_index = atoi(argv[1]);
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


    
	// Initialize the algorithm
	PrioReA *pra = new PrioReA(lines);
	// Get some query point
	// TODO: Should be given from command-line
	STUPLE q = pra->get(query_index);
	
	STUPLE soln;
	// Get the solution for this query point
	float score = pra->query(q, soln);
	// Print the result
	// TODO: This should be an output understood by the backend
	printf("Score: %f\n", score);
	soln.printTuple();
	
	delete pra;
    return 0;
}
