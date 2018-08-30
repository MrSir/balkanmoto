@extends('theme.master')

@section('page-header')
    <link href="/css/pages/home-style.css" rel="stylesheet">
    <link href="/css/pages/home-large-style.css" rel="stylesheet">
@endsection

@section('content')
    <div class="grid-item main-grid">
        @foreach($articles as $article)
        <div class="post-grid">
            <img src="{{ $article->cover->link }}"/>
            <div class="title"><a href="/articles/{{ $article->id }}">{{ $article->title }}</a></div>
            <div class="date">Date: {{ $article->published_at->format('Y-m-d') }}</div>
            <div class="summary">
                {{ $article->summary }} <br/>
                <a href="/articles/{{ $article->id }}">Read More</a>
            </div>
        </div>
        @endforeach
    </div>
    <div class="divider2 divider">
        <span class="fab fa-instagram"></span>BalkanMoto2018
    </div>
    <div class="grid-item instagram-grid">
        @foreach($instagrams as $instagram)
        <div class="post-grid"
             style="background-image: url('{{ $instagram['media_url'] }}');"
             onclick="window.open('{{$instagram['permalink']}}');">
        </div>
        @endforeach
    </div>
@endsection