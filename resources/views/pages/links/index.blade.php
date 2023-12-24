@extends('theme.master')

@section('page-header')
    <link href="/css/pages/links-style.css" rel="stylesheet">
    <link href="/css/pages/links-large-style.css" rel="stylesheet">
@endsection

@section('content')
    <div class="content-center">
        @if(count($links) === 0)
            <div>
                No links found.
            </div>
        @endif
        @foreach($links as $link)
                <div class="link">
                    <div class="box">
                        <a href="{{ $link->url }}" target="_blank">{{ $link->title }}</a>
                    </div>
                </div>
        @endforeach
    </div>
@endsection