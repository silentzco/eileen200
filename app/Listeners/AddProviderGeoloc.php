<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Statamic\Events\EntrySaving;
use Statamic\Facades\Entry;

class AddProviderGeoloc
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  EntrySaving  $event
     * @return void
     */
    public function handle(EntrySaving $event)
    {
        $entry = $event->entry;

        if($entry->collectionHandle() != "providers"){
            return;
        }

        if(empty($entry->get('_geoloc')) && !empty($entry->get('zip'))){


            $zipcode = Entry::query()
                ->where('collection', 'zip_codes')
                ->where('code', $entry->get('zip'))
                ->first();


            if($zipcode){
                $entry->set('_geoloc', [['lng' => (float)$zipcode->get('longitude') , 'lat' => (float)$zipcode->get('latitude')]]);
            }
        }


    }
}
