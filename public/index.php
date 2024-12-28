<!doctype html>
<html lang="en-ca">
<head>
    <?php include("./theme/header-meta.php"); ?>

    <link href="/css/pages/home-style.css" rel="stylesheet">
    <link href="/css/pages/home-large-style.css" rel="stylesheet">
</head>
<body>
<div class="content container-grid">
    <?php include("./theme/menu.php"); ?>
    <?php include("./theme/header.php"); ?>
    <div class="content-grid">
        <div class="welcome">
            <h2>Welcome</h2>
            <p>Lorum Ipsum</p>
        </div>
        <div class="builds-grid">
            <div class="build">
                <img src="/builds/img/2002-yamaha-vstar-1100-bobber/current_2.jpg" alt="Article Cover">
                <div class="title"><a href="/builds/2002-yamaha-vstar-1100-bobber.php">2002 Yamaha V-Star 1100 Bobber - The Jocker Bobber</a></div>
            </div>
            <div class="build">
                <img src="/builds/img/2013-suzuki-c90t-boss-bobber/modified.jpg" alt="Article Cover">
                <div class="title"><a href="/builds/2013-suzuki-c90t-boss-bobber.php">2013 Suzuki C90T BOSS - The BOSS Bobber</a></div>
            </div>
            <div class="build">
                <img src="/builds/img/1982-83-honda-sabre-v45-cafe-racer/the_finished_build.jpg" alt="Article Cover">
                <div class="title"><a href="/builds/1982-83-honda-sabre-v45-cafe-racer.php">1982-83 Honda Sabre V45 Cafe Racer - The Cafe Sabre</a></div>
            </div>
        </div>
        <div class="other-grid">
            <div class="other">
                <img src="/img/#.jpg" alt="Article Cover">
                <div class="title"><a href="/wall-art.php">Wall Art</a></div>
            </div>
            <div class="other">
                <img src="/img/#.jpg" alt="Article Cover">
                <div class="title"><a href="/tools.php">Tools</a></div>
            </div>
        </div>
    </div>
    <?php include("./theme/footer.php"); ?>
</div>
</body>
</html>