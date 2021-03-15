<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Statamic\Facades\Entry;

class SearchController extends Controller
{
    public function results(Request $request){



        $vars['title'] =  'Search Results';


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
}
