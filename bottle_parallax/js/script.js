import * as THREE from '../build/three.module.js';
			import Stats from '../libs/stats.module.js';

			import { OrbitControls } from '../controls/OrbitControls.js';
			import { OBJLoader } from '../loaders/OBJLoader.js';
			import { GLTFLoader } from '../loaders/GLTFLoader.js';

			let container, stats;

			let camera, scene, renderer;
			let  spriteLeaf,
				 spriteRoseLeft,
				 spriteRoseRight,
				 spriteRoseLeft2,
				 spriteRoseRight2,
				 spriteGinger,
				 spriteGrapefruit,
				 spritePeaflower;


			let windowHalfX = window.innerWidth / 2;
			let windowHalfY = window.innerHeight / 2;

			let mouseX = 0, mouseY = 0;

			
			let step = {     // шаги
				count: 0,  // число шагов
				leftDirection: true        // направление вращения
			  };

			var plane, background;  

			scene = new THREE.Scene();
			camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 20000 );

			
			addLight();
			addBottleOnScene();
			addSprites();
			init();
			animate();
			

			function init() {

				container = document.createElement( 'div' );
				document.body.appendChild( container );
				
				camera.position.z = 2500;
				camera.position.y = 0;
				camera.position.x = -360;

				//renderer
				renderer = new THREE.WebGLRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.shadowMap.enabled = true;
				
				container.appendChild( renderer.domElement );

				//controls

				const controls = new OrbitControls( camera, renderer.domElement );
				controls.enableZoom = false;
				controls.enablePan = false;
				controls.minDistance = 3000;
				controls.maxDistance = 3000;
				controls.enable = false;
				controls.enableRotate = false;

				var planeGeometry = new THREE.PlaneGeometry(10000, 10000, 20, 20);
				var planeMaterial = new THREE.MeshLambertMaterial({color: 0x000000});
				plane = new THREE.Mesh(planeGeometry, planeMaterial);
				plane.receiveShadow = true;

				plane.rotation.x = -0.5 * Math.PI;
				plane.position.x = 15;
				plane.position.y = -760;
				plane.position.z = 0;

				scene.add( plane );


				var backgroundGeometry = new THREE.PlaneGeometry(15000, 15000, 20, 20);
				var backgroundMaterial = new THREE.MeshPhongMaterial({color: 0x000000});
				background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
				background.receiveShadow = true;

				//plane.rotation.x = -0.5 * Math.PI;
				background.position.x = 15;
				background.position.y = -700;
				background.position.z = -5000;

				scene.add( background );

				

		
				document.addEventListener( 'mousemove', onDocumentMouseMove, false );
				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onDocumentMouseMove( event ) {

			//	console.log(event.clientX - windowHalfX, "event.clientX");
			//	console.log( event.clientY - windowHalfY, "event.clientY");

				mouseX = ( event.clientX - windowHalfX ) ;
				mouseY = ( event.clientY - windowHalfY ) ;

				mouseX < 0 ? step.leftDirection = true : step.leftDirection = false;
				


				if((mouseX < 0) && (step.count == 0) && (step.leftDirection == true)) {
					
					step.count = 150;
					
				}

				if((mouseX > 0) && (step.count >= 0) && (step.leftDirection == false)) {
					
					step.count = -150;
					
				}

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

							
				//	let spriteLeaf, spriteRoseLeft;
				//spriteGinger , spriteGrapefruit

				 if (step.leftDirection == true) {
					step.count <= 0 ? step.count = 0 : step.count -= 0.1;
					
				 } else {
					step.count >= 0 ? step.count = 0 : step.count += 0.1;
					
				 }		


				 console.log(step.count, 'count');
				 console.log(step.leftDirection, 'direction');
				// console.log(spriteLeaf);
				
				if(true) {
				
					spriteLeaf.position.x = +(300 * (Math.cos(step.count / 6)));
					spriteLeaf.position.y = (100 * (Math.cos(step.count  / 6)));
					spriteLeaf.position.z = -400 +(300 * (Math.sin(step.count  / 6)));

					spriteRoseLeft.position.x = 0 +(400 * (Math.cos(step.count / 5)));
					spriteRoseLeft.position.y =  200 + (150 * (Math.sin(step.count / 5)));
					spriteRoseLeft.position.z = -350 +(250 * (Math.sin(step.count / 5)));	

					spriteRoseRight.position.x = 100 +(400 * (Math.cos(step.count / 6)));
					spriteRoseRight.position.y = -200 + (-300 * (Math.sin(step.count / 6)));
					spriteRoseRight.position.z = -350 +(450 * (Math.sin(step.count / 6)));
				
					spriteGinger.position.x =  +(200 * (Math.cos(step.count / 5)));
					spriteGinger.position.y = 500 + (-200 * (Math.sin(step.count / 5)));
					spriteGinger.position.z = -350 +(200 * (Math.sin(step.count / 5)));

					spriteGrapefruit.position.x =  +(300 * (Math.cos(step.count / 6)));
					spriteGrapefruit.position.y = 50 + (200 * (Math.sin(step.count / 6)));
					spriteGrapefruit.position.z = -350 +(300 * (Math.sin(step.count / 6)));

				/*
					spritePeaflower.position.x =  +(300 * (Math.cos(step.count / 5)));
					spritePeaflower.position.y = 50 + (200 * (Math.sin(step.count / 5)));
					spritePeaflower.position.z = -350 +(300 * (Math.sin(step.count / 5)));

					
*/
					spritePeaflower.position.x = -100 +(400 * (Math.cos(step.count / 5)));
					spritePeaflower.position.y = 300 + (-200 * (Math.sin(step.count / 5)));
					spritePeaflower.position.z = -350 +(300 * (Math.sin(step.count / 5)));


					spriteRoseLeft2.position.x = 0 +(400 * (Math.cos(step.count / 6)));
					spriteRoseLeft2.position.y = -500 + (150 * (Math.sin(step.count / 6)));
					spriteRoseLeft2.position.z = -350 +(250 * (Math.sin(step.count / 6)));	

					spriteRoseRight2.position.x = 100 +(400 * (Math.cos(step.count / 4)));
					spriteRoseRight2.position.y = 200 + (-300 * (Math.sin(step.count / 4)));
					spriteRoseRight2.position.z = -350 +(450 * (Math.sin(step.count / 4)));
				}	
				
		
				
					/*	
				
*/


				//console.log(step.leftDirection);
				
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


			function rotateSprite(sprite, step ) {
				sprite.position.x = +(400 * (Math.cos(step / 3)));
				sprite.position.y = (40 * (Math.sin(step / 3)));
				sprite.position.z = -400 +(400 * (Math.sin(step / 3)));	
			}


			function addBottleOnScene(){

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

				
			 	scene.background = reflectionCube;
				//scene.background = new THREE.Color(0xffffff);
				scene.background = new THREE.Color(0x000000);

				
				const loader = new THREE.TextureLoader();
				
				const bottleMaterial = new THREE.MeshPhongMaterial( { color: 0x000000, envMap: refractionCube, refractionRatio: 0.85, opacity: 0.5,  transparent: true, side: THREE.DoubleSide } );
				const syrupMaterial = new THREE.MeshPhongMaterial( { color: 0x282829, side: THREE.DoubleSide ,   opacity: 0.99,  transparent: false } );
                const stickerTextur =  new THREE.MeshPhongMaterial( { color: 0x78716e, map: loader.load('textures/Popcorn.png'),bumpMap: loader.load( 'textures/scratch-3-1.jpg'  ), side: THREE.DoubleSide });
				const bouchonMaterial = new THREE.MeshPhongMaterial( { color: 0x000000, map: loader.load('textures/CoctailSyrup.png'), refractionRatio: 0.3,  transparent: false } );
				

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

			}


			function addLight(){
				// LIGHTS

				//lights
				const ambient = new THREE.AmbientLight( 0xffffff, 1 );
				scene.add( ambient );

				scene.add( new THREE.HemisphereLight( 0x443333, 0x111122 ) );


				let spotLight = new THREE.SpotLight( 0xcacaca, 1 );
				spotLight.position.set(70, 10, 25 );    //  x y z
				spotLight.position.multiplyScalar( 1000 );
				scene.add( spotLight );

			

				spotLight.castShadow = true;
				

				spotLight.shadow.mapSize.width = 2048;
				spotLight.shadow.mapSize.height = 2048;

				spotLight.shadow.camera.near = 200;
				spotLight.shadow.camera.far = 1500;

				spotLight.shadow.camera.fov = 40;

				//spotLight.shadow.bias = - 0.005;


				let spotLightTwo = new THREE.SpotLight( 0xcacaca, 1 );
				spotLightTwo.position.set(-70, 10, 25 );    //  x y z
				spotLightTwo.position.multiplyScalar( 1000 );
				scene.add( spotLightTwo );

				
				let spotLightThree = new THREE.SpotLight( 0xcacaca, 1 );
				spotLightThree.position.set(0, -10, 25 );    //  x y z
				spotLightThree.position.multiplyScalar( 100 );
				scene.add( spotLightThree );
		
				scene.add(spotLightThree);

			

			}

			


			function addSprites(){
				spriteLeaf = new THREE.Sprite( new THREE.SpriteMaterial( { map: new THREE.TextureLoader().load( 'img/rose-petal-left.png' ) } ) );
				spriteLeaf.scale.set(150, 150, 150);
				spriteLeaf.position.set(-200,0,-700);
				
				scene.add( spriteLeaf );

				
				spriteRoseLeft = new THREE.Sprite( new THREE.SpriteMaterial( { map: new THREE.TextureLoader().load( 'img/rose-petal-left.png' ) } ) );
				spriteRoseLeft.scale.set(150, 150, 150);
				spriteRoseLeft.position.set( -200,0,-700 );
				
				scene.add( spriteRoseLeft );

				spriteRoseRight = new THREE.Sprite( new THREE.SpriteMaterial( { map: new THREE.TextureLoader().load( 'img/rose-petal-right.png' ) } ) );
				spriteRoseRight.scale.set(150, 150, 150);
				spriteRoseRight.position.set( 0,0,0 );
				
				scene.add( spriteRoseRight );

				//spriteGinger , spriteGrapefruit

				spriteGinger = new THREE.Sprite( new THREE.SpriteMaterial( { map: new THREE.TextureLoader().load( 'img/ginger.png' ) } ) );
				spriteGinger.scale.set(150, 150, 150);
				spriteGinger.position.set( 2000,2000,2000 );
				
				scene.add( spriteGinger );

				spriteGrapefruit = new THREE.Sprite( new THREE.SpriteMaterial( { map: new THREE.TextureLoader().load( 'img/grapefruit-peel.png' ) } ) );
				spriteGrapefruit.scale.set(150, 150, 150);
				spriteGrapefruit.position.set( 2000,2000,2000 );
				
				scene.add( spriteGrapefruit );

				spritePeaflower = new THREE.Sprite( new THREE.SpriteMaterial( { map: new THREE.TextureLoader().load( 'img/rose-petal-left.png' ) } ) );
				spritePeaflower.scale.set(150, 150, 150);
				spritePeaflower.position.set( 2000,2000,2000 );
				
				scene.add( spritePeaflower );

				
				spriteRoseLeft2 = spriteRoseLeft.clone();
				
				scene.add( spriteRoseLeft2 );

				spriteRoseRight2 = spriteRoseRight.clone();
				
				scene.add( spriteRoseRight2 );
			
			}

		