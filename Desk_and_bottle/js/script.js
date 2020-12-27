import * as THREE from '../build/three.module.js';
			import Stats from '../libs/stats.module.js';

			import { OrbitControls } from '../controls/OrbitControls.js';
			import { OBJLoader } from '../loaders/OBJLoader.js';

			let container, stats;

			let camera, scene, renderer;

			let pointLight;

			init();
			animate();

			function init() {

				container = document.createElement( 'div' );
				document.body.appendChild( container );

				camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
				camera.position.z = 2000;
				

				//cubemap
				let path = 'textures/cube/street/';
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
				 
				path = 'textures/cube/sky/';
				format = '.jpg';
				urls = [
					path + 'px' + format, path + 'nx' + format,
					path + 'py' + format, path + 'ny' + format,
					path + 'pz' + format, path + 'nz' + format
				];

				const refractionIce = new THREE.CubeTextureLoader().load( urls );
				refractionIce.mapping = THREE.CubeRefractionMapping;
				


				//lights
				const ambient = new THREE.AmbientLight( 0xffffff, 2 );
				scene.add( ambient );

				//pointLight = new THREE.PointLight( 0xffffff, 1, 100 );
				//pointLight.position.set( 0, 0, 0 );
                //scene.add( pointLight );
                
               // const helper = new THREE.PointLightHelper( pointLight , 10, 0x000000 );
                //scene.add( pointLight );

                //materials
				const loader = new THREE.TextureLoader();
				
				const diffuseMap = loader.load( 'textures/wood.jpg' );
				const normalMap = loader.load( 'textures/wood-3-3.jpg'  );

				const bottleMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, envMap: refractionCube, refractionRatio: 0.85, opacity: 0.6,  transparent: true, side: THREE.DoubleSide } );
				const syrupMaterial = new THREE.MeshPhongMaterial( { color: 0xe84c09, side: THREE.DoubleSide ,   opacity: 0.99,  transparent: false } );
                const stickerTextur =  new THREE.MeshPhongMaterial( { color: 0x78716e, map: loader.load('textures/Popcorn.png'), side: THREE.DoubleSide });
				const bouchonMaterial = new THREE.MeshPhongMaterial( { color: 0x78716e, map: loader.load('textures/CoctailSyrup.png'), refractionRatio: 0.3,  transparent: false } );
				const deskMaterial = new THREE.MeshPhongMaterial( {  map: diffuseMap, normalMap: normalMap,  transparent: false } );
				const material = new THREE.MeshPhongMaterial( {
				//	color: 0x552811,
					map: diffuseMap,
					specular: 0x222222,
					shininess: 25,
					bumpMap: normalMap,
					bumpScale: 50
				} );

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
                    bottle.material = bottleMaterial;
                    
                    bouchon.scale.multiplyScalar( 3 );  // пробка
					bouchon.position.y = - 590;
                    bouchon.material = bouchonMaterial;
               
                    syrup.scale.multiplyScalar( 3.0 );
					syrup.position.y = - 590;
					syrup.material = syrupMaterial ;

					
					frontSticker.scale.multiplyScalar( 3 );
					frontSticker.position.y = - 590;
					frontSticker.material = stickerTextur ;

					desk.scale.multiplyScalar( 3 );
					desk.position.y = - 590;
					desk.material = material ;


                               
					 scene.add( bouchon, frontSticker, syrup, bottle, desk);
				

				} );

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
				controls.minPolarAngle = Math.PI / 4;
				controls.maxPolarAngle = Math.PI / 1.5;

				//stats
				stats = new Stats();
				container.appendChild( stats.dom );

				window.addEventListener( 'resize', onWindowResize, false );

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

				renderer.render( scene, camera );
				stats.update();

			}
