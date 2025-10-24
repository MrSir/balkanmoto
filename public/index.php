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
    <div class="divider">HOME</div>
    <div class="content-grid">
        <div class="welcome">
            <h2>Welcome</h2>
            <p>This is a place to learn, explore, and share the journey of building custom motorcycles. I’ve always been fascinated by the process of taking raw materials and turning them into something personal and unique. Whether it’s building a custom bike, crafting leather gear, or creating wall art that captures the spirit of riding, this site is all about sharing what I’ve learned along the way.</p>
            <p>Here, you’ll find tips, tutorials, and hopefully some inspiration for your next build. It’s not about being a professional—it’s about the joy of learning, experimenting, and pushing the limits of what you can create.</p>
        </div>
        <div class="builds-grid">
            <div class="header">LATEST BUILDS</div>
            <div class="posts">
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
        </div>
        <div id="adventures-grid">
            <div class="header">LATEST ADVENTURE ROUTES</div>
            <div id="adventures" class="posts"></div>
        </div>
        <script type="text/javascript">
            document.addEventListener('DOMContentLoaded', function() {
                const adventures = [
                    {
                        "id": "acton-trails",
                        "link": "/adventures/acton-trails.php",
                        "logo": "/adventures/img/acton-trails-logo.jpg",
                        "summary": "The perfect area for beginner off-road training. Lot's of easy terrain, with progressive difficulty. From hard packed dirt, to deep sand and steep rocky hills."
                    },
                    {
                        "id": "campbellville-quarry",
                        "link": "/adventures/campbellville-quarry.php",
                        "logo": "/adventures/img/campbellville-quarry-logo.jpg",
                        "summary": "A day trip in the Campbellville, Ontario area, with a small detour into the old quarry for some off-road trails."
                    },
                    {
                        "id": "the-ridge",
                        "link": "/adventures/the-ridge.php",
                        "logo": "/adventures/img/the-ridge-logo.jpg",
                        "summary": "A nice off-road trail that can be ridden by any level rider, with lots to offer in terms of exploration and varied terrain."
                    },
                ]

                const mainGrid = document.getElementById('adventures');

                adventures.forEach((adventure) => {
                    let postGridHTML = '<div id="' + adventure.id + '" class="post-grid"></div>'
                    mainGrid.innerHTML += postGridHTML

                    const postGrid = document.getElementById(adventure.id)
                    postGrid.innerHTML = '<img src="' + adventure.logo + '"/ alt="Adventure LOGO">'
                    postGrid.innerHTML += '<div class="summary">' + adventure.summary + '</div>'
                })

                adventures.forEach((adventure) => {
                    const postGrid = document.getElementById(adventure.id)
                     postGrid.addEventListener("click", () => {
                        window.location = adventure.link
                     })
                })
            });
        </script>
        <div class="other-grid">
            <div class="header">OTHER INTERESTING BITS</div>
            <div class="posts">
                <div class="other">
                    <img src="/img/wall-art.jpg" alt="Article Cover">
                    <div class="title"><a href="/wall-art.php">Wall Art</a></div>
                </div>
                <div class="other">
                    <img src="/img/tools.jpg" alt="Article Cover">
                    <div class="title"><a href="/tools.php">Tools</a></div>
                </div>
            </div>
        </div>
    </div>
    <?php include("./theme/footer.php"); ?>
</div>
</body>
</html>