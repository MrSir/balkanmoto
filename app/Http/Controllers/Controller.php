<?php

namespace App\Http\Controllers;

use App\Article;
use Facebook\Exceptions\FacebookResponseException;
use Facebook\Exceptions\FacebookSDKException;
use Facebook\Facebook;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Cache;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    /*
     * Home Page Route
     */
    public function home()
    {
        $data = [];

        if (Cache::has('instagram-data')) {
            $data = Cache::get('instagram-data');
        } else {
            try {
                $fb = new Facebook(
                    [
                        'app_id' => env('FB_APP_ID'),
                        'app_secret' => env('FB_APP_SECRET'),
                        'default_graph_version' => 'v3.2',
                        'default_access_token' => env('FB_APP_ACCESS_TOKEN')
                    ]
                );

                // Returns a `FacebookFacebookResponse` object
                $response = $fb->get(
                    '/17841408382862564/media?fields=media_url,permalink&limit=12'
                );

                $body = json_decode($response->getBody(), true);
                $data = $body['data'];
            } catch (FacebookSDKException $e) {
                $data = [];
            }

            Cache::put('instagram-data', $data, 480);
        }

        $articles = Article::query()
            ->where('is_published','=', true)
            ->where('is_featured','=', true)
            ->orderBy('created_at', 'DESC')
            ->take(8)
            ->get();

        return view(
            'pages.home',
            [
                'headerText' => 'FEATURED ARTICLES',
                'articles' => $articles,
                'instagrams' => $data,
            ]
        );
    }

    public function about()
    {
        return view(
            'pages.about',
            [
                'headerText' => 'ABOUT',
            ]
        );
    }

    public function contact()
    {
        return view(
            'pages.contact',
            [
                'headerText' => 'CONTACT US',
            ]
        );
    }

    public function privacy()
    {
        return view(
            'pages.privacy',
            [
                'headerText' => 'Privacy',
            ]
        );
    }
}
