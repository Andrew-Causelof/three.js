// import * as THREE from '../build/three.module.js';
//
// import { OBJLoader } from './jsm/loaders/OBJLoader.js';

var container;

var camera, scene, renderer;

//var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var object;

var controls;

init();
animate();


function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.z = 250;

    // scene

    scene = new THREE.Scene();

    var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
    scene.add( ambientLight );

    var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
    camera.add( pointLight );
    scene.add( camera );



    // manager

    function loadModel() {

        object.traverse( function ( child ) {

           // if ( child.isMesh ) child.material.map = texture;

        } );

        object.position.y = -90;
        object.scale.set(0.3,0.3,0.3);

        scene.add( object );

    }

    var manager = new THREE.LoadingManager( loadModel );

    manager.onProgress = function ( item, loaded, total ) {

        console.log( item, loaded, total );

    };

    // texture

  // var textureLoader = new THREE.TextureLoader( manager );

  // var texture = textureLoader.load( 'textures/uv_grid_opengl.jpg' );

    // model

    function onProgress( xhr ) {

        if ( xhr.lengthComputable ) {

            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( 'model ' + Math.round( percentComplete, 2 ) + '% downloaded' );

        }

    }

    function onError() {}

    var loader = new THREE.OBJLoader( manager );

    loader.load( 'models/Skeleton.obj', function ( obj ) {

        object = obj;

    }, onProgress, onError );

    //

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    // controls for the mouse managing
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.target.set( 0, -20, 0 );
    controls.enablePan = false;


    //document.addEventListener( 'mousemove', onDocumentMouseMove, false );

    //

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

    mouseX = ( event.clientX - windowHalfX ) / 2;
    mouseY = ( event.clientY - windowHalfY ) / 2;

}

//

function animate() {

    requestAnimationFrame( animate );
    render();

}

function render() {

   // camera.position.x += ( mouseX - camera.position.x ) * .05;
    //camera.position.y += ( - mouseY - camera.position.y ) * .05;

    camera.lookAt( scene.position );

    renderer.render( scene, camera );

}