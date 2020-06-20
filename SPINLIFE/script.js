var container, controls;
var camera, scene, renderer;

// so defenetly it needs to do configurator right here 
var pmremGenerator, envMap, backgroundColor;  // clinic environement - global variables
var absorberColor = new THREE.MeshMatcapMaterial({ color: 0x178FFF });

//const texturLoader = new THREE.TextureLoader();

//const boneColor = new THREE.MeshBasicMaterial({
//  map: texturLoader.load('boneTexture/1.jpg'),
//});

//absorberColor = new THREE.MeshBasicMaterial({
 //   map: texturLoader.load('boneTexture/absorber_2.jpg'),
 // });

//var brainColor = new THREE.MeshMatcapMaterial({ color: 0x660000 });
var boneColor = new THREE.MeshMatcapMaterial({ color: 0xeae8dc });

//var bones, absorbers, cord;
var  absorbers, cord;
var lumbar, thoracic, cervical, sacrum;  
//
var c_sprite, t_sprite, l_sprite, s_sprite;
//
container = document.createElement( 'div' );
document.body.appendChild( container );
//

camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.25, 300 );
//camera.position.set( - 30, 20, 20 );  // common view
 camera.position.set( 0, 0, 40 ); //use for sprites only
scene = new THREE.Scene();

//scene.background = new THREE.Color('white');
backgroundColor = new THREE.Color(0x485770);
//scene.background = new THREE.Color(0x9c9a97);
/*
var helper = new THREE.CameraHelper( camera );
scene.add( helper );
*/

init();
render();

function init() {

	renderer = new THREE.WebGLRenderer( { antialias: true , alpha : true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 0.4;
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild( renderer.domElement );

    
    pmremGenerator = new THREE.PMREMGenerator( renderer );
    pmremGenerator.compileEquirectangularShader();

    loader();
    RGBELoader();
   // backgroundtextureLoader(); 
    spineSprites();
    Lighting();

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
                    //scene.background = envMap;
                    scene.environment = envMap;
                    scene.background = backgroundColor;                  
                    render();	
    } );  
}
// ---------no need any more, changed by RGBE loader-------
//--------in the end it may be removed from the code------
function backgroundtextureLoader() {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      'backgroundtexture/pos-x.jpg',
      'backgroundtexture/neg-x.jpg',
      'backgroundtexture/pos-y.jpg',
      'backgroundtexture/neg-y.jpg',
      'backgroundtexture/pos-z.jpg',
      'backgroundtexture/neg-z.jpg',
    ]);
    scene.background = texture;
    scene.environment = texture;
}
//----------------------------------------------------------------

function loader() {

    var loader = new THREE.GLTFLoader().setPath( 'models/' );
    var bones;

    loader.load( 'bones_texture.glb', function ( glb ) {
        glb.scene.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.castShadow = true;
                //child.material = boneColor;
            }
        } );
        bones = glb.scene;  
        console.log(bones);                         
        bones.scale.set( 0.06, 0.06, 0.06 );
        bones.position.y = -18;

              //поясничный отдел L1-L5
      lumbar = bones.clone();
      lumbar.children = lumbar.children.slice( 0, 5 );
      scene.add( lumbar );
    
      //грудной отдел
      thoracic = bones.clone();
      thoracic.children = thoracic.children.slice( 6, 18 );
      scene.add( thoracic );

      //шейный отдел 
      cervical = bones.clone();
      cervical.children= cervical.children.slice( 18, 25 );
      scene.add( cervical );

      // копчик
      sacrum = bones.clone();
      sacrum.children= sacrum.children.slice( 5, 6 );
      scene.add ( sacrum );

    } );
    
    // Downloading absorbers

     loader.load( 'absorbers.glb', function ( glb ) {
         
             glb.scene.traverse( function ( child ) {
                 if ( child.isMesh ) {
                     child.castShadow = true;
                     //child.material = absorberColor;
                     //child.material = boneColor;
                 }
             } );
             absorbers = glb.scene;                           
             absorbers.scale.set( 0.06, 0.06, 0.06 );
             absorbers.position.y = -18;
             scene.add( absorbers );
    } );
    

    // Downloading human cord
    loader.load( 'cord.glb', function ( glb ) {
         
        glb.scene.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.castShadow = true;
                //child.material = boneColor;
            }
        } );
        cord = glb.scene;                           
        cord.scale.set (0.06, 0.06, 0.06);
        cord.position.y = -18;
        scene.add( cord );
        render();	
    } );

    //--------------custom-----------------------------
    
}

  function Lighting() {
        var ambientLight = new THREE.AmbientLight( 0xcccccc, 0 );
        scene.add( ambientLight );

        var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
        camera.add( pointLight );
  }

function range() {

    

    var range = document.getElementById('range');

    console.log(range.value);

    var sliding = range.value / 15;

    if (range.value > 40 && range.value < 60) {
        bonesMoving(0);
        absorbers.position.x = 0;
        cord.position.x      = 0;

        spriteVisible(false);
        bonesVisible(true); 
        absorbers.visible = true; 
        cord.visible      = true;
    }

    if (range.value < 40 && range.value > 25) {
        absorbers.visible = false;
        cord.visible      = true;
        spriteVisible(false);
        bonesVisible(true);    

        bonesMoving(0);
        absorbers.position.x = 0;
        cord.position.x      = 0;
    }
 
    if (range.value > 15 && range.value <= 25 ){

        bonesMoving(0);
        absorbers.position.x = 0;
        cord.position.x      = 0;

        cord.visible      = true;
        absorbers.visible = false;
        bonesVisible(false); 
        spriteVisible(false);
    }

    if (range.value <= 15) {

        bonesVisible(true);
        cord.visible      = false;
        absorbers.visible = false;

        spriteVisible(true); 

        cervical.position.x = -1;
        thoracic.position.x =  1;
        lumbar.position.x   = -1;
        sacrum.position.x   =  1;  
    }


    if (range.value > 60 ) {

        spriteVisible(false); 
        bonesVisible(true); 
        absorbers.visible = true; 
        cord.visible      = true;

        bonesMoving(range.value / 8 - sliding);
        absorbers.position.x = range.value / 18 - sliding;
        cord.position.x = - sliding;
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

function spriteVisible(boolean) {
    if (boolean == false) {
        c_sprite.visible  = false;
        t_sprite.visible  = false;
        l_sprite.visible  = false;
        s_sprite.visible  = false;
    } else {
        c_sprite.visible  = true;
        t_sprite.visible  = true;
        l_sprite.visible  = true;
        s_sprite.visible  = true;
    }
}
//--------------BUTTONS BEGIN--------------------------
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

 
  function changeBackground() {
    if (scene.background == backgroundColor) {
        scene.background = envMap;
    } else {
        scene.background = backgroundColor;
    }
    render();
  }


//-------------------BUTTONS END---------------------------------------------
//-------------------BEGIN SPRITE BLOCK--------------------------------------
//---------------------------------------------------------------------------

 function spineSprites(){
    c_sprite = makeTextSprite( " Шейный отдел ", 
    { fontsize: 20, borderColor: {r:0, g:0, b:0, a:1.0}, backgroundColor: {r:100, g:100, b:100, a:0} } );
    c_sprite.scale.set(15, 11, 0);
    c_sprite.position.set(9,7,1);
    scene.add( c_sprite );
    //----------------------------------------
    t_sprite = makeTextSprite( " Грудной отдел ", 
    { fontsize: 20, borderColor: {r:0, g:0, b:0, a:1.0}, backgroundColor: {r:100, g:100, b:100, a:0} } );
    t_sprite.scale.set(15, 11, 0);
    t_sprite.position.set(11,-2,1);
    scene.add( t_sprite );
    //--------------------------------------------------
    l_sprite = makeTextSprite( " Поясничный отдел ", 
    { fontsize: 20, borderColor: {r:0, g:0, b:0, a:1.0}, backgroundColor: {r:100, g:100, b:100, a:0} } );
    l_sprite.scale.set(15, 11, 0);
    l_sprite.position.set(9,-14,1);
    scene.add( l_sprite );

    //--------------------------------------------------
    s_sprite = makeTextSprite( " Крестцовый отдел ", 
    { fontsize: 20, borderColor: {r:0, g:0, b:0, a:1.0}, backgroundColor: {r:100, g:100, b:100, a:0} } );
    s_sprite.scale.set(15, 11, 0);
    s_sprite.position.set(12,-19,1);
    scene.add( s_sprite );
    //--------------------------------------------------

    spriteVisible(false);
 }  


function makeTextSprite( message, parameters )
{
	if ( parameters === undefined ) parameters = {};
	
	var fontface = parameters.hasOwnProperty("fontface") ? 
		parameters["fontface"] : "Arial";
	
	var fontsize = parameters.hasOwnProperty("fontsize") ? 
		parameters["fontsize"] : 18;
	
	var borderThickness = parameters.hasOwnProperty("borderThickness") ? 
		parameters["borderThickness"] : 2;
	
	var borderColor = parameters.hasOwnProperty("borderColor") ?
		parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
	
	var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
		parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };

	var spriteAlignment = THREE.SpriteAlignment;
		
	var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
	context.font = "Bold " + fontsize + "px " + fontface;
    
	// get size data (height depends only on font size)
	var metrics = context.measureText( message );
	var textWidth = metrics.width;
	
	// background color
	context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
								  + backgroundColor.b + "," + backgroundColor.a + ")";
	// border color
	context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
								  + borderColor.b + "," + borderColor.a + ")";

	context.lineWidth = borderThickness;
	roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
	// 1.4 is extra height factor for text below baseline: g,j,p,q.
	
	// text color
	context.fillStyle = "rgba(0, 0, 0, 1.0)";

	context.fillText( message, borderThickness, fontsize + borderThickness);
	
	// canvas contents will be used for a texture
	var texture = new THREE.Texture(canvas) 
	texture.needsUpdate = true;

	var spriteMaterial = new THREE.SpriteMaterial( 
		{ map: texture, useScreenCoordinates: false, alignment: spriteAlignment } );
	var sprite = new THREE.Sprite( spriteMaterial );
	sprite.scale.set(100,50,1.0);
	return sprite;	
}

function roundRect(ctx, x, y, w, h, r) 
{
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
    ctx.fill();
	ctx.stroke();   
}
//---------------------------END SPRITE BLOCK--------------------------------