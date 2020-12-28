import * as THREE from '../build/three.module.js';
			import Stats from '../libs/stats.module.js';

			import { OrbitControls } from '../controls/OrbitControls.js';
			import { OBJLoader } from '../loaders/OBJLoader.js';
			import { GLTFLoader } from '../loaders/GLTFLoader.js';

			let container, stats;

			let camera, scene, renderer;

			let windowHalfX = window.innerWidth / 2;
			let windowHalfY = window.innerHeight / 2;

			let mouseX = 0, mouseY = 0;

			init();
			animate();

			function init() {

				container = document.createElement( 'div' );
				document.body.appendChild( container );

				camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 20000 );
				camera.position.z = 1900;
				camera.position.y = -500;
				

				//cubemap
				let path = 'textures/cube/chapel/';
				let format = '.jpg';
				let urls = [
					path + 'px' + format, path + 'nx' + format,
					path + 'py' + format, path + 'ny' + format,
					path + 'pz' + format, path + 'nz' + format
				];

				const reflectionCube = new THREE.CubeTextureLoader().load( urls );
				const refractionCube = new THREE.CubeTextureLoader().load( urls );
				refractionCube.mapping = THREE.CubeRefractionMapping;

				scene = new THREE.Scene();
			 	scene.background = reflectionCube;
				scene.background = new THREE.Color(0x141414);


				//lights
				const ambient = new THREE.AmbientLight( 0xffffff, 0.85 );
				scene.add( ambient );


					// LIGHTS

					scene.add( new THREE.HemisphereLight( 0x443333, 0x111122 ) );

					let spotLight = new THREE.SpotLight( 0xffffff, 1 );
					spotLight.position.set(5, 0, 25 );    //  x y z
					spotLight.position.multiplyScalar( 100 );
					scene.add( spotLight );

				
	
					spotLight.castShadow = true;
					
	
					spotLight.shadow.mapSize.width = 2048;
					spotLight.shadow.mapSize.height = 2048;
	
					spotLight.shadow.camera.near = 200;
					spotLight.shadow.camera.far = 1500;
	
					spotLight.shadow.camera.fov = 40;
	
					spotLight.shadow.bias = - 0.005;
	
					//

				//pointLight = new THREE.PointLight( 0xffffff, 1, 100 );
				
				//pointLight.position.set( 0, 0, 0 );
                //scene.add( pointLight );
                
               // const helper = new THREE.PointLightHelper( pointLight , 10, 0x000000 );
                //scene.add( pointLight );

                //materials
				const loader = new THREE.TextureLoader();
				
				

				const bottleMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, envMap: refractionCube, refractionRatio: 0.85, opacity: 0.6,  transparent: true, side: THREE.DoubleSide } );
				const syrupMaterial = new THREE.MeshPhongMaterial( { color: 0xe84c09, side: THREE.DoubleSide ,   opacity: 0.99,  transparent: false } );
                const stickerTextur =  new THREE.MeshPhongMaterial( { color: 0x78716e, map: loader.load('textures/Popcorn.png'),bumpMap: loader.load( 'textures/scratch-3-1.jpg'  ), side: THREE.DoubleSide });
				const bouchonMaterial = new THREE.MeshPhongMaterial( { color: 0x78716e, map: loader.load('textures/CoctailSyrup.png'), refractionRatio: 0.3,  transparent: false } );
				

				const diffuseMap = loader.load( 'textures/wood-table.jpg',  function ( map ) {

					map.wrapS = THREE.RepeatWrapping;
					map.wrapT = THREE.RepeatWrapping;
					map.anisotropy = 4;
					map.repeat.set( 1, 2 );
					map.encoding = THREE.sRGBEncoding;
				} );

				const normalMap = loader.load( 'textures/wood-table-1-1.jpg'  );

				const deskMaterial = new THREE.MeshPhongMaterial( {
					color: 0x211f1e,
					map: diffuseMap,
					specular: 0x222222,
					shininess: 25,
					//bumpMap: normalMap,
					//bumpScale: 50
				} );

				/*
					const textureLoader = new THREE.TextureLoader();
				textureLoader.load( "textures/hardwood2_diffuse.jpg", function ( map ) {

					map.wrapS = THREE.RepeatWrapping;
					map.wrapT = THREE.RepeatWrapping;
					map.anisotropy = 4;
					map.repeat.set( 10, 24 );
					map.encoding = THREE.sRGBEncoding;
					floorMat.map = map;
					floorMat.needsUpdate = true;

				} );

				*/

				//models
				const objLoader = new OBJLoader();

				objLoader.setPath( 'models/obj/' );
				objLoader.load( 'bar_desk.obj', function ( object ) {

					console.log(object);
					
					const bottle = object.children[ 0 ];
					const frontSticker =  object.children[ 1 ];
					const syrup =  object.children[ 2 ];
					const bouchon =  object.children[ 3 ];
					
					const desk = object.children[4];
			
                    

					bottle.scale.multiplyScalar( 3 );  // bottle
					bottle.position.y =  -590;
					bottle.position.x =  1500;
                    bottle.material = bottleMaterial;
                    
                    bouchon.scale.multiplyScalar( 3 );  // пробка
					bouchon.position.y = - 590;
					bouchon.position.x =  1500;
                    bouchon.material = bouchonMaterial;
               
                    syrup.scale.multiplyScalar( 3.04 );
					syrup.position.y = - 590;
					syrup.position.x =  1515;
					syrup.material = syrupMaterial ;

					
					frontSticker.scale.multiplyScalar( 3 );
					frontSticker.position.y = - 590;
					frontSticker.position.x =  1500;
					frontSticker.material = stickerTextur ;



                               
					 scene.add( bouchon, frontSticker, syrup, bottle);
				

				} );

				let glbLoader = new GLTFLoader();
				glbLoader.load( "models/gltf/bar.glb", function ( gltf ) {

					let desk = gltf.scene;

					let newDesk = new THREE.Mesh( desk.children[ 0 ].geometry, deskMaterial );
					newDesk.scale.set(10, 5, 15); //   -толщина - 
					newDesk.position.y = - 590;
					newDesk.position.z =  -100;
					newDesk.position.x =  9200;
					newDesk.castShadow = true;
					newDesk.receiveShadow = true;

					//newDesk.rotation.x = -Math.PI / 20;

					
					scene.add( newDesk );
				} );

				/*
				const spriteMap = new THREE.TextureLoader().load( 'textures/sprite.jpg' );
				const spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap } );
				

				const sprite = new THREE.Sprite( spriteMaterial);
				sprite.scale.set(15000, 5000, 5000);
				sprite.position.set(0,1200,-5000);
				
				scene.add( sprite );
				*/

				const geometry = new THREE.PlaneGeometry( 27000, 11000, 500 );
				//const material = new THREE.MeshBasicMaterial( {color: 0x141414, side: THREE.DoubleSide} );
				const barMaterial = new THREE.MeshPhongMaterial( { color: 0x7b7b7b,  map: loader.load('textures/sprite_4.jpg'), refractionRatio: 0.9,  transparent: false } );
				const plane = new THREE.Mesh( geometry, barMaterial );
				plane.position.set(0,2500, -9000);
				//plane.rotation.x = -Math.PI / 20;
				scene.add( plane );
								



				//renderer
				renderer = new THREE.WebGLRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.shadowMap.enabled = true;
				//renderer.outputEncoding = THREE.sRGBEncoding;
				container.appendChild( renderer.domElement );

				//controls
				
				const controls = new OrbitControls( camera, renderer.domElement );
				controls.enableZoom = true;
				controls.enablePan = false;
				//controls.minZoom  = 1;
				//controls.maxZoom = 1;
				controls.minDistance = 1;
				controls.maxDistance = 2000;
				controls.minPolarAngle = 0;
				controls.maxPolarAngle = Math.PI / 1.8;
				controls.minAzimuthAngle = 6.0345;  //11*Math.PI /6 ; - 15 deg
				controls.maxAzimuthAngle = 0.2749; //Math.PI /6;   15 deg
				

				//stats
				/*
				stats = new Stats();
				container.appendChild( stats.dom );
					*/
				document.addEventListener( 'mousemove', onDocumentMouseMove, false );
				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onDocumentMouseMove( event ) {

				console.log(event.clientX - windowHalfX, "event.clientX");
				console.log( event.clientY - windowHalfY, "event.clientY")
				mouseX = ( event.clientX - windowHalfX ) ;
				mouseY = ( event.clientY - windowHalfY ) ;

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function animate() {

				requestAnimationFrame( animate );
				render();

			}

			function render() {

				//camera.position.x += ( mouseX - camera.position.x ) / 2;
				//camera.position.y += ( - mouseY - camera.position.y ) / 2;
				//camera.position.z += ( mouseX - camera.position.x ) / 2;
				//console.log(camera.position.z);

			//	camera.position.x += ( mouseX - camera.position.x ) * .05;
			//	camera.position.y = THREE.MathUtils.clamp( camera.position.y + ( - ( mouseY - 200 ) - camera.position.y ) * .05, 50, 1000 );

				renderer.render( scene, camera );
				//stats.update();

			}
