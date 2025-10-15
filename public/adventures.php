<!doctype html>
<html lang="en-ca">
<head>
    <?php include("./theme/header-meta.php"); ?>

    <link href="/css/pages/adventures-style.css" rel="stylesheet">
    <link href="/css/pages/adventures-large-style.css" rel="stylesheet">
</head>
<body>
<div class="content container-grid">
    <?php include("./theme/menu.php"); ?>
    <?php include("./theme/header.php"); ?>
    <div class="divider">ADVENTURE ROUTES</div>
    <div class="content-grid">
        <div id="main-grid" class="grid-item main-grid"></div>
    </div>
    <script type="text/javascript">
        document.addEventListener('DOMContentLoaded', function() {
            const adventures = [
                {
                    "id": "acton-trails",
                    "link": "/adventures/acton-trails.php",
                    "logo": "/adventures/img/acton-trails-logo.jpg",
                    "summary": "The perfect area for beginner off-road training. Lot's of easy terrain, with progressive difficulty. For hard packed dirt, to deep sand and steep rocky hills."
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

            const mainGrid = document.getElementById('main-grid');

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
    <?php include("./theme/footer.php"); ?>
</div>
</body>
</html>