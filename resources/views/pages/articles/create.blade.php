@extends('theme.master')

@section('page-header')
    {{--<link href="/css/pages/article-style.css" rel="stylesheet">--}}
    {{--<link href="/css/pages/article-large-style.css" rel="stylesheet">--}}

    <script src="https://cloud.tinymce.com/stable/tinymce.min.js?apiKey=zys0yf760xr9gjmcreu1cvsoko9mje67of20stvs3tk7bhau"></script>
@endsection

@section('content')
    <div class="post-grid">
        <form id="edit" name="edit" method="POST" action="/articles">
            {{ csrf_field() }}
            <input type="file" id="image" name="image"/>
            <input type="text" id="title" name="title"/>
            <input type="text-area" id="body" name="body"/>
            <input type="text-area" id="tags" name="tags"/>
            <input type="submit" id="submit" name="submit" value="CREATE"/>
        </form>
    </div>
    <script type="text/javascript">
      tinymce.init(
        {
          selector: '#body',
          menubar: false,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor textcolor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table contextmenu paste code help wordcount'
          ],
          toolbar: 'insert | undo redo |  formatselect | bold italic backcolor  | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
          content_css: [
            '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
            '//www.tinymce.com/css/codepen.min.css'
          ],
          mobile: {
            theme: 'mobile',
          }
        }
      )
    </script>
@endsection