@extends('theme.master')

@section('page-header')
    <link href="/css/pages/articles-style.css" rel="stylesheet">
    <link href="/css/pages/articles-large-style.css" rel="stylesheet">
@endsection

@section('content')
    <div class="posts">
        @if(count($articles) === 0)
            <div>
                No articles published yet.
            </div>
        @endif
        @foreach($articles as $article)
            <div class="post-grid">
                <img src="{{ $article->image->path }}"/>
                <div class="title"><a href="#">{{ $article->title }}</a></div>
                <div class="date">Date: {{ $article->published_at }}</div>
                <div class="summary">
                    {{ $article->summary }}... <a href="/articles/{{ $article->id }}">Read More</a>
                </div>
            </div>
        @endforeach
    </div>
    {{ $articles->appends(['keyword' => $keyword])->links() }}
    <div class="sidebar">
        <form id="search" name="search" action="/articles" method="GET">
            <input type="text" id="keyword" name="keyword" placeholder="Search"/>
            <input type="submit" hidden="hidden"/>
        </form>
        <div class="tags">
            @foreach($tags as $tag)
                <div class="tag {{ $tag->class }}">
                    <a href="{{ $tag->link }}">{{ $tag->upperCaseName }}</a>
                </div>
            @endforeach
        </div>
        @if(Auth::check())
            <a href="/articles/create" class="create">
                <span class="fa fa-plus-circle"></span>
                Create Article
            </a>
        @endif
    </div>
@endsection