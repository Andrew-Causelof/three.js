import * as THREE from '../build/three.module.js';
			import Stats from '../libs/stats.module.js';

			import { OrbitControls } from '../controls/OrbitControls.js';
			import { OBJLoader } from '../loaders/OBJLoader.js';
			import { GLTFLoader } from '../loaders/GLTFLoader.js';

			let container, stats;

			let camera, scene, renderer, sprite, step;

			let windowHalfX = window.innerWidth / 2;
			let windowHalfY = window.innerHeight / 2;

			let mouseX = 0, mouseY = 0;

			step = 0;
			

			init();
			animate();

			function init() {

				container = document.createElement( 'div' );
				document.body.appendChild( container );

				camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 20000 );
				camera.position.z = 1900;
				camera.position.y = 0;
				

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
				//scene.background = new THREE.Color(0xffffff);
				scene.background = new THREE.Color(0x000000);


				//lights
				const ambient = new THREE.AmbientLight( 0xffffff, 1 );
				scene.add( ambient );


					// LIGHTS

					scene.add( new THREE.HemisphereLight( 0x443333, 0x111122 ) );

					let spotLight = new THREE.SpotLight( 0xffffff, 1 );
					spotLight.position.set(70, 10, 25 );    //  x y z
					spotLight.position.multiplyScalar( 1000 );
					scene.add( spotLight );

				
	
					spotLight.castShadow = true;
					
	
					spotLight.shadow.mapSize.width = 2048;
					spotLight.shadow.mapSize.height = 2048;
	
					spotLight.shadow.camera.near = 200;
					spotLight.shadow.camera.far = 1500;
	
					spotLight.shadow.camera.fov = 40;
	
					spotLight.shadow.bias = - 0.005;


					let spotLightTwo = new THREE.SpotLight( 0xffffff, 1 );
					spotLightTwo.position.set(-70, 10, 25 );    //  x y z
					spotLightTwo.position.multiplyScalar( 1000 );
					scene.add( spotLightTwo );
	


				const loader = new THREE.TextureLoader();
				
				

				const bottleMaterial = new THREE.MeshPhongMaterial( { color: 0x000000, envMap: refractionCube, refractionRatio: 0.85, opacity: 0.5,  transparent: true, side: THREE.DoubleSide } );
				const syrupMaterial = new THREE.MeshPhongMaterial( { color: 0x282829, side: THREE.DoubleSide ,   opacity: 0.99,  transparent: false } );
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


				//models
				const objLoader = new OBJLoader();

				objLoader.setPath( 'models/obj/' );
				objLoader.load( 'bar_desk.obj', function ( object ) {

					
				
					
										
					const bottle = object.children[ 0 ];
					const frontSticker =  object.children[ 1 ];
					const syrup =  object.children[ 2 ];
					const bouchon =  object.children[ 3 ];
					
					const desk = object.children[4];
			
					bottle.scale.multiplyScalar( 3 );  // bottle
					bottle.position.y =  -590;
					bottle.position.x =  1500;
					bottle.material = bottleMaterial;
					
					//adjustMesh( bottle, 3, 1500, -5900, 0, bottleMaterial)
                    
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
					frontSticker.position.z =  -10;
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

					
				//	scene.add( newDesk );
				} );

				const leafMap = new THREE.TextureLoader().load( 'img/leaf-1.png' );
				const spriteMaterial = new THREE.SpriteMaterial( { map: leafMap } );
				

				sprite = new THREE.Sprite( spriteMaterial);
				sprite.scale.set(100, 100, 100);
				sprite.position.set(-200,0,-700);
				
				scene.add( sprite );




				//renderer
				renderer = new THREE.WebGLRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.shadowMap.enabled = true;
				container.appendChild( renderer.domElement );

				//controls
				
				const controls = new OrbitControls( camera, renderer.domElement );
				controls.enableZoom = true;
				controls.enablePan = true;
				controls.minDistance = 1;
				controls.maxDistance = 2000;
		
				document.addEventListener( 'mousemove', onDocumentMouseMove, false );
				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onDocumentMouseMove( event ) {

			//	console.log(event.clientX - windowHalfX, "event.clientX");
			//	console.log( event.clientY - windowHalfY, "event.clientY")

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

				step += 0.001;	
							
				console.log();
				
				sprite.position.z = -500 +(400 * (Math.sin(step / 3)));
				sprite.position.y = 100;
            	sprite.position.x = +(400 * (Math.cos(step / 3)));	
				

				//sprite.position.z += 0.08;
				requestAnimationFrame(render);
				renderer.render( scene, camera );
				

			}


			function adjustMesh( mesh, scale = 3, x = 0, y = 0, z = 0, material){
				mesh.scale.multiplyScalar( scale );  // bottle
				mesh.position.x =  x;
				mesh.position.y =  y;
				//mesh.position.z =  z;
				mesh.material = material;
				scene.add(mesh);
			}