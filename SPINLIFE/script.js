var container, controls;
var camera, scene, renderer;

container = document.createElement( 'div' );
document.body.appendChild( container );

camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 50 );
camera.position.set( - 30, 20, 20 );

scene = new THREE.Scene();


var absorberColor = new THREE.MeshMatcapMaterial({ color: 0x178FFF });
var visible = true;


init();
render();

function init() {

 if(visible == true) {
    new THREE.RGBELoader().setDataType( THREE.UnsignedByteType ).setPath( 'textures/' ).load( 'surgery_1k.hdr',
        function ( texture ) {
						var envMap = pmremGenerator.fromEquirectangular( texture ).texture;
						scene.background = envMap;
						scene.environment = envMap;
                        render();	
        } );
    } 

    loader();


	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 0.3;
	renderer.outputEncoding = THREE.sRGBEncoding;
	container.appendChild( renderer.domElement );

	var pmremGenerator = new THREE.PMREMGenerator( renderer );
	pmremGenerator.compileEquirectangularShader();

	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.addEventListener( 'change', render ); // use if there is no animation loop
	controls.minDistance = 5;
	controls.maxDistance = 40;
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



function loader() {

    var loader = new THREE.GLTFLoader().setPath( 'models/' );
    var dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath( 'draco/' );
    loader.setDRACOLoader( dracoLoader );

    //	var absorberMaterial = new THREE.MeshPhongMaterial({ color: 0xa65e00 });
    // Downloading human cord only
    loader.load( 'human_cord_only.gltf', function ( glb ) {
        glb.scene.traverse( function ( child ) {
            if ( child.isMesh ) {
    		//	child.material = spinColor;
                child.castShadow = true;
            
            }
        } );
        var cord = glb.scene;                           
        cord.scale.set(0.06,0.06,0.06);
        cord.position.y = -18;
        scene.add( cord );
        render();	
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
                        absorbers.color = new THREE.Color(0x00A8E7);
                        absorbers.visible = true;
                        scene.add( absorbers );
                        render();	
                    } );
}

function environment(){
    visible = !visible;
}

