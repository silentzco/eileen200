import algoliasearch from 'algoliasearch/lite';
import instantsearch from 'instantsearch.js';

import {searchBox, hits, refinementList, stats, menu, geoSearch, configure, pagination, menuSelect} from 'instantsearch.js/es/widgets';
import { connectGeoSearch } from 'instantsearch.js/es/connectors';

const searchClient = algoliasearch('LYOAOTOT4D', '06f6868f86dd05c03ba16ec7f56db53d');

const search = instantsearch({
    indexName: 'providers',
    searchClient,
    routing: true,
    // searchFunction: function(helper) {
    //     helper.setQueryParameter('getRankingInfo', true);
    //
    //
    //
    //     helper.search();
    // }
});

// var placesAutocomplete = places({
//     appId: 'YOUR_PLACES_APP_ID',
//     apiKey: 'YOUR_PLACES_API_KEY',
//     container: document.querySelector('#address-input')
// });


// Create the render function
var map = null;
let markers = [];
let isUserInteraction = true;

const renderGeoSearch = (renderOptions, isFirstRendering) => {
    const {
        items,
        currentRefinement,
        refine,
        clearMapRefinement,
        widgetParams,
    } = renderOptions;

    const {
        initialZoom,
        initialPosition,
        container,
    } = widgetParams;


    let bounds = new google.maps.LatLngBounds();




    if (isFirstRendering) {


        map = new google.maps.Map(document.getElementById("maps"), {
            zoom: 4,
        });

        window.googleMap = map;
        console.log(renderOptions);





        map.addListener("dragend", () => {
            redraw();

            console.log('firing');
        });


        //
        // map.addListener("zoom_changed", () => {
        //     redraw();
        //
        //     console.log('firing');
        // });
        //

    }




    function redraw(){

        let bounding = map.getBounds();
        let NECorner = bounding.getNorthEast();
        let SWCorner = bounding.getSouthWest();


        console.log({lat: NECorner.lat(), lng: NECorner.lng(), lat2: SWCorner.lat(), lng2: SWCorner.lng()});

        refine({
            northEast: {lat: NECorner.lat(), lng: NECorner.lng()},
            southWest: {lat: SWCorner.lat(), lng: SWCorner.lng()},
        });


    }



    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];



    let infoWindow = new google.maps.InfoWindow(), marker, i;


    // Loop through our array of markers & place each one on the map
    for( i = 0; i < items.length; i++ ) {
        let position = items[i]._geoloc;


        bounds.extend(position);


        marker = new google.maps.Marker({
            position: position,
            map: map,
            title: items[i].title,
            objectID: items[i].objectID
        });

        // Allow each marker to have an info window
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {

                let content =
                    '<div>' +
                    '<span class="text-primary font-bold">' +
                    items[i].title +
                    '</span><br>' +
                    items[i].address + "<br>" +
                    items[i].city + ', ' + items[i].state + ' ' + items[i].zip + '<br><br>' +
                    '<span class="font-bold">' + items[i].services.join(", ") + "</span>" +
                    '</div>';


                infoWindow.setContent(content);
                infoWindow.open(map, marker);
            }
        })(marker, i));

        markers.push(marker);

        // Automatically center the map fitting all markers on the screen
    }




    if(typeof(geoloc) !== "undefined" && (geoloc)){
        placeZipMarker(geoloc);

    }





    // map.setCenter(bounds.getCenter());
    map.fitBounds(bounds);




    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
    // let boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
    //     this.setZoom(14);
    //     google.maps.event.removeListener(boundsListener);
    // });




};

// Create the custom widget
const customGeoSearch = connectGeoSearch(
    renderGeoSearch
);



function placeZipMarker(geoloc){

    const svgMarker = {
        path:
            "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
        fillColor: "#0000ff",
        fillOpacity: 0.9,
        strokeWeight: 0,
        rotation: 0,
        scale: 2,
        anchor: new google.maps.Point(15, 30),
    };

    var maxZindex = google.maps.Marker.MAX_ZINDEX;


    return new google.maps.Marker({
        position: geoloc,
        icon: svgMarker,
        zIndex: maxZindex + 1,
        map: map,
    });



}

function focusOnMarker(objectID){

    let i;
    for (i = 0; i < markers.length; i++) {
        if(objectID == markers[i].objectID){

            map.panTo(markers[i].position);
            google.maps.event.trigger(markers[i], 'click');


        }

    }

}



var zipGeoLocString;
if(typeof(geoloc) !== "undefined" && (geoloc)) {
    console.log(geoloc);
    zipGeoLocString = geoloc.lat + ',' + geoloc.lng;
}




search.addWidgets([

    configure({
        aroundLatLng: zipGeoLocString,
        // aroundRadius: 1000, // 10000 km
        hitsPerPage: 20,

    }),




    customGeoSearch({
        container: document.querySelector('#maps'),
        initialZoom: 12,

            googleReference: window.google,
            enableRefine: true,
        enableClearMapRefinement: true,
            enableRefineOnMapMove: true,

    }),

    searchBox({
        container: "#searchbox"
    }),


    stats({
        container: '#stats',
    }),


    pagination({
        container: '#pagination',
    }),


    // refinementList({
    //     container: "#category",
    //     attribute: 'category',
    //     operator: 'or',
    // }),

    refinementList({
        container: "#services",
        attribute: 'services',
    }),

    menuSelect({
        container: "#category",
        attribute: 'category',
        templates: {
            item:
                '{{label}} ({{#helpers.formatNumber}}{{count}}{{/helpers.formatNumber}})',
        },
    }),

    hits({
        container: '#hits',
        templates: {
            item: `
        <div class="provider-card bg-white rounded-lg shadow  divide-y divide-gray-100 my-10 {{#sponsored}} sponsored {{/sponsored}}">
        <div class="w-full flex items-center justify-between p-4 space-x-6">
            <div class="flex-1 truncate">
                <div class="flex items-center space-x-3">
                    <h3 class="text-gray-900 text-lg font-medium truncate">{{ title }}</h3>
                </div>

                    <div>

                        {{#services}}
                            <span class="flex-shrink-0 inline-block px-2 py-0.5  text-xs font-medium bg-secondary text-white rounded-full">{{ . }}</span>
                        {{/services}}


                    </div>

                    <div>
                        {{#org_name}}
                        <p class="mt-1 text-gray-500 text-sm truncate">{{ first_name }} {{last_name}}</p>
                        {{/org_name}}
                        <p class="mt-1 text-gray-500 text-sm truncate">
                            {{ address }}<br>
                            {{ city }}, {{ state }} {{ zip }}
                        </p>
                        <p class="mt-1 text-gray-500 text-sm truncate">
                            {{ phone }}
                        </p>


                    </div>
            </div>



            {{#image}}
            <img class="h-20 rounded flex-shrink-0" src="/assets/{{ image }}" alt="">
            {{/image}}
        </div>

        {{#description}}
            <div class="flex-1 p-4 text-sm description">
                {{{ description }}}
            </div>
        {{/description}}

        {{#sponsored}}
        <div class="inline-flex space-x-4 p-4">
            {{#gallery}}
                <div class="w-20 h-20 flex-1 galleryitem"><a href="#gallery-modal-{{id}}" data-galleryid="#gallery-modal-{{id}}" class="gallery-trigger" rel="modal:open"><img src="/assets/{{ . }}"></a></div>
            {{/gallery}}

            {{#video}}
                <a href="#video-modal-{{id}}" data-video="{{video}}" rel="modal:open" class="video-trigger w-20 h-20 bg-blue-200 flex-1 galleryitem flex items-center">
                <div class="w-10 h-10 mx-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" >
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                </svg>
                </div>
                </a>
            {{/video}}
        </div>
        {{/sponsored}}


            <div class="-mt-px flex divide-x divide-gray-200 provider-actions">
                {{#email}}
                <div class="w-0 flex-1 flex">
                    <a href="mailto:{{email}}" class="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500">
                        <!-- Heroicon name: mail -->
                        <svg class="w-5 h-5 " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <span class="ml-3">Email</span>
                    </a>
                </div>
                {{/email}}

                {{#phone}}
                <div class="-ml-px w-0 flex-1 flex">
                    <a href="tel:{{phone}}" class="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-br-lg hover:text-gray-500">
                        <!-- Heroicon name: phone -->
                        <svg class="w-5 h-5 " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <span class="ml-3">Call</span>
                    </a>
                </div>
                {{/phone}}

                {{#address}}
                <div class="-ml-px w-0 flex-1 flex">


                    <a href="#" data-objectid="{{objectID}}" class="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-br-lg hover:text-gray-500 markerMapLink">
                        <!-- Heroicon name: phone -->
                        <svg class="w-5 h-5 " xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span class="ml-3">Map</span>
                    </a>
                </div>
                {{/address}}


                {{#website}}
                <div class="-ml-px w-0 flex-1 flex">
                    <a href="{{website}}" target="_blank" class="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-br-lg hover:text-gray-500">
                        <!-- Heroicon name: phone -->
                        <svg class="w-5 h-5 " xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        <span class="ml-3">Website</span>
                    </a>
                </div>
                {{/website}}
            </div>



        {{#sponsored}}

        <div id="video-modal-{{id}}" class="modal video-modal">

            <iframe width="100%" height="380" src="{{ video }}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            <a href="#" rel="modal:close">Close</a>
        </div>


        <div id="gallery-modal-{{id}}" class="modal gallery-modal">

            <div class="modal-gallery">
                {{#gallery}}
                <div class=""><img src="/assets/{{ . }}"></div>
                {{/gallery}}

            </div>

            <a href="#" rel="modal:close">Close</a>
        </div>


        {{/sponsored}}
    </div>






    `,
        },
    }),




    // geoSearch({
    //     container: '#maps',
    //     googleReference: window.google,
    //     enableRefine: true,
    //     enableRefineOnMapMove: true,
    //
    //     // initialZoom: 4,
    //     // initialPosition: {
    //     //     lat: 48.864716,
    //     //     lng: 2.349014,
    //     // },
    //     // initialZoom: 4,
    //     // initialPosition: {
    //     //     lat: 48.864716,
    //     //     lng: 2.349014,
    //     // },
    //     builtInMarker: {
    //         createOptions(item) {
    //
    //
    //
    //
    //         },
    //         events: {
    //             click({event, item, marker, map}) {
    //
    //
    //                 const content =
    //                     '<div>' +
    //                     '<span class="text-primary font-bold">' +
    //                     item.title +
    //                     '</span><br>' +
    //                     item.address + "<br>" +
    //                     item.city + ', ' + item.state + ' ' + item.zip + '<br><br>' +
    //                     '<span class="font-bold">' + item.services.join(", ") + "</span>" +
    //                     '</div>';
    //
    //                 const infowindow = new google.maps.InfoWindow({
    //                     content: content,
    //                 });
    //
    //                 infowindow.open(map, marker);
    //                 setTimeout(function () {infowindow.close();}, 5000);
    //
    //                 console.log(marker);
    //                 console.log(item);
    //             },
    //         },
    //     },
    //     //   customHTMLMarker: {
    //     //       createOptions(item) {
    //     //           return {
    //     //               anchor: {
    //     //                   x: 0,
    //     //                   y: 0,
    //     //               },
    //     //           };
    //     //       },
    //     //       events: {
    //     //           click({ event, item, marker, map }) {
    //     //               console.log(item);
    //     //               console.log("foobar");
    //     //           },
    //     //       },
    //     //   },
    //     //   templates: {
    //     //       HTMLMarker: `
    //     //   <span class="marker">
    //     //     {{ title }} - {{ services }}
    //     //   </span>
    //     // `,
    //     //   },
    // })
]);




search.start();




$(function(){


    $('body').on('click','.markerMapLink',function(e) {
        e.preventDefault();
        let objectid = $(this).data('objectid');
        focusOnMarker(objectid);

    });



    $("#zip-refresh").click(function(){

        let zip = $("#zip").val();

        $.getJSON( "/search/getgeoloc",{zip: zip}, function( data ) {

            let newMarker = placeZipMarker(data.geoloc);

            map.panTo(newMarker.position);

        });



    });



});






