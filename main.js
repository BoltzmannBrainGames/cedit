//var pixi = require('pixi.js');
//PIXI from node.js is old as fuck and doesn't work
//
// All we need node.js for is to read and write files.  Node.js is pretty slick
// but fuck it eh?  Maybe we'll run this shit on a server.


var pixi = PIXI;

var Main = Main ? Main : {};

Main.main = function () { 
	pixi.loader.
		add("cat", "imgs/cat.png").
		add("cat2", "imgs/cat2.png").
		add("cat3", "imgs/cat3.png").
		on("progress", Main.loadProgressHandler).
		load(Main.onAllLoaded);
};



Main.loadProgressHandler = function( loader, resource) {

  //Display the file `url` currently being loaded
  console.log("loading: %s, progress: %2d%%", resource.url, loader.progress); 
  
  //If you gave your files names as the first argument 
  //of the `add` method, you can access them like this
  //console.log("loading: " + resource.name);
}


Main.onAllLoaded = function() {
	//Create the renderer
	Main.renderer = pixi.autoDetectRenderer(
		256, 256,
		{antialias: false, transparent: false, resolution: 1}
	);

	//Add the canvas to the HTML document
	document.body.appendChild(Main.renderer.view);

	//Create a container object called the `stage`
	Main.stage = new pixi.Container();

	//Tell the `renderer` to `render` the `stage`
	Main.renderer.render(Main.stage);


	Main.catSprite = new pixi.Sprite(pixi.loader.resources["cat"].texture);	

	Main.stage.addChild(Main.catSprite);

	Main.xstep = 1; Main.ystep = 1;

	Main.message = new pixi.Text(
 		 "Hello Pixi!",
 		 {font: "32px sans-serif", fill: "white"}
	);
	Main.message.x = 50;
	Main.message.y = 70;

	Main.stage.addChild(Main.message);

	Main.gameLoop();
};

Main.gameLoop = function() {
	requestAnimationFrame(Main.gameLoop);
	if (Main.catSprite.x > 200) { Main.xstep = -1; } else if ( Main.catSprite.x <= 0 ) { Main.xstep = 1; }
	if (Main.catSprite.y > 200) { Main.ystep = -1; } else if ( Main.catSprite.y <= 0 ) { Main.ystep = 1; }

	Main.catSprite.x += Main.xstep;
	Main.catSprite.y += Main.ystep;
	Main.renderer.render(Main.stage);
};
