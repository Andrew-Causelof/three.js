

window.onload = function () {
    let app = new PIXI.Application({width: window.innerWidth, height: window.innerHeight});
    document.body.appendChild(app.view);
    
    let img = new PIXI.Sprite.from('bottle.jpg');
    img.width = '780';
    img.height = '520';
    app.stage.addChild(img);
    
    depthMap = new PIXI.Sprite.from('bottle-map.jpg');
    app.stage.addChild(depthMap);
    console.log(depthMap);
    depthMap.width = '768'
    depthMap.height = '520';
    
    displacementFilter = new PIXI.filters.DisplacementFilter(depthMap);
    app.stage.filters = [displacementFilter];
    app.stage.width = '768';
    app.stage.height = '520';
    
    window.onmousemove = function(e) {
        displacementFilter.scale.x = (window.innerWidth / 2 - e.clientX) /20;
        displacementFilter.scale.y = (window.innerHeight / 2 - e.clientY) /20;
      };
    }