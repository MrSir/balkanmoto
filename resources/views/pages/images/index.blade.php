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
        @for($i=0; $i<5; $i++)
            <div class="image" onclick="previewImage(this);">
                <img src="/img/articles/Garage Build - Episode 1 Thumbnail.jpg" class="thumbnail"/>
                <div class="name">Garage Build Episode 1.jpg</div>
                <div class="url">https://s3.amazonaws.com/balkanmoto/abs3jh23k23jdnspow.jpg</div>
                <div class="size">1.3MB</div>
                <div class="actions">
                    <form id="delete1" name="delete1" method="DELETE" action="/images/1">
                        <button type="submit">
                            <span class="fa fa-times-circle"></span>
                        </button>
                    </form>
                </div>
            </div>
        @endfor
        @for($i=0; $i<5; $i++)
            <div class="image" onclick="previewImage(this);">
                <img src="/img/articles/Garage Build - Episode 1 Thumbnail.jpg" class="thumbnail"/>
                <div class="name">Garage Build Episode 2.jpg</div>
                <div class="url">https://s3.amazonaws.com/balkanmoto/abs3jh23k23jdnspow2.jpg</div>
                <div class="size">2.3MB</div>
                <div class="actions">
                    <form id="delete1" name="delete1" method="DELETE" action="/images/1">
                        <button type="submit">
                            <span class="fa fa-times-circle"></span>
                        </button>
                    </form>
                </div>
            </div>
        @endfor
    </div>
    <div class="pagination">
        <a href="#">First</a>
        <a href="#">&lt;</a>
        <a href="#">1</a>
        <a href="#">2</a>
        <a href="#" class="active">3</a>
        <a href="#">4</a>
        <a href="#">5</a>
        <a href="#">&gt;</a>
        <a href="#">Last</a>
    </div>
    <form id="create" name="create" method="POST" action="/images">
        {{ csrf_field() }}
        <input type="file" id="image" name="image" data-multiple-caption="{count} files selected" multiple
               onchange="updateLabel(this);"/>
        <label for="image"><span class="fas fa-upload"></span> Choose a file...</label>
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
        let fileName = '',
          labelVal = input.nextElementSibling.innerHTML

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

        let imageImage = image.querySelector('img'),
          imageName = image.querySelector('.name'),
          imageUrl = image.querySelector('.url'),
          imageSize = image.querySelector('.size')

        previewImage.setAttribute('src', imageImage.getAttribute('src'))
        previewName.innerHTML = '<span class="label">Name:</span> ' + imageName.innerHTML
        previewUrl.querySelector('a').href = imageUrl.innerHTML
        previewSize.innerHTML = '<span class="label">Size:</span> ' + imageSize.innerHTML
      }
    </script>
@endsection