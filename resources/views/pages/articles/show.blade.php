@extends('theme.master')

@section('page-header')
    <link href="/css/pages/article-style.css" rel="stylesheet">
    <link href="/css/pages/article-large-style.css" rel="stylesheet">
@endsection

@section('content')
    <div class="post-grid">
        <div class="title">
            <a href="/articles/{{ $article->id }}">{{ $article->title }}</a>
        </div>
        <div class="date">
            Date: <span class="theDate">{{ $article->published_at->format('Y-m-d') }}</span>
            @if(Auth::check())
                <a href="/nova/resources/articles/{{ $article->id }}/edit">
                    <span class="fas fa-edit"></span>
                </a>
            @endif
        </div>
        <div class="tags">
            Tags:
            @foreach($article->tags as $tag)
                <div class="tag"><a href="{{ $tag->link }}">{{ strtoupper($tag->name) }}</a></div>&nbsp;
            @endforeach
        </div>
        <div class="body">{!! $article->body !!}</div>
    </div>
@endsection