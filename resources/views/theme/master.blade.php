<!doctype html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Balkan Moto</title>

    <!-- Fonts -->
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.2.0/css/all.css"
          integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ" crossorigin="anonymous">
    <link href="https://fonts.googleapis.com/css?family=Teko" rel="stylesheet">

    <link href="css/style.css" rel="stylesheet">
    <link href="css/large-style.css" rel="stylesheet">
    @yield('page-header')
</head>
<body>
<div class="content container-grid">
    @include('theme.menu')
    @include('theme.header')
    @include('theme.content')
    @include('theme.footer')
</div>
</body>
</html>