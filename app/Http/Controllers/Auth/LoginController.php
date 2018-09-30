<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\User;
use Google_Service_People;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;
use Laravel\Socialite\Facades\Socialite;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/home';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    /**
     * @return View
     */
    public function showLoginForm(): View
    {
        return view(
            'pages.login',
            [
                'headerText' => 'Login'
            ]
        );
    }

    /**
     * Redirect the user to the GitHub authentication page.
     *
     * @return Response
     */
    public function redirectToProvider()
    {
        return Socialite::driver('google')
            ->scopes(
                [
                    'openid',
                    'profile',
                    'email',
                    Google_Service_People::CONTACTS_READONLY
                ]
            )
            ->redirect();
    }

    /**
     * Obtain the user information from GitHub.
     *
     * @return Response
     */
    public function handleProviderCallback()
    {
        $googleUser = Socialite::driver('google')->user();

        /** @var User $user */
        $user = User::query()
            ->updateOrCreate(
                [
                    'email' => $googleUser->email
                ],
                [
                    'name' => $googleUser->name,
                    'google_id' => $googleUser->id
                ]
            );

        $this->guard()->login($user, true);

        return redirect('/');
    }
}
