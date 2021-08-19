<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Statamic\Facades\Entry;

class SearchController extends Controller
{
    public function results(Request $request){


        $adStack = [];

        $currentServices = $request->input('providers.refinementList.services');
        if(!empty($currentServices)){
            $currentServices = array_map(function($text){return \Statamic\Support\Str::slug($text); }, $currentServices);
        }

        $currentCategories = [$request->input('providers.menu.category')];

        $vars['title'] =  'Search Results';



        $ads = \Statamic\Facades\Collection::find('ads')
            ->queryEntries()
            ->where('active', true)
            ->orderBy("order", "asc")
            ->get();

        foreach($ads as $ad){

            if(!empty($currentServices) && !empty($ad->get('services')) && !empty(array_intersect($ad->get('services'), $currentServices))){
                if(empty($adStack[$ad->get('placement')]['services'])){
                    $adStack[$ad->get('placement')]['services'] = $ad;
                }
            }

            if(!empty($currentCategories) && !empty($ad->get('categories')) && !empty(array_intersect($ad->get('categories'), $currentCategories))){
                if(empty($adStack[$ad->get('placement')]['categories'])){
                    $adStack[$ad->get('placement')]['categories'] = $ad;
                }
            }

            if(empty($ad->get('categories')) && empty($ad->get('services'))){
                $adStack[$ad->get('placement')]['random'][] = $ad;
            }
        }




        foreach($adStack as $placement => $data){
            if(!empty($data['services'])){

                $finalAd = $data['services'];
            }
            elseif(!empty($data['categories'])){
                $finalAd = $data['categories'];
            }
            elseif(!empty($data['random'])){
                $finalAd = $data['random'][array_rand($data['random'], 1)];
            }

            if($finalAd){
                $vars["ad_" . $placement] = ["link" => $finalAd->get("link"), "image" => "/assets/" . $finalAd->get("image")];

            }


        }



        if($zip = $request->input('providers.zip')){
            $zipcode = Entry::query()
                ->where('collection', 'zip_codes')
                ->where('code', $zip)
                ->first();


            if($zipcode){
                $vars['zipcode'] = $zip;
                $vars['geoloc'] = json_encode(['lng' => (float)$zipcode->get('longitude') , 'lat' => (float)$zipcode->get('latitude')]);
            }

        }


        return (new \Statamic\View\View)
            ->template('search/results')
            ->layout('layout')
            ->with($vars);




    }

    public function getGeoloc(Request $request){



        $zip = $request->input('zip');
            $zipcode = Entry::query()
                ->where('collection', 'zip_codes')
                ->where('code', $zip)
                ->first();


            if($zipcode){
                $vars['zipcode'] = $zip;
                $vars['geoloc'] = ['lng' => (float)$zipcode->get('longitude') , 'lat' => (float)$zipcode->get('latitude')];
            }


        return response()->json($vars);


    }


}
