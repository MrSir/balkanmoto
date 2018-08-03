<!doctype html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Balkan Moto</title>

    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Great+Vibes" rel="stylesheet">

    <link href="css/style.css" rel="stylesheet">
</head>
<body>
<div class="content grid-container">
    @include('theme.header')
    @include('theme.content')
    @include('theme.footer')
</div>
</body>
</html>