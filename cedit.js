// CEdit class.

function CEdit() {
	let methodName = arguments.callee.name;
	console.log(">>> %s", methodName);
	this.classname = "CEdit";

	this.renderer = PIXI.autoDetectRenderer(
		72 * 10, // 10 inches wide @72 dpi
		72 * 6,  // 6 inches tall @72 dpi
		{
			antialias: false,
			transparent: false,
			resolution: 1
		});

	// Add the canvas to the HTML document
	document.body.appendChild(this.renderer.view);

	// Create a container object called the 'stage'
	this.stage = new PIXI.Container();

	// Tell the 'renderer' to 'render' the 'stage'
	this.renderer.render(this.stage);

	console.log("<<< %s", methodName);
}

CEdit.prototype = {
	constructor: CEdit,
	setup: function() {
		let methodName = "CEdit.setup()"
		console.log(">>> %s", methodName);
		let inst = this;
		console.log("<<< %s", methodName);
		return new Promise(function(resolve, reject) {
			if (inst) {
				let cedit_inst = inst;
				console.log("DUMPING inst");
				console.log(inst);
				inst.icons = new CEdit.Icons();
				inst.icons.load().then(function(icons){
					inst.icons.addToolboxIcons(inst.stage);
					// Shit is this better than a goto?
					resolve(cedit_inst);
				}).catch(function(error) {
					reject(error);
				});
			} else {
				reject(new Error("Could not CEdit.setup()"));
			}
		});
	},
	run: function() {
		let methodName = "CEdit.run()";
		console.log(">>> %s", methodName);
		this.gameLoop();
		console.log("<<< %s", methodName);
	},
	gameLoop: function() {
		//let methodName = "CEdit.gameLoop()";
		//console.log(">>> %s", methodName);

		// enclose this.
		let inst = this;
		let thisFunc = function () { inst.gameLoop(); };
		requestAnimationFrame(thisFunc);
		this.renderer.render(this.stage);

		//console.log("<<< %s", methodName);
	}
	
};


// CEdit.Icons 
CEdit.Icons = function() {
	let methodName = "CEdit.Icons()";
	console.log(">>> %s", methodName);
	this.classname = "CEdit.Icons";
	console.log("<<< %s", methodName);
};

CEdit.Icons.loadProgressHandler = function (loader, resource) {
	console.log("Loading: %s, progress %2d%%", resource.url, loader.progress);
};

CEdit.Icons.DIRECTORY = "icons";
CEdit.Icons.PENCIL = "CEdit.Icons.PENCIL";
CEdit.Icons.PENCIL_URI = CEdit.Icons.DIRECTORY + "/icon-pencil.png";
CEdit.Icons.HAND = "CEdit.Icons.HAND";
CEdit.Icons.HAND_URI = CEdit.Icons.DIRECTORY + "/icon-hand.png";
CEdit.Icons.ERASER = "CEdit.Icons.ERASER";
CEdit.Icons.ERASER_URI = CEdit.Icons.DIRECTORY + "/icon-eraser.png";

CEdit.Icons.prototype = {
	constructor: CEdit.Icons,
	load: function() {
		let methodName = "CEdit.Icons.load()";
		console.log(">>> %s", methodName);
		let inst = this;
		console.log("<<< %s", methodName);
		return new Promise(function(resolve, reject) {
			PIXI.loader.
				add(CEdit.Icons.PENCIL, CEdit.Icons.PENCIL_URI).
				add(CEdit.Icons.HAND, CEdit.Icons.HAND_URI).
				add(CEdit.Icons.ERASER, CEdit.Icons.ERASER_URI).
				on("progress", CEdit.Icons.loadProgressHandler).
				load(function() {
					console.log("We are done loading");
					console.log(inst);
					resolve(inst);
				});
			});

	},
	makePencilSprite: function() {
    let methodName = "CEdit.Icons.makePencilSprite()";
		console.log(">>> %s", methodName);
		
		let spr = new PIXI.Sprite(
			PIXI.loader.resources[CEdit.Icons.PENCIL].texture);
		let toolx = 1;
		let tooly = 1;

		spr.x = 72 * 5 + // five inches 
			36 + // scrollbar width = 1/2 inch
			(36 * toolx); // icon width * position
		spr.y = 72 * 4 + // four inches down
			(36 * tooly); // half an inch
		console.log("<<< %s", methodName);
		return spr;
	},
	makeEraserSprite: function() {
		let spr = new PIXI.Sprite(
			PIXI.loader.resources[CEdit.Icons.ERASER].texture);
		let toolx = 3;
		let tooly = 1;

		spr.x = 72 * 5 + // five inches 
			36 + // scrollbar width = 1/2 inch
			(36 * toolx); // icon width * position
		spr.y = 72 * 4 + // four inches down
			(36 * tooly); // half an inch
		return spr;
	},
	makeHandSprite: function() {
		let spr = new PIXI.Sprite(
			PIXI.loader.resources[CEdit.Icons.HAND].texture);
		let toolx = 0;
		let tooly = 1;

		spr.x = 72 * 5 + // five inches 
			36 + // scrollbar width = 1/2 inch
			(36 * toolx); // icon width * position
		spr.y = 72 * 4 + // four inches down
			(36 * tooly); // half an inch
		return spr;
	},
	addToolboxIcons: function(stage) {
		let methodName = "CEdit.Icons.addToolboxIcons(stage)";
		console.log(">>> %s", methodName);

		let pencil = this.makePencilSprite();

		stage.addChild(pencil);

		let eraser = this.makeEraserSprite();
		stage.addChild(eraser);

		let hand = this.makeHandSprite();
		stage.addChild(hand);
		console.log("<<< %s", methodName);
	}
};
