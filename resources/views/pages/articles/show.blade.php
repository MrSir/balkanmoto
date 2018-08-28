@extends('theme.master')

@section('page-header')
    <link href="/css/pages/article-style.css" rel="stylesheet">
    <link href="/css/pages/article-large-style.css" rel="stylesheet">
@endsection

@section('content')
    <div class="post-grid">
        <div class="title">
            <a href="#">{{ $article->title }}</a>
            @if(Auth::check())
                <a href="/nova/resources/articles/{{ $article->id }}/edit">
                    <span class="fas fa-edit"></span>
                </a>
            @endif
        </div>
        <div class="date">Date: {{ $article->published_at->format('Y-m-d') }}</div>
        <div class="tags">
            Tags:
            @foreach($article->tags as $tag)
                <div class="tag"><a href="{{ $tag->link }}">{{ strtoupper($tag->name) }}</a></div>&nbsp;
            @endforeach
        </div>
        <div class="body">{!! $article->body !!}</div>
    </div>
@endsection