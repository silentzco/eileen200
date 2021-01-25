// This is all you.
import algoliasearch from 'algoliasearch/lite';
import instantsearch from 'instantsearch.js';
import { searchBox, hits } from 'instantsearch.js/es/widgets';

const searchClient = algoliasearch('LYOAOTOT4D', '06f6868f86dd05c03ba16ec7f56db53d');

const search = instantsearch({
    indexName: 'providers',
    searchClient,
});

search.addWidgets([
    searchBox({
        container: "#searchbox"
    }),

    hits({
        container: "#hits"
    })
]);

search.start();
