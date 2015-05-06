#include "PrioReA.hpp"
#include <iostream>

int main(int argc, char **argv) {
    // TODO: Check if argument(s) seems right
    int query;
    /* Read input file */
    vector<vector<float>> lines;
    FILE *inputFile = fopen(argv[1], "r");
    
    float tmp[6];
    int n = 0;
    
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

    /* Corresponds to McSky::Init */
    STUPLE *data = new STUPLE[n];
    for(int i = 0; i < n; i++) {
        data[i].pid = i;
        for(int j = 0; j < NUM_DIMS; j++) {
            data[i].elems[j] = lines[i][j];
        }
    }
    
    for(int i = 0; i < n; i++) {
        query = i;
        STUPLE q, origin, soln;
        /* Init origin to (0, ..., 0). */
        for(uint32_t i = 0; i < NUM_DIMS; ++i ) { origin.elems[i] = 0.0; }
        
        copyTuple( data[ query ], q );
        
        /* Corresponds to McSky::getCloseDoms */
        vector<STUPLE> closedoms;
        for ( int i = 0; i < n; ++i ) {

            if ( i == query ) continue; // don't compare to oneself.

            if ( DominateLeft( origin, data[i]) && DominateLeft( data[i], data[query] ) ) {

                uint32_t j;
                for ( j = 0; j < closedoms.size(); ++j ) {
                    int dt_res = DominanceTest(data[i], closedoms.at( j ) );
                    if( dt_res == DOM_LEFT )
                        break; //clearly not close dominating.
                    else if ( dt_res == DOM_RIGHT ) {
                        closedoms.erase( closedoms.begin() + j ); //old point not close dominating.
                    }
                }
                if( j >= closedoms.size() ) 
                closedoms.push_back( data[i] );
            }
        }
        
        // Initialize the dims
        vector<uint32_t> dims;
        dims.reserve( NUM_DIMS );
        for(uint32_t i = 0; i < NUM_DIMS; ++i) { dims.push_back( i ); }
        // Run PrioReA using q
        float score = PrioReA(
            closedoms,
            q,
            origin,
            soln,
            dims
        );
        
        /* Prettyprint if it requries a change */
        if(score > 0) {
            printf("Query (q):       ");       
            
            data[query].printTuple(); 
            printf("Solution (soln): ");
            soln.printTuple();
            printf("Score: %10.5f ", score);
            for(int k = 0; k < NUM_DIMS; k++) {
                if(soln.elems[k] > 0.0) {
                    printf("   ^^^^^^^^^^ ");
                } else {
                    printf("              ");
                }
            }
            printf("\n\n");
        } 
    }
    return 0;
}
