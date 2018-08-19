@extends('theme.master')

@section('page-header')
    <link href="/css/pages/home-style.css" rel="stylesheet">
    <link href="/css/pages/home-large-style.css" rel="stylesheet">
@endsection

@section('content')
    <div class="grid-item main-grid">
        <div class="post-grid">
            <img src="/img/articles/Garage Build - Episode 1 Thumbnail.jpg"/>
            <div class="title"><a href="#">Garage Build Episode 1</a></div>
            <div class="date">Date: 2018-01-24</div>
            <div class="summary">
                Bacon ipsum dolor amet landjaeger strip steak drumstick pork chop chicken pork loin shoulder jerky
                pork belly capicola flank bacon rump jowl. Brisket pork belly short ribs, beef tenderloin beef ribs
                doner rump. Jerky pork strip steak short loin... <a href="#">Read More</a>
            </div>
        </div>
        <div class="post-grid">
            <img src="/img/articles/Garage Build - Episode 1 Thumbnail.jpg"/>
            <div class="title"><a href="#">Garage Build Episode 1</a></div>
            <div class="date">Date: 2018-01-24</div>
            <div class="summary">
                Bacon ipsum dolor amet landjaeger strip steak drumstick pork chop chicken pork loin shoulder jerky
                pork belly capicola flank bacon rump jowl. Brisket pork belly short ribs, beef tenderloin beef ribs
                doner rump. Jerky pork strip steak short loin... <a href="#">Read More</a>
            </div>
        </div>
        <div class="post-grid">
            <img src="/img/articles/Garage Build - Episode 1 Thumbnail.jpg"/>
            <div class="title"><a href="#">Garage Build Episode 1</a></div>
            <div class="date">Date: 2018-01-24</div>
            <div class="summary">
                Bacon ipsum dolor amet landjaeger strip steak drumstick pork chop chicken pork loin shoulder jerky
                pork belly capicola flank bacon rump jowl. Brisket pork belly short ribs, beef tenderloin beef ribs
                doner rump. Jerky pork strip steak short loin... <a href="#">Read More</a>
            </div>
        </div>
        <div class="post-grid">
            <img src="/img/articles/Garage Build - Episode 1 Thumbnail.jpg"/>
            <div class="title"><a href="#">Garage Build Episode 1</a></div>
            <div class="date">Date: 2018-01-24</div>
            <div class="summary">
                Bacon ipsum dolor amet landjaeger strip steak drumstick pork chop chicken pork loin shoulder jerky
                pork belly capicola flank bacon rump jowl. Brisket pork belly short ribs, beef tenderloin beef ribs
                doner rump. Jerky pork strip steak short loin... <a href="#">Read More</a>
            </div>
        </div>
    </div>
    <div class="divider2 divider">
        <span class="fab fa-instagram"></span>BalkanMoto2018
    </div>
    <div class="grid-item instagram-grid">
        @foreach($instagrams as $instagram)
        <div class="post-grid grid-item"
             style="background-image: url('{{ $instagram['media_url'] }}');"
             onclick="window.open('{{$instagram['permalink']}}');">
        </div>
        @endforeach
    </div>
@endsection