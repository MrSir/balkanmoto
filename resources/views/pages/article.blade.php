@extends('theme.master')

@section('page-header')
    <link href="/css/pages/article-style.css" rel="stylesheet">
    <link href="/css/pages/article-large-style.css" rel="stylesheet">
@endsection

@section('content')
    <div class="post-grid">
        <img src="/img/articles/Garage Build - Episode 1 Thumbnail.jpg"/>
        <div class="title">
            <a href="#">Garage Build Episode 1</a>
            @if(Auth::check())
                <a href="/articles/1/edit">
                    <span class="fas fa-edit"></span>
                </a>
            @endif
        </div>
        <div class="date">Date: 2018-01-24</div>
        <div class="body">
            <p>
                Spicy jalapeno bacon ipsum dolor amet ribeye jerky cow spare ribs rump andouille corned beef picanha
                ball tip doner. Sirloin frankfurter bacon, bresaola fatback tail shoulder short loin picanha tongue ham
                short ribs. Tenderloin cupim capicola, t-bone turkey drumstick doner short loin ham prosciutto pig
                meatball. Flank shank venison fatback pancetta ribeye cow kevin tenderloin. Turkey sirloin landjaeger,
                rump meatloaf burgdoggen swine hamburger pork chop. Frankfurter filet mignon biltong salami, beef
                shoulder bacon leberkas ham hock.
            </p>
            <p>
                Pork belly short ribs swine andouille biltong prosciutto boudin ball tip kielbasa turkey burgdoggen
                shankle. Bacon flank cow salami, shank biltong rump leberkas kielbasa chuck beef ribs shankle cupim
                picanha turducken. Short ribs buffalo shank picanha drumstick bresaola. Tail t-bone kevin turkey buffalo
                rump. Landjaeger ribeye beef ball tip, short ribs jowl boudin drumstick turducken salami doner swine
                tri-tip pork belly kevin. Shank short loin beef frankfurter.
            </p>
            <p>
                Drumstick sausage burgdoggen, prosciutto andouille venison flank chicken corned beef shankle. Ribeye
                tri-tip meatball biltong porchetta, spare ribs pig flank fatback brisket hamburger turducken pork belly
                pork chop. T-bone ball tip hamburger shank leberkas pork loin, venison brisket. Rump turkey ball tip,
                chuck pastrami pork loin shank tenderloin meatloaf jerky. Bacon chuck pork loin, shankle buffalo spare
                ribs shoulder ribeye.
            </p>
            <p>
                Venison swine prosciutto, jowl bresaola bacon pork flank pastrami drumstick. Doner filet mignon pig
                shank bresaola, prosciutto short ribs salami pastrami pancetta pork belly boudin flank pork chop short
                loin. Swine tail pork chop chuck porchetta ribeye. Beef turducken t-bone, strip steak ground round pork
                belly burgdoggen prosciutto chicken kevin biltong. Porchetta buffalo rump meatball ground round fatback.
                Pork loin ground round pork frankfurter pastrami shank ball tip pork chop boudin alcatra landjaeger beef
                ribs drumstick.
            </p>
            <p>
                Pork chop cow turkey hamburger. Short loin rump frankfurter jerky picanha ground round. Strip steak pork
                chop sirloin sausage, bresaola jerky tongue cupim porchetta prosciutto. Tri-tip corned beef pork loin
                jowl pig andouille. Shank kevin porchetta bresaola chuck andouille brisket pork chop turducken ground
                round flank. Pork belly jerky pig, shank landjaeger swine burgdoggen. Boudin pork chop kielbasa, alcatra
                andouille shankle hamburger frankfurter bacon.
            </p>
            <p>
                Kielbasa tenderloin andouille bacon ham hock turkey filet mignon sirloin drumstick porchetta tail
                tri-tip boudin ball tip. Flank porchetta shoulder, kielbasa beef pork filet mignon pork chop chuck.
                Pancetta capicola brisket, cupim biltong flank salami swine. Meatball biltong boudin ribeye, filet
                mignon leberkas doner pork chop swine sausage buffalo pancetta.
            </p>
            <p>
                Rump chuck andouille beef, leberkas shank pork belly short loin frankfurter bresaola burgdoggen short
                ribs drumstick spare ribs. Pork belly picanha fatback jerky t-bone, shank bacon venison ground round
                meatloaf ribeye. Pancetta hamburger ham hock sausage landjaeger. Short ribs pork belly andouille, rump
                pancetta prosciutto biltong cow.
            </p>
            <p>
                Turkey jowl bacon biltong ground round drumstick hamburger tail corned beef kevin. Meatball salami
                ribeye, cow turducken landjaeger brisket ham pork chop bacon alcatra jowl. Capicola tri-tip spare ribs
                tongue alcatra drumstick strip steak, ribeye ball tip pork cow. Cow short ribs shank leberkas beef, ball
                tip venison buffalo pork pork loin meatball doner. Doner salami burgdoggen filet mignon sirloin
                landjaeger. Meatball frankfurter landjaeger sirloin short loin biltong. Short loin cupim beef ribs
                turducken cow pastrami shankle burgdoggen prosciutto leberkas corned beef, ham hock chicken ground
                round.
            </p>
        </div>
        <div class="tags">
            Tags:
            <div class="tag"><a href="#">CB750</a></div>
            ,
            <div class="tag"><a href="#">Builds</a></div>
            ,
            <div class="tag"><a href="#">Honda</a></div>
            ,
            <div class="tag"><a href="#">Cafe Racer</a></div>
        </div>
    </div>
@endsection