import algoliasearch from 'algoliasearch';
import instantsearch from 'instantsearch.js';
import algoliaPlaces from 'places.js';


import { geoSearch, places} from 'instantsearch.js/es/widgets';

const searchClient = algoliasearch('LYOAOTOT4D', '06f6868f86dd05c03ba16ec7f56db53d');

const search = instantsearch({
    indexName: 'providers',
    searchClient,
    // routing: true,
});




search.addWidgets([
    places({
        container: '#searchbox',
        placesReference: algoliaPlaces,
    }),
    geoSearch({
        container: '#maps',
        googleReference: window.google,
    }),
]);

search.start();
