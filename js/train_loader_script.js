
var loader = new THREE.GLTFLoader();

loader.load( './assets/train.glb', function( gltf) {
  scene.add ( gltf.scene );
},
undefined,
function ( error ) {
   console.error( error );
});
