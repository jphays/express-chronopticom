(function()
{

    function Polyhedra(options)
    {

        var containerSelector = options.containerSelector;

        var dimensions = { width: 600, height: 600 };
        var $container;

        var scene, camera, renderer;
        var reflectionCamera;
        var objects = [];
        var lights = [];

        init();

        function init()
        {
            $container = $(containerSelector);
            $container.css({
                width: dimensions.width + "px",
                height: dimensions.height + "px"
            });

            initRenderer();
            initScene();
            initObjects();
            initLights();

            render();
        }

        function initRenderer()
        {
            if (window.WebGLRenderingContext)
            {
                renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            }
            else
            {
                renderer = new THREE.CanvasRenderer();
            }

            renderer.setSize(dimensions.width, dimensions.height);
            $container.append($(renderer.domElement));
        }

        function initScene()
        {
            scene = new THREE.Scene({
                fog: THREE.FogExp2(getRandomColor(), 50)
            });

            camera = new THREE.PerspectiveCamera(60, dimensions.width / dimensions.height, 0.1, 1000);
            camera.position.z = 5;
        }

        function initObjects()
        {
            reflectionCamera = new THREE.CubeCamera(0.1, 5000, 512);
            //reflectionCamera.renderTarget.mapping = new THREE.CubeRefractionMapping();
            //reflectionCamera.renderTarget.minFilter = THREE.LinearMipMapLinearFilter;
            scene.add(reflectionCamera);

            var geometries = [
                //new THREE.BoxGeometry(2,2,2),
                new THREE.DodecahedronGeometry(2, 0),
                //new THREE.DodecahedronGeometry(2.2, 0),
                //new THREE.IcosahedronGeometry(2, 0),
                //new THREE.IcosahedronGeometry(2.2, 1),
                //new THREE.OctahedronGeometry(2, 0),
                //new THREE.OctahedronGeometry(2.2, 1),
                //new THREE.PlaneGeometry(100, 100)
                //new THREE.TorusKnotGeometry(3,1, 48, 48, 2, 3);
            ];

            //var material = new THREE.MeshNormalMaterial();
            var material = new THREE.MeshPhongMaterial({
                color: 0xDDDDEE,
                specular: 0x333328,
                shading: THREE.FlatShading,
                side: THREE.DoubleSide,
                shininess: 50,
                transparent: true,
                opacity: 0.7,
                refractionRatio: 1.6, //2.4,
                reflectivity: 0.3,
                envMap: reflectionCamera.renderTarget,
            });

            for (var i = 0; i < geometries.length; i++) {
                var mesh = new THREE.Mesh(geometries[i], material);
                objects.push(mesh);
                scene.add(mesh);
            }

            var p = new THREE.Mesh(
                new THREE.PlaneGeometry(1000, 1000),
                new THREE.MeshBasicMaterial({ color: 0x222222 })); // getRandomColor() }));
            p.rotation.x = -Math.PI / 2;
            p.position.y = -9;
            scene.add(p);

            // $.each(geometries, function(geometry) {
            //     scene.add(new THREE.Mesh(geometry, material));
            // });
        }

        function initLights()
        {
            // var directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
            // directionalLight.position.set(0, 0, -3);
            // scene.add(directionalLight);

            var areaLight = new THREE.AreaLight( 0xffffff, 1 );
            areaLight.position.set( 0, 5, -3 );
            areaLight.rotation.set( 1.5, 0, 0 );
            areaLight.width = 10;
            areaLight.height = 10;
            scene.add(areaLight);

            var areaBulb = new THREE.Mesh(
                new THREE.PlaneGeometry(10, 10),
                new THREE.MeshBasicMaterial({ color: 0xffffff }));
            areaBulb.position.set(0, 15, 0);
            areaBulb.rotation.set(1, 0, 0 );
            scene.add(areaBulb);

            for (var i = 0; i < 7; i++)
            {
                var lightColor = getRandomColor(ColorCollections.lightColors);

                var position = {
                    x: (Math.pow(Math.random(), 2)) * 9 - 3,
                    y: (Math.pow(Math.random(), 1)) * 6 - 2,
                    z: (Math.pow(Math.random(), 2)) * 9 - 3
                };

                var size = Math.random();
                var lightbulb = new THREE.Mesh(
                    new THREE.IcosahedronGeometry(size * 0.3 + 0.05, Math.floor(size * 1.3)),
                    new THREE.MeshPhongMaterial({
                        color: lightColor,
                        shininess: 12,
                        emissive: lightColor,
                        specular: lightColor,
                        shading: THREE.FlatShading,
                        transparent: true,
                        opacity: 0.9,
                        envMap: reflectionCamera.renderTarget,
                        reflectivity: 0.4 }));
                var pointLight = new THREE.PointLight(lightColor, 1, 100);

                lightbulb.position.set(position.x, position.y, position.z);
                pointLight.position.set(position.x, position.y, position.z);

                lights.push({
                    light: pointLight,
                    bulb: lightbulb
                })

                scene.add(lightbulb);
                scene.add(pointLight);
            }

            var ambientLight = new THREE.AmbientLight(0x202020);
            scene.add(ambientLight);

        }

        function render(time)
        {
            requestAnimationFrame(render);
            animate(time);
            updateReflectionMap();
            renderer.render(scene, camera);
        }

        function animate(time) {
            //cube.rotation.x += 0.015;
            //cube.rotation.z += 0.009;

            for (var i = 0; i < objects.length; i++) {
                objects[i].rotation.x += 0.015;
                objects[i].rotation.z += 0.009;
            }

            for (var i = 0; i < lights.length; i++) {
                lights[i].bulb.rotation.x -= 0.007;
                lights[i].bulb.rotation.z -= 0.013;
            }

            camera.position.x = Math.cos( time / 2000 ) * 7; // + (Math.sin(time / 2000) * 1.1);
            camera.position.z = Math.sin( time / 2000 ) * 7; // + (Math.cos(time / 2000) * 1.1);
            camera.position.y = 0; // Math.pow(Math.tan( time / 1000 ), 2) * -1;
            camera.lookAt(scene.position);
        }

        function updateReflectionMap()
        {
            $.each(objects, function(i, o) { o.visible = false; });
            reflectionCamera.updateCubeMap(renderer, scene);
            $.each(objects, function(i, o) { o.visible = true; });
        }

        function getRandomColor(colorSet)
        {
            if (!colorSet) colorSet = ColorCollections.tehcolors;
            var index = Math.floor(Math.random() * colorSet.length);
            var hexString = colorSet[index].hexString;
            return parseInt(hexString.substr(1), 16);
        }

        return {
            init: init
        };

    }

    window.Polyhedra = Polyhedra;

})();