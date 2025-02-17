<!doctype html>
<html lang="en-ca">
<head>
    <?php include("../theme/header-meta.php"); ?>

    <link href="/css/pages/article-style.css" rel="stylesheet">
    <link href="/css/pages/article-large-style.css" rel="stylesheet">
    
    <meta name="keywords" content="asseto corsa,3D trees">
</head>
<body>
<div class="content container-grid">
    <?php include("../theme/menu.php"); ?>
    <?php include("../theme/header.php"); ?>
    <div class="divider">AC Foliage v1.1</div>
    <div class="content-grid">
        <div class="post-grid">
            <div class="body">
                <h1>Documentation</h1>
                <img src="/docs/img/ac-foliage/title.jpg">

                <p>
                This tool helps streamline the process for configuring and placing 3D Trees on custom tracks in Assetto Corsa. For a tutorial on how to use it in your track modding work flow refer to the series below:
                </p>

                <h2>Installation</h2>
                <p>To install the tool simply run the <span style="background-color: lightgray">install.bat</span>.</p>

                <h2>Usage</h2>
                <p>Once installed running the <span style="background-color: lightgray">run.bat</span> is all you need to start AC Foliage.<br>

                </p><h3>Point Cloud Files</h3>
                <img src="/docs/img/ac-foliage/point-cloud.jpg">
                <p>The Point Cloud section of the tool uses so called .pcd extension files. These can be generated from a mesh in <strong>blender</strong> by exporting it using the <a href="https://markhedleyjones.com/projects/blender-pcd-io" target="_blank">blender-pcd-io</a> plugin</p>
                <p>This section will show you some general details about the point cloud you have imported to make the decisions around how to use the tool a little more straight forward. If the point cloud is parsed correctly it will also show you the first 6 points on the right side. (showing all the points eats up a ton of performances so it has been removed)

                </p><h3>Tree Type Configuration</h3>
                <img src="/docs/img/ac-foliage/tree-type.jpg">
                <p>The Tree Type configuration section of the tool is the key to how to effectively use it. The tool comes with a few pre-built default configs as well as the ability to define your own custom ones and save them for later updates.</p>

                <h4>Default Configs</h4>
                <p>The current version of the tool comes with these default configs:</p>
                <ul>
                <li><span style="background-color: lightgray">balkan_moto_tree_types.json</span> - which utilizes the Basic 3D Tree Resources found on the BalkanMoto Ko-Fi Shop. They are configured to evenly distribute between the different models.</li>
                <li><span style="background-color: lightgray">balkan_moto_pine_forest.json</span> - which utilizes the Pincea and Pinus Genus Basic 3D Tree Resources found on the BalkanMoto Ko-Fi Shop. They are configured to evenly distribute between the different models.</li>
                <li><span style="background-color: lightgray">balkan_moto_elm_forest.json</span> - which utilizes the Ulmus Genus Basic 3D Tree Resources found on the BalkanMoto Ko-Fi Shop. They are configured to evenly distribute between the different models.</li>
                <li><span style="background-color: lightgray">balkan_moto_tropical_bushes.json</span> - which utilizes the Tropical 3D Bush Resources found on the BalkanMoto Ko-Fi Shop. They are configured to distribute the models in a more closer to reality way.</li>
                <li>More coming soon...</li>
                </ul>

                <h4>Custom Configs</h4>
                <p>The tool allows for building your own custom configs as well. These can be created by selected the <span style="background-color: lightgray">CUSTOM</span> option from the dropdown. You will be given the option to specify a name and save the config for later editing. Once saved the name will be cleaned up and it will appear in the drop down.</p>
                <p>The config currently consists of 3 fields per tree type</p>
                <ul>
                <li>File Name - referring to the .bin file for the 3D Tree you would like to use. (This would be generated by the Tree Model Converter in Content Manager)</li>
                <li>Probability - a number bound by 0 and 1, representing the likelihood the model will be used. The tool currently does not enforce that the total probability of all the types must add up to 1 (aka 100%). Additionally setting all tree types to 0 will produce a tree fx file with no trees in it.</li>
                <li>Elevation - a number bound by -400 and 10000, representing the elevation the probability for the model will be used in. Outside of this range the specific tree type has 0% chance of being used. This can be used to create nice transitions from lower valley tree types, to high mountain peak varieties in a more natural way.</li>
                </ul>
                <p>See Planned Features below for additions coming soon to this configuration</p>

                <h4>CSP Configs Override</h4>
                <img src="/docs/img/ac-foliage/config-overrides.jpg">
                <p>This section allows you to specific custom overrides for the size and width CSP configurations on the tree type basis. These values would be used to fill in the per line specifications in the TreeFX.</p>
                <p>Note: In future versions, once I figure out what the best way to do it is, I'll include intuitive overrides for the color and brightness as well.</p>

                <h3>Global CSP Configurations</h3>
                <img src="/docs/img/ac-foliage/global-configs.jpg">
                <p>This section of the tool allows for configuring the TreeFX settings on a global level. These will apply if there are no specific configurations on a per tree line. These settings are split up into 2 categories. Variances and Other Configs.</p>

                <h4>Variances</h4>
                <ul>
                <li>Size Variance - dictates the vertical multiplier for the 3D mesh. TreeFX will pick a random number between the range specified and multiply the vertical axis values for the model by it.</li>
                <li>Angle Variance - dictates the rotation around the vertical axis multiplier for the 3D mesh. TreeFX will pick a random number between the range specified and rotate the the model around the vertical axis by that angle. The value is bound by 0 and 360 degrees</li>
                <li>Width Variance - dictates the horizontal multiplier for the 3D mesh. TreeFX will pick a random number between the range specified and multiply the horizontal axis values for the model by it.</li>
                <li>Color Variance - dictates the multiplier for the hue change of the textures on the 3D mesh. TreeFX will pick a random number between the range specified and multiply offset the texture hue for the model by it.</li>
                <li>Brightness Variance - dictates the multiplier for the brightness change of the textures on the 3D mesh. TreeFX will pick a random number between the range specified and multiply offset the texture brightness for the model by it.</li>
                </ul>
                <h4>Other Configs</h4>
                <ul>
                <li>Fake Shadow Opacity - TreeFX has the ability to add fake shadow layers to the 3D Meshes. This is a useful optimization for very flat terrain maps. This configuration dictates how visible this fake shadow layer is.</li>
                <li>Random Seed - this value dictates how the random numbers are picked. If set the same and the generation is run the same random result will be produced. This allows for editing your configurations without completely changing the look. The randomization of the AC Foliage tool uses this same configuration as well.</li>
                </ul>

                <h3>File Generation</h3>
                <p>The tool will generate a file inside of it's <span style="background-color: lightgray">/tree_fx_configs/</span> directory named <span style="background-color: lightgray">treefx_list.txt</span>. If the file exists a numerical suffix will be added.</p>

                <h2>Tutorial Series</h2>
                <iframe src="https://www.youtube.com/embed/aOzAglNQ5v0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen=""></iframe>

                <h2>Planned Features</h2><p>
                The following are features I plan on adding to the tool to allow for a little more realism in foliage distribution and better TreeFX feature utilization:
                </p><ul>
                <li>Configuration of Variances Per Tree Type - TreeFX allows for specifying overrides to the global color and brightness variances on a per line basis. I plan on adding a feature that would allow you to configure these variance ranges on a per tree type basis. The use case here being pine trees for example do no change color but other trees do, as the season go so locking their color variance makes sense.</li>
                <li>East/West/North/South Distribution Ranges - similar to the Elevation range config, it may be useful to have configs that allow you to specify the other 2 dimension ranges for certain tree types. For example certain trees only grow on the south side of an island.</li>
                <li>More default configs - as I build more 3D Resources I will also start adding more default configs to allow for quick landscape fills with realistic foliage.</li>
                </ul>
            </div>
        </div>
    </div>
    <?php include("../theme/footer.php"); ?>
</div>
</body>
</html>