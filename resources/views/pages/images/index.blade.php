@extends('theme.master')

@section('page-header')
    <link href="/css/pages/images-style.css" rel="stylesheet">
    <link href="/css/pages/images-large-style.css" rel="stylesheet">
@endsection

@section('content')
    <form id="search" name="search" action="/images" method="GET">
        <input type="text" id="keyword" name="keyword" placeholder="Search"/>
        <input type="submit" hidden="hidden"/>
    </form>
    <div class="images">
        @if(count($images) === 0)
            <div>
                No images uploaded yet.
            </div>
        @endif
        @foreach($images as $image)
            <div class="image" onclick="previewImage(this);">
                <img src="{{ $image->thumbnail }}" class="thumbnail"/>
                <div class="name">{{ $image->title }}</div>
                <div class="url">{{ $image->path }}</div>
                <div class="size">{{ $image->size }}</div>
                <div class="actions">
                    <form id="delete" name="delete" method="POST" action="/images/{{ $image->id }}">
                        {{ csrf_field() }}
                        <input type="hidden" id="_method" name="_method" value="DELETE" hidden="hidden"/>
                        <button type="submit">
                            <span class="fa fa-times-circle"></span>
                        </button>
                    </form>
                </div>
            </div>
        @endforeach
    </div>
    {{ $images->appends(['keyword' => $keyword])->links() }}
    <form id="create" name="create" method="POST" action="/images" enctype="multipart/form-data">
        {{ csrf_field() }}
        <input type="file" id="images" name="images[]" data-multiple-caption="{count} files selected" multiple
               onchange="updateLabel(this);"/>
        <label for="images"><span class="fas fa-upload"></span> Choose a file...</label>
        <button type="submit" id="submit" name="submit">
            <span class="fa fa-check-circle"></span>
        </button>
    </form>
    <div id="preview" class="preview">
        <img src="/img/articles/Garage Build - Episode 1 Thumbnail.jpg"/>
        <div class="name"><span class="label">Name:</span> Garage Build Episode 1.jpg</div>
        <div class="url">
            <span class="label">Direct URL:</span>
            <a href="https://s3.amazonaws.com/balkanmoto/abs3jh23k23jdnspow.jpg" target="_blank">
                Click Here
            </a>
        </div>
        <div class="size"><span class="label">Size:</span> 1.3MB</div>
    </div>
    <script type="text/javascript">
      /**
       * This function updates the label on the upload button
       * @param input
       */
      function updateLabel(input) {
        let fileName = ''

        if (input.files) {
          fileName = (input.getAttribute('data-multiple-caption') || '').replace('{count}', input.files.length)
        }

        if (fileName) {
          input.nextElementSibling.innerHTML = fileName
          input.nextElementSibling.nextElementSibling.style.display = 'inline-block'
        }
      }

      /**
       * This function updates the preview on the right with the current selected one
       * @param image
       */
      function previewImage(image) {
        let preview = document.getElementById('preview'),
          previewImage = preview.querySelector('img'),
          previewName = preview.querySelector('.name'),
          previewUrl = preview.querySelector('.url'),
          previewSize = preview.querySelector('.size')

        let imageName = image.querySelector('.name'),
          imageUrl = image.querySelector('.url'),
          imageSize = image.querySelector('.size')

        previewImage.setAttribute('src', imageUrl.innerHTML)
        previewName.innerHTML = '<span class="label">Name:</span> ' + imageName.innerHTML
        previewUrl.querySelector('a').href = imageUrl.innerHTML
        previewSize.innerHTML = '<span class="label">Size:</span> ' + imageSize.innerHTML
      }
    </script>
@endsection