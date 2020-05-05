function init() {
    
    var stopMovingLight = false;

    var stats = initStats();

    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    var renderer = new THREE.WebGLRenderer();

    renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnable = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    var planeGeometry = new THREE.PlaneGeometry(100,100,1,1);
    var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;

    scene.add(plane);

    var cubeGeometry = new THREE.BoxGeometry(4,4,4);
    var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff3333});
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;

    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0;

    scene.add(cube);

    var sphereGeometry = new THREE.SphereGeometry(4,20,20);
    var sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff});
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    sphere.position.x = 20;
    sphere.position.y = 0;
    sphere.position.z = 2;
    sphere.castShadow = true;

    scene.add(sphere);

    camera.position.x = -35;
    camera.position.y = 30;
    camera.position.z = 25;

    camera.lookAt(new THREE.Vector3(10, 0, 0));

    //adding ambient light

    var ambiColor = "#4a2c2c";
    var ambientLight = new THREE.AmbientLight(ambiColor);
    scene.add(ambientLight);

    //adding a zero spotlight, to enlight a bit surface
    var spotLight0 = new THREE.SpotLight(0xcccccc);
    spotLight0.position.set(-40, 30, -10);
    spotLight0.lookAt(plane);
    scene.add(spotLight0);

    var target = new THREE.Object3D();
    target.position = new THREE.Vector3(5, 0, 0);

    var pointColor = "#ffffff";
    var SpotLight = new THREE.SpotLight(pointColor);
    SpotLight.position.set(-40, 60, -10);
    SpotLight,castShadow = true;
    SpotLight.shadow.camera.near = 2;
    SpotLight.shadow.camera.far = 200;
    SpotLight.shadow.camera.fov = 30;
    SpotLight.target = plane;
    SpotLight.distance = 0;
    SpotLight.angle = 0.4;

    scene.add(SpotLight);

     // add a small sphere simulating the pointlight

     var sphereLight = new THREE.SphereGeometry(0.2);
     var sphereLightMaterial = new THREE.MeshBasicMaterial({color: 0xac6c25});
     var sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
     sphereLightMesh.castShadow = true;

     sphereLightMesh.castShadow = true;

     sphereLightMesh.position = new THREE.Vector3(3, 20, 3);
     scene.add(sphereLightMesh);

     document.getElementById("WebGL-output").appendChild(renderer.domElement);

     var step = 0;

     // some magic for the light animation

     var invert = 1;
     var phase = 0;

     var controls = new function () {
         this.rotationSpeed = 0.03;
         this.bouncingSpeed = 0.03;
         this.ambientColor = ambiColor;
         this.pointColor = pointColor;
         this.intensity = 1;
         this.distance =0;
         this.exponent = 30;
         this.angle = 0.1;
         this.debug = false;
         this.castShadow = true;
         this.onlyShadow = false;
         this.target = "Plane";
         this.stopMovingLight = false;
     };

    var gui = new dat.GUI();
    //gui.addColor(controls, 'ambientColor').onChange(function (e){
    //    ambientLight.color = new THREE.Color(e);
    //});
    gui.addColor(controls, 'ambientColor').onChange(function (e) {
        ambientLight.color = new THREE.Color(e);
    });

    gui.addColor(controls, 'pointColor').onChange(function (e) {
        SpotLight.color = new THREE.Color(e);
    });

    gui.add(controls, 'angle', 0, Math.PI*2).onChange(function (e) {
        SpotLight.angle = e;
    });

    gui.add(controls, 'intensity', 0, 5).onChange(function (e) {
        SpotLight.intensity = e;
    });
    gui.add(controls, 'distance', 0, 200).onChange(function (e) {
        SpotLight.distance = e;
    });
    gui.add(controls, 'exponent', 0, 100).onChange(function (e) {
        SpotLight.exponent = e;
    });
    gui.add(controls, 'debug').onChange(function (e) {
        SpotLight.shadowCameraVisible = e;
    });
    gui.add(controls, 'castShadow').onChange(function (e) {
        SpotLight.castShadow = e;
    });
    gui.add(controls, 'onlyShadow').onChange(function (e) {
        SpotLight.onlyShadow = e;
    });

    gui.add(controls, 'target', ['Plane', 'Sphere', 'Cube']).onChange(function (e) {
        console.log(e);
        switch (e) {
            case "Plane":
                SpotLight.target = plane;
                break;
            case "Sphere":
                SpotLight.target = sphere;
                break;
            case "Cube":
                SpotLight.target = cube;
                break;
        }

    });

    gui.add(controls, 'stopMovingLight').onChange(function (e) {
        stopMovingLight = e;
    });

    render();

    function render() {
        stats.update();

        cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;

        step += controls.bouncingSpeed;
        sphere.position.x = 20 + ( 10 * (Math.cos(step)));
        sphere.position.y = 2 + ( 10 * Math.abs(Math.sin(step)));

        if(!stopMovingLight){
            if(phase > 2 * Math.PI){
                invert = invert * -1;
                phase -= 2 * Math.PI;
            } else {
                phase += controls.rotationSpeed;
            }
            sphereLightMesh.position.z = +(7 * (Math.sin(phase)));
            sphereLightMesh.position.x = +(14 * (Math.cos(phase)));
            sphereLightMesh.position.y = 10;

            if (invert < 0) {
                var pivot = 14;
                sphereLightMesh.position.x = (invert * (sphereLightMesh.position.x - pivot)) + pivot;
            }
           
           SpotLight.position.copy(sphereLightMesh.position);

        }


        requestAnimationFrame(render);
        renderer.render(scene,camera);

    }

    function initStats() {

        var stats = new Stats();

        stats.setMode(0); // 0: fps, 1: ms

        // Align top-left
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        document.getElementById("Stats-output").appendChild(stats.domElement);

        return stats;
    }
}

window.onload = init;