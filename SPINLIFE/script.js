var container, controls;
var camera, scene, renderer;

// so it needs to do configurator right here 
var pmremGenerator, envMap;  // clinic environement - global variables
var absorberColor = new THREE.MeshMatcapMaterial({ color: 0x178FFF });
//var brainColor = new THREE.MeshMatcapMaterial({ color: 0x660000 });
//var boneColor = new THREE.MeshMatcapMaterial({ color: 0xeae8dc });

//var bones, absorbers, cord;
var  absorbers, cord;
var lumbar, thoracic, cervical, sacrum;  

//
container = document.createElement( 'div' );
document.body.appendChild( container );
//

camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.25, 300 );
camera.position.set( - 30, 20, 20 );

scene = new THREE.Scene();

scene.background = new THREE.Color('white');




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
    RGBELoader(); 
    //Lighting();

	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.addEventListener( 'change', render ); // using cos there is no animation loop
	controls.minDistance = 0.1;
	controls.maxDistance = 100;
    controls.target.set( 0, -1, 0 );
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
    var bones;

    loader.load( 'bones.gltf', function ( glb ) {
        glb.scene.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.castShadow = true;
               // child.material = boneColor;
            
            }
        } );
        bones = glb.scene;                           
        bones.scale.set(0.06,0.06,0.06);
        bones.position.y = -18;

              //поясничный отдел L1-L5
      lumbar = bones.clone();
      lumbar.children = lumbar.children.slice(0, 5);
      scene.add( lumbar );
    
      //грудной отдел
      thoracic = bones.clone();
      thoracic.children = thoracic.children.slice(6, 18);
      scene.add( thoracic );

      //шейный отдел 
      cervical = bones.clone();
      cervical.children= cervical.children.slice(18, 25);
      scene.add( cervical );

      // копчик
      sacrum = bones.clone();
      sacrum.children= sacrum.children.slice(5, 6);
      scene.add ( sacrum );

    } );
    
    // Downloading absorbers

     loader.load( 'absorbers.gltf', function ( glb ) {
         
             glb.scene.traverse( function ( child ) {
                 if ( child.isMesh ) {
                     child.castShadow = true;
                     child.material = absorberColor;
                 }
             } );
             absorbers = glb.scene;                           
             absorbers.scale.set(0.06,0.06,0.06);
             absorbers.position.y = -18;
             scene.add( absorbers );
    } );
    

    // Downloading human cord
    loader.load( 'cord.gltf', function ( glb ) {
         
        glb.scene.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.castShadow = true;
            }
        } );
        cord = glb.scene;                           
        cord.scale.set(0.06,0.06,0.06);
        cord.position.y = -18;
     //   cord.visible = true;
        scene.add( cord );
        render();	
    } );
}

  function Lighting() {

        var ambientLight = new THREE.AmbientLight( 0xcccccc, 0. );
        scene.add( ambientLight );

        var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
        camera.add( pointLight );
  }

  function spineLabling() {

  }


function range() {

    var range = document.getElementById('range');
    var sliding = range.value / 15;

    range.value < 40 ? absorbers.visible = false : absorbers.visible = true;
    range.value < 25 ? bonesVisible(false) : bonesVisible(true);

    if (range.value > 15 && range.value <= 25 ){

        bonesMoving(0);
        absorbers.position.x = 0;
        cord.position.x      = 0;

        cord.visible      = true;
        absorbers.visible = false;
        bonesVisible(false); 

    }

    if (range.value <= 15) {

        bonesVisible(true); 

        cord.visible = false;
        cervical.position.x = -2;
        thoracic.position.x = 2;
        lumbar.position.x   = -2;
        sacrum.position.x   = 2;
        
    }


    if (range.value > 60 ) {
        bonesMoving(range.value / 8 - sliding);
        absorbers.position.x = range.value / 18 - sliding;
        cord.position.x = - sliding;
    }
    if (range.value > 40 && range.value < 60) {
        bonesMoving(0);
        absorbers.position.x = 0;
        cord.position.x = 0;
    }
    render();
}


function bonesVisible(boolean) {
    if (boolean == false) {
        lumbar.visible   = false;
        thoracic.visible = false;
        cervical.visible = false;
        sacrum.visible   = false;
    } else {
        lumbar.visible   = true;
        thoracic.visible = true;
        cervical.visible = true;
        sacrum.visible   = true;
    }
    render();
}

function bonesMoving(x) {
    lumbar.position.x   = x;
    thoracic.position.x = x;
    cervical.position.x = x;
    sacrum.position.x   = x;
    render();
}



//------------- making screenshot -------------------
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
//---------------------------------------------------------
