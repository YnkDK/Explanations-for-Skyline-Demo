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

int main(int argc, char **argv) {
    // TODO: Use arguments to select which dimensions that should be used
    
    /* Read input file */
    vector<vector<float>> lines;
    FILE *inputFile = fopen(argv[1], "r");
    
    // TODO: Make dynamic-ish as a function of the number of dimensions used
    float tmp[6];
    int n = 0;
    
    // TODO: Only store the "active" dimensions
	while(fscanf(inputFile, "%f,%f,%f,%f,%f,%f", &tmp[0], &tmp[1], &tmp[2], &tmp[3], &tmp[4], &tmp[5]) != EOF){    
	    vector<float> tmp2;
	    tmp2.push_back(tmp[0]);
	    tmp2.push_back(tmp[1]);
	    tmp2.push_back(tmp[2]);
	    tmp2.push_back(tmp[3]);
	    tmp2.push_back(tmp[4]);
	    tmp2.push_back(tmp[5]);
        lines.push_back(tmp2);
        n++;
	}
	// Initialize the algorithm
	PrioReA *pra = new PrioReA(lines);
	// Get some query point
	// TODO: Should be given from command-line
	STUPLE q = pra->get(atoi(argv[2]));
	
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
