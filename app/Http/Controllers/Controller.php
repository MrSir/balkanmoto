<?php

namespace App\Http\Controllers;

use Facebook\Exceptions\FacebookResponseException;
use Facebook\Exceptions\FacebookSDKException;
use Facebook\Facebook;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function home()
    {
        try {
            $fb = new Facebook(
                [
                    'app_id' => env('FB_APP_ID'),
                    'app_secret' => env('FB_APP_SECRET'),
                    'default_graph_version' => 'v3.1',
                    'default_access_token' => env('FB_APP_ACCESS_TOKEN')
                ]
            );

            // Returns a `FacebookFacebookResponse` object
            $response = $fb->get(
                '/17841408382862564/media?fields=media_url,permalink&limit=12'
            );
        } catch(FacebookResponseException $e) {
            echo 'Graph returned an error: ' . $e->getMessage();
            exit;
        } catch(FacebookSDKException $e) {
            echo 'Facebook SDK returned an error: ' . $e->getMessage();
            exit;
        }

        $body = json_decode($response->getBody(),true);
        $data = $body['data'];

        return view('pages.home', ['instagrams' => $data]);
    }
}
