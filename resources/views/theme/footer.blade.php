<div class="footer-grid">
    <div class="links">
        <div class="footer-title">Links</div>
        <ul>
            <li><a href="/about">ABOUT</a></li>
            <li><a href="/articles">ARTICLES</a></li>
            <li><a href="/links">LINKS</a></li>
            @if(Auth::check())
                <li><a href="/nova">NOVA</a></li>
            @else
                <li><a href="/login/google">LOG IN</a></li>
            @endif
        </ul>
    </div>
    <div class="links">
        <div class="footer-title">Tools</div>
        <ul>
            <li><a href="/tools/suspension-geometry">SUSPENSION GEOMETRY</a></li>
			<li><a href="/tools/carburetor-tuning">CARBURETOR TUNING</a></li>
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