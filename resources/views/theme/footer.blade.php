<div class="footer-grid">
    {{--<div class="tweeter">--}}
        {{--<div class="footer-title">Tweets</div>--}}
        {{--<div class="tweets">--}}
            {{--<div class="tweet">--}}
                {{--<img src="" width="50px" height="50px">--}}
                {{--<div class="name">BalkanMoto</div>--}}
                {{--<div class="handle"><a href="#">@BalkanMoto2018</a></div>--}}
                {{--<div class="message">Check out the latest Honda Phantom Build <a href="#">bit.log/1235had</a></div>--}}
            {{--</div>--}}
        {{--</div>--}}
    {{--</div>--}}
    <div class="links">
        <div class="footer-title">Links</div>
        <ul>
            <li><a href="/about">ABOUT</a></li>
            <li><a href="/articles">ARTICLES</a></li>
            <li><a href="/contact">CONTACT</a></li>
            @if(Auth::check())
                <li><a href="/nova">NOVA</a></li>
            @else
                <li><a href="/login/google">LOG IN</a></li>
            @endif
        </ul>
    </div>
    <div class="social">
        <div class="footer-title">Social</div>
        <div class="icons">
            <div class="youtube">
                <a href="https://www.youtube.com/channel/UCHbSArk-BwFhFQmtV_ws2Ng" target="_blank"><span class="fab fa-youtube"></span></a>
            </div>
            <div class="instagram">
                <a href="https://www.instagram.com/balkanmoto2018/" target="_blank"><span class="fab fa-instagram"></span></a>
            </div>
            <div class="twitter">
                <a href="https://twitter.com/BalkanMoto2018" target="_blank"><span class="fab fa-twitter-square"></span></a>
            </div>
        </div>
    </div>
</div>