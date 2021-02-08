/******/ (() => { // webpackBootstrap
/*!*****************************!*\
  !*** ./resources/js/app.js ***!
  \*****************************/
/* global algoliasearch instantsearch */
var searchClient = algoliasearch('LYOAOTOT4D', '06f6868f86dd05c03ba16ec7f56db53d');
var search = instantsearch({
  indexName: 'providers',
  searchClient: searchClient,
  routing: true
});
search.addWidgets([instantsearch.widgets.configure({
  aroundLatLngViaIP: true,
  hitsPerPage: 12
}), instantsearch.widgets.searchBox({
  container: '#searchbox'
}), instantsearch.widgets.hits({
  container: '#hits',
  templates: {
    item: "\n<article>\n  <h1>{{#helpers.highlight}}{ \"attribute\": \"title\" }{{/helpers.highlight}}</h1>\n  <p>{{#helpers.highlight}}{ \"attribute\": \"org_name\" }{{/helpers.highlight}}</p>\n  <p>{{#helpers.highlight}}{ \"attribute\": \"first_name\" }{{/helpers.highlight}}</p>\n  <p>{{#helpers.highlight}}{ \"attribute\": \"last_name\" }{{/helpers.highlight}}</p>\n\n\n  <p><strong>{{ sponsored }}</strong></p>\n</article>\n"
  }
}), instantsearch.widgets.pagination({
  container: '#pagination'
}), instantsearch.widgets.refinementList({
  // ...
  container: '#refinement-list',
  attribute: 'sponsored'
}), instantsearch.widgets.geoSearch({
  container: '#maps',
  googleReference: window.google,
  initialZoom: 4,
  initialPosition: {
    lat: 48.864716,
    lng: 2.349014
  }
})]);
search.start();
/******/ })()
;