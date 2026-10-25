<!doctype html>
<html lang="en-ca">
<head>
    <?php include("../theme/header-meta.php"); ?>

    <link href="/css/pages/tool-style.css" rel="stylesheet">
    <link href="/css/pages/tool-large-style.css" rel="stylesheet">
    <style>
        body.lab-fullscreen { overflow: hidden; }

        /* The whole app lives in this container: small fixed size, or the full browser window. */
        .lab {
          position: relative; width: 1200px; height: 840px; overflow: hidden;
          border-radius: 6px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
          --column-width: 230px;
        }
        .lab.fullscreen {
          position: fixed; inset: 0; width: auto; height: auto; z-index: 1000; border-radius: 0;
          --column-width: 260px;
        }
        .lab .viewport { position: absolute; inset: 0; }
        .lab .viewport canvas { display: block; }

        /* One column per bike (A left, B right): info panel with its lil-gui panel below. */
        .column {
          position: absolute; top: 12px; width: var(--column-width); max-height: calc(100% - 60px);
          display: flex; flex-direction: column; gap: 6px;
        }
        .column.left { left: 12px; }
        .column.right { right: 12px; }
        .column > .lil-gui.root { width: auto; min-height: 0; }  /* fill the column; shrink and scroll */

        .shared { position: absolute; top: 12px; left: 50%; transform: translateX(-50%); }

        /* Readouts: dark theme matching lil-gui. */
        .readouts {
          flex: none; padding: 6px 8px;
          background: #1f1f1f; border-radius: 4px; border-left: 3px solid;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
          font-size: 11px; line-height: 1.3; color: #ebebeb;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
        }
        .readouts .table { display: grid; grid-template-columns: auto auto; column-gap: 10px; }
        .readouts .head { font-size: 12px; font-weight: 700; }
        .readouts h1 {
          grid-column: 1 / -1; margin: 6px -8px 2px; padding: 2px 8px;
          font-size: 11px; font-weight: 600; background: #111;
        }
        .readouts .label { color: #b0b0b0; }
        .readouts .value { text-align: right; font-variant-numeric: tabular-nums; font-weight: 600; }
        .readouts .value.differs { color: #7dff4d; }
        .readouts .bottomed {
          grid-column: 1 / -1; margin: 2px 0; padding: 0 6px; text-align: center; border-radius: 4px;
          font-size: 10px; font-weight: 700; letter-spacing: 0.05em;
          color: #424242; background: #2c2c2c;
        }
        .readouts .bottomed.active { color: #1f1f1f; background: #e8a317; }

        /* Graphs: the area spans the gap between the bike columns; the graph panel is centred in it.
           2×2 grid by default, a single row when each graph can be at least 200 px wide. */
        .graph-area {
          position: absolute; bottom: 12px;
          left: calc(var(--column-width) + 24px); right: calc(var(--column-width) + 24px);
          display: flex; justify-content: center; pointer-events: none;
          container-type: inline-size;
        }
        .graphs {
          width: 100%; max-width: 656px; box-sizing: border-box; pointer-events: auto; padding: 4px 6px 6px; background: #111; border-radius: 6px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
          font: 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
          color: #b0b0b0;
        }
        .graph-header { display: flex; justify-content: space-between; gap: 12px; padding: 0 2px 4px; }
        .graph-legend { display: flex; gap: 12px; }
        .graph-grid {
          display: grid; gap: 4px;
          grid-template-columns: repeat(2, minmax(0, 1fr)); grid-auto-rows: 140px;
        }
        .graph-grid canvas { display: block; width: 100%; height: 100%; border-radius: 4px; }
        @container (min-width: 824px) {
          .graphs { max-width: 1304px; }
          .graph-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); grid-auto-rows: 240px; }
        }

        .fullscreen-toggle {
          position: absolute; right: 12px; bottom: 12px; padding: 6px 10px;
          font: 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
          color: #ebebeb; background: #424242; border: none; border-radius: 3px; cursor: pointer;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
        }
        .fullscreen-toggle:hover { background: #595959; }
    </style>
    <script type="importmap">
        {
            "imports": {
                "three": "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js",
                "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/"
            }
        }
    </script>

    <meta name="keywords" content="fork suspension,motorcycle suspension calculator,suspension tuning">
</head>
<body>
<div class="content container-grid">
    <?php include("../theme/menu.php"); ?>
    <?php include("../theme/header.php"); ?>
    <div class="divider">SUSPENSION TUNING123</div>
    <div class="content-grid">
        <div id="info">
            <h2>Mouse Controls</h2>
            You can use your mouse to fully navigate the 3D space
            <ul>
                <li>Left Click and Drag: this will rotate the camera around the viewing point</li>
                <li>Right Click and Drag: this will drag the camera around along with its viewing point</li>
                <li>Scroll: this will zoom the camera in and out</li>
            </ul>

            <h2>DISCLAIMER</h2>
            This is an educational tool based on simple high school geometry, that simulates reality. As such it is not a 100% true representation of reality and should not be used as the sole truth of what would happen. Please do your own math and measurements before modifying the suspension of your motorcycle. Improper configurations will result in serious injury or death.
        </div>
        <br/>
        <div id="small-screen-warning">Your screen is too small to view the canvas.</div>
        <div id="lab" class="lab">
            <div class="viewport"></div>

            <!-- Per-bike columns: readouts (js/readouts.js) with the bike's GUI appended below (js/gui.js) -->
            <div class="column left"><div class="readouts"></div></div>
            <div class="column right"><div class="readouts"></div></div>
            <div class="shared"></div>

            <!-- Shared legend and caption, then one canvas per graph (js/readouts.js) -->
            <div class="graph-area">
                <div class="graphs">
                    <div class="graph-header"><span class="graph-caption"></span><span class="graph-legend"></span></div>
                    <div class="graph-grid"></div>
                </div>
            </div>
            <button class="fullscreen-toggle" type="button">⛶ Full screen</button>
        </div>
    </div>

    <!-- ES modules can't load from file:// — serve this folder, e.g. `python3 -m http.server` -->
    <script type="module" src="/js/tools/suspension-tuning/main.js"></script>
    <?php include("../theme/footer.php"); ?>
</div>
</body>
</html>