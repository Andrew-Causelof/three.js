var container, controls;
var camera, scene, renderer;

// so it needs to do configurator right here 
var pmremGenerator, envMap;  // clinic environement - global variables
var absorberColor = new THREE.MeshMatcapMaterial({ color: 0x178FFF });
//var brainColor = new THREE.MeshMatcapMaterial({ color: 0x660000 });
//var boneColor = new THREE.MeshMatcapMaterial({ color: 0xeae8dc });

//
container = document.createElement( 'div' );
document.body.appendChild( container );
//

camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 300 );
camera.position.set( - 30, 20, 20 );

scene = new THREE.Scene();





init();
render();

function init() {

	renderer = new THREE.WebGLRenderer( { antialias: true , alpha : true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 0.3;
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild( renderer.domElement );

    
    pmremGenerator = new THREE.PMREMGenerator( renderer );
    pmremGenerator.compileEquirectangularShader();

    loader();
  //  RGBELoader();
    
   // Lighting();

	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.addEventListener( 'change', render ); // using cos there is no animation loop
	controls.minDistance = 0.1;
	controls.maxDistance = 100;
	controls.target.set( 0, 0, - 0.2 );
	controls.update();

	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	render();

}

function render() {
	renderer.render( scene, camera );
}

function RGBELoader() {
    
    new THREE.RGBELoader().setDataType( THREE.UnsignedByteType ).setPath( 'textures/' ).load( 'surgery_1k.hdr',
    function ( texture ) {
                    envMap = pmremGenerator.fromEquirectangular( texture ).texture;
                    scene.background = envMap;
                    scene.environment = envMap;
                    render();	
    } );
    
}

function loader() {

    var loader = new THREE.GLTFLoader().setPath( 'models/' );
    // Downloading human spine only

    loader.load( 'bones.gltf', function ( glb ) {
        glb.scene.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.castShadow = true;
               // child.material = boneColor;
            
            }
        } );
        var cord = glb.scene;                           
        cord.scale.set(0.06,0.06,0.06);
        cord.position.y = -18;
       // cord.castShadow = true;
        //cord.receiveShadow = true;
        scene.add( cord );
       // console.log(cord);
       // render();	
    } );
    
    // Downloading absorbers

     loader.load( 'absorbers.gltf', function ( glb ) {
         
             glb.scene.traverse( function ( child ) {
                 if ( child.isMesh ) {
                     child.castShadow = true;
                     child.material = absorberColor;
                 }
             } );
             var absorbers = glb.scene;                           
             absorbers.scale.set(0.06,0.06,0.06);
             absorbers.position.y = -18;
             scene.add( absorbers );
            // console.log(absorbers);

           //  render();	
    } );

    // Downloading human cord
    loader.load( 'cord.gltf', function ( glb ) {
         
        glb.scene.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.castShadow = true;
            }
        } );
        var root = glb.scene;                           
        root.scale.set(0.06,0.06,0.06);
        root.position.y = -18;
        root.visible = true;
        scene.add( root );
        render();	
} );

}
// getting acces to canvas
const canvas = container.children[0];

const elem = document.querySelector('#screenshot');
  elem.addEventListener('click', () => {
    render();
    canvas.toBlob((blob) => {
      saveBlob(blob, `screencapture-${canvas.width}x${canvas.height}.png`);
    });
  });

  const saveBlob = (function() {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    return function saveData(blob, fileName) {
       const url = window.URL.createObjectURL(blob);
       a.href = url;
       a.download = fileName;
       a.click();
    };
  }());

  function Lighting() {

var ambientLight = new THREE.AmbientLight( 0xcccccc, 0. );
scene.add( ambientLight );

var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
camera.add( pointLight );

  }


/*
function range() {
    var range = document.getElementById('range');
    // var p = document.getElementById('paragraph');
    var input = document.getElementById('text_for_range');
    //p.innerHTML = range.value;
    input.value = range.value;
    input.style.width = range.value + 'px';
}
*/

