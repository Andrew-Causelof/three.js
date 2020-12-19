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

				camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 10000 );
				camera.position.z = 2000;

				//cubemap
				const path = 'textures/cube/';
				const format = '.jpg';
				const urls = [
					path + 'px' + format, path + 'nx' + format,
					path + 'py' + format, path + 'ny' + format,
					path + 'pz' + format, path + 'nz' + format
				];

				const reflectionCube = new THREE.CubeTextureLoader().load( urls );
				const refractionCube = new THREE.CubeTextureLoader().load( urls );
				refractionCube.mapping = THREE.CubeRefractionMapping;

				scene = new THREE.Scene();
			 	scene.background = reflectionCube;

				//lights
				const ambient = new THREE.AmbientLight( 0xffffff );
				scene.add( ambient );

				pointLight = new THREE.PointLight( 0xffffff, 1 );
                scene.add( pointLight );
                
                const helper = new THREE.PointLightHelper( pointLight );
                scene.add( pointLight );

                //materials
                const loader = new THREE.TextureLoader();

				//const cubeMaterial3 = new THREE.MeshLambertMaterial( { color: 0xff6600, envMap: reflectionCube, combine: THREE.MixOperation, reflectivity: 0.95 } );
				//const cubeMaterial1 = new THREE.MeshLambertMaterial( { color: 0x4bde75, envMap: reflectionCube, refractionRatio: 0.9, opacity: 0.5,  transparent: true } );
				
                //const cubeMaterial3 = new THREE.MeshLambertMaterial( { color: 0xffffff, envMap: reflectionCube, refractionRatio: 0.9, opacity: 0.8,  transparent: true } );
                //const stickerMaterial = new THREE.MeshLambertMaterial( { color: 0x1d1d29, envMap: reflectionCube, refractionRatio: 0.1,   transparent: false } );
                // may be good for fluid //const bottleMaterial = new THREE.MeshMatcapMaterial( { color: 0xE3CA77, envMap: refractionCube, refractionRatio: 0.9, opacity: 0.7,  transparent: true } );
                const bottleMaterial = new THREE.MeshPhongMaterial( { color: 0xE3CA77, envMap: refractionCube, refractionRatio: 0.9, opacity: 0.7,  transparent: true } );
                const stickerMaterial = new THREE.MeshBasicMaterial( { color: 0x17171c, refractionRatio: 0.9,   transparent: false } );
                const stickerTextur =  new THREE.MeshPhongMaterial({map: loader.load('textures/Popcorn.png')});
                const bouchonMaterial = new THREE.MeshBasicMaterial( { color: 0x343438, envMap: reflectionCube, refractionRatio: 0.9,   transparent: false } );

				//models
				const objLoader = new OBJLoader();

				objLoader.setPath( 'models/obj/' );
				objLoader.load( 'bottle_sticker.obj', function ( object ) {

                    console.log(object);
                    
                    
                    const bouchon = object.children[ 0 ];
                    const frontSticker =  object.children[ 1 ];
                    const bottle = object.children[ 3 ];
                    const rearSticker =  object.children[ 2 ];
                    

					bouchon.scale.multiplyScalar( 30 );
					bouchon.position.y = - 500;
                    bouchon.material = bouchonMaterial;
                    
                    frontSticker.scale.multiplyScalar( 30 );
					frontSticker.position.y = - 500;
                    frontSticker.material = stickerTextur;
                    
                    bottle.scale.multiplyScalar( 30 );
					bottle.position.y = - 500;
                    bottle.material = bottleMaterial ;
                    
                    rearSticker.scale.multiplyScalar( 30 );
					rearSticker.position.y = - 500;
					rearSticker.material = stickerMaterial ;

                    /*
                    const head2 = head.clone();
					head2.position.x = - 900;
					head2.material = cubeMaterial2;

					const head3 = head.clone();
					head3.position.x = 900;
					head3.material = cubeMaterial3;
                    */
                    //scene.add( head, head2, head3 );
                    scene.add( bouchon, frontSticker, bottle,rearSticker);

				} );

				//renderer
				renderer = new THREE.WebGLRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );

				//controls
				const controls = new OrbitControls( camera, renderer.domElement );
				controls.enableZoom = false;
				controls.enablePan = false;
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
