// CEdit class.


const DPI_1080p = 1080;
const DPI_720p = 720;

const DPI = DPI_1080p; 

const ONE_720p_INCH = DPI_720p / 10;
const ONE_1080p_INCH = DPI_1080p / 10;
const ONE_INCH = (DPI == DPI_1080p) ? ONE_1080p_INCH :  (DPI == DPI_720p) ? ONE_720p_INCH : null;
if ( ONE_INCH == null ) {
	throw new Error( "DPI INVALID: " + DPI );
}

// Convenient common factors of 72 and 108
const ONE_HALF_INCH = ONE_INCH / 2;
const ONE_QUARTER_INCH = ONE_INCH / 4;
const ONE_FOURTH_INCH = ONE_QUARTER_INCH;
const ONE_THIRD_INCH = ONE_INCH / 3;
const ONE_SIXTH_INCH = ONE_INCH / 6;
const ONE_NINTH_INCH = ONE_INCH / 9;
const ONE_TWELFTH_INCH = ONE_INCH / 12;
const ONE_EIGHTEENTH_INCH = ONE_INCH / 18;
const ONE_THIRTY_SIXTH_INCH = ONE_INCH / 36;

// ths, rds, nds
const ONE_3rd_INCH = ONE_THIRD_INCH;
const ONE_4th_INCH = ONE_FOURTH_INCH;
const ONE_6th_INCH = ONE_SIXTH_INCH;
const ONE_9th_INCH = ONE_NINTH_INCH;
const ONE_12th_INCH = ONE_TWELFTH_INCH;
const ONE_18th_INCH = ONE_EIGHTEENTH_INCH;
const ONE_36th_INCH = ONE_QUARTER_INCH / 9;

const HAND_PAINT_TOOL = "HAND_PAINT_TOOL";
const PENCIL_PAINT_TOOL = "PENCIL_PAINT_TOOL";
const ERASER_PAINT_TOOL = "ERASER_PAINT_TOOL";

function CEdit() {
	let methodName = arguments.callee.name;
	console.log(">>> %s", methodName);
	this.classname = "CEdit";
	let inst = this;
	
	this.mouseDown = {};
	// Add the canvas to the HTML document
	let element = document.getElementById("cedit");
	if (!element) { element = document.body; }


	let borderThickness = 2;
	this.borderedWidth = ONE_INCH * 10;
	this.borderedHeight = ONE_INCH * 6;

	this.width = this.borderedWidth + 2 * borderThickness;
	this.height = this.borderedHeight + 2 * borderThickness;
	this.backgroundColor = 0xdddddd;

	this.fgDrawColor = 0x000000;
	this.bgDrawColor = 0xffffff;

	this.renderer = PIXI.autoDetectRenderer(
		this.width, 
		this.height, 
		{
			backgroundColor: this.backgroundColor,
			antialias: false,
			transparent: false,
			resolution: 1,
		});

	element.appendChild(this.renderer.view);




	// Create a container object called the 'stage'
	this.stage = new PIXI.Container();


	this.borderedStage = new PIXI.Container();
	this.borderedStage.x = borderThickness;
	this.borderedStage.y = borderThickness;

	this.borderedStage.interactive = true;
	this.borderedStage.hitArea = 
		new PIXI.Rectangle(
			0, 0,
			this.borderedWidth, 
			this.borderedHeight);
	this.borderedStage.on("mousedown", function (eventData) { inst.onMouseDown(eventData); } );
	this.borderedStage.on("mouseup", function (eventData) { inst.onMouseUp(eventData); } );

	this.stageGraphics = new PIXI.Graphics();
	let sG = this.stageGraphics;
	sG.lineStyle(0,0x000000,1); //lineWidth, color , alpha
	sG.beginFill(0x000000,1); 
	sG.drawRect(0,0,this.width,this.height);
	sG.endFill();
	sG.beginFill(this.backgroundColor, 1);
	sG.drawRect(this.borderedStage.x,this.borderedStage.y,this.borderedWidth,this.borderedHeight);
	sG.endFill();
	this.stage.addChild(this.stageGraphics);



	this.drawingAreaContainer = new PIXI.Container();


	this.drawingAreaContainer.x = 0;
	this.drawingAreaContainer.y = 0;

	let drawingAreaRect = new PIXI.Rectangle(0,0, 5 * ONE_INCH, 5 * ONE_INCH ); 
	this.drawingAreaMask = this.makeRectMask(drawingAreaRect);
	this.drawingAreaContainer.addChild(this.drawingAreaMask);
	this.drawingAreaGraphics = 
		this.makeCheckerback(drawingAreaRect);
	this.drawingAreaContainer.addChild(this.drawingAreaGraphics);
	this.drawingAreaGraphics.mask = this.drawingAreaMask;

	this.drawingAreaContainer.interactive = true;
	this.drawingAreaContainer.hitArea = this.drawingAreaContainer.getLocalBounds();
	this.drawingAreaContainer.on("mousedown", function (eventData) { inst.onDrawingAreaContainerMouseDown(eventData); } );
	this.drawingAreaContainer.on("mousemove", function (eventData) { inst.onDrawingAreaContainerMouseMove(eventData); } );

	this.borderedStage.addChild(this.drawingAreaContainer);

	this.layerBoxContainer = new PIXI.Container();
	this.layerBoxContainer.x = 5 * ONE_INCH + ONE_HALF_INCH;
	this.layerBoxContainer.y = 0;
	let layerBoxRect = new PIXI.Rectangle(
		0, 0,
		ONE_INCH + ONE_HALF_INCH, 3 * ONE_INCH );
//	this.layerBoxMask = this.makeRectMask(layerBoxRect);
//	this.layerBoxContainer.addChild(this.layerBoxMask);
	this.layerBoxGraphics = this.makeLayerBox(layerBoxRect);
	this.layerBoxContainer.addChild(this.layerBoxGraphics);
//	this.layerBoxGraphics.mask = this.layerBoxMask;

	this.borderedStage.addChild(this.layerBoxContainer);


	this.paintToolboxContainer = new PIXI.Container();
	this.paintToolboxContainer.x = 5 * ONE_INCH + ONE_HALF_INCH;
	this.paintToolboxContainer.y = 4 * ONE_INCH;
	this.borderedStage.addChild(this.paintToolboxContainer);

	this.stage.addChild(this.borderedStage);

	// Tell tbhe 'renderer' to 'render' the 'stage'
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
				inst.icons = new CEdit.Icons();
				inst.icons.load().then(function(icons){
					inst.icons.addPaintToolboxIcons(inst.paintToolboxContainer, inst);
					inst.icons.addLayerBoxIcons(inst.layerBoxContainer, inst);
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
	},
	makeRectMask: function(rect) {
		let g = new PIXI.Graphics();
		console.log("MASK RECT");
		console.log(rect);
		g.beginFill();
		g.drawRect(rect.x,rect.y,rect.width,rect.height);
		g.endFill();
		return g;
	},
	makeCheckerback: function(drawingAreaRect) {
		let g = new PIXI.Graphics();
		console.log("DRAWING AREA RECT" );
		console.log(drawingAreaRect);
		let checkSize = ONE_18th_INCH;
		let drawingAreaWidth = drawingAreaRect.width;
		let drawingAreaHeight = drawingAreaRect.height;
		let rows = drawingAreaWidth / checkSize;
		let cols = drawingAreaHeight / checkSize;

		let rowOffset = 0;
		for (let r = 0; r < rows; r++) {
			let colOffset = 0;
			for (let c = 0; c < cols; c++) {
				let color = 0x707070;
				if ((r+c) % 2) {
					color = 0x909090;
				}
				g.beginFill(color);
				g.lineStyle(1,color);
				g.drawRect(rowOffset,colOffset,checkSize,checkSize);
				colOffset += checkSize;
			}
			rowOffset += checkSize;
		}
		return g;
	},
	makeLayerBox: function(layerBoxRect) {
		let g = new PIXI.Graphics();
		console.log("LAYER BOX RECT" );
		console.log(layerBoxRect);
		let layerBoxWidth = layerBoxRect.width;
		let layerBoxHeight = layerBoxRect.height;
		let itemHeight = ONE_SIXTH_INCH;
		let itemWidth = layerBoxWidth;
		let rows = layerBoxHeight / itemHeight;
		
		let borderSize = 1;

		let borderColor = 0x000000;
		let bgColor = 0xd0d0d0;	
		for (let r = 0; r < rows; r++) {
			g.lineStyle(1,borderColor);
			g.beginFill(bgColor);
			g.drawRect(0,r * itemHeight, itemWidth, itemHeight);
			g.endFill();
		}
		return g;
	},
	onDrawingAreaContainerMouseDown: function(eventData) {
		let mousePos = eventData.data.getLocalPosition(this.drawingAreaContainer);
		this.drawingAreaGraphics.moveTo(mousePos.x, mousePos.y);
	},
	onDrawingAreaContainerMouseMove: function(eventData) {
		let mousePos = eventData.data.getLocalPosition(this.drawingAreaContainer);
		if (this.isMouseDown(1)) {
			this.drawingAreaGraphics.lineStyle(1,this.fgDrawColor);
			this.drawingAreaGraphics.lineTo(mousePos.x, mousePos.y);
		} else {
			this.drawingAreaGraphics.moveTo(mousePos.x, mousePos.y);
		}
	},
	onMouseUp: function(eventData) {
		this.mouseDown[eventData.data.originalEvent.which] = false;
	},
	onMouseDown: function(eventData) {
		this.mouseDown[eventData.data.originalEvent.which] = true;
		console.log( this.mouseDown );
	},
	isMouseDown: function(which) {
		return this.mouseDown[which];
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
CEdit.Icons.EYE = "CEdit.Icons.EYE";
CEdit.Icons.EYE_URI = CEdit.Icons.DIRECTORY + "/icon-eye.png";


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
				add(CEdit.Icons.EYE, CEdit.Icons.EYE_URI).
				on("progress", CEdit.Icons.loadProgressHandler).
				load(function() {
					console.log("We are done loading");
					console.log(inst);
					resolve(inst);
				});
			});

	},
	deselect: function() {
		let methodName = "CEdit.Icons.deselect()";
		console.log(">>> %s", methodName);
		if (this.selectedPaintTool != null) {
			this.selectedPaintTool.tint = 0xFFFFFF;
		}
		console.log("<<< %s", methodName);
	},
	makeHandSprite: function(cedit) {
		let spr = new PIXI.Sprite(
			PIXI.loader.resources[CEdit.Icons.HAND].texture);
		let toolx = 0;
		let tooly = 1;

		spr.x = (ONE_HALF_INCH * toolx); // icon width * position
		spr.y = (ONE_HALF_INCH * tooly); // half an inch

		spr.width = spr.width * (DPI / DPI_720p);
		spr.height = spr.height * (DPI / DPI_720p);

		spr.interactive = true;

		let inst = this;
		spr.on("mousedown", function () { 
			cedit.tool = HAND_PAINT_TOOL;
			inst.deselect();
			inst.selectedPaintTool = spr;
			spr.tint = 0x909090;
			console.log("Selected " + cedit.tool);
		});

		return spr;
	},
	makePencilSprite: function(cedit) {
    let methodName = "CEdit.Icons.makePencilSprite()";
		console.log(">>> %s", methodName);
		
		let spr = new PIXI.Sprite(
			PIXI.loader.resources[CEdit.Icons.PENCIL].texture);
		let toolx = 1;
		let tooly = 1;

		spr.x = (ONE_HALF_INCH * toolx); // icon width * position
		spr.y = (ONE_HALF_INCH * tooly); // half an inch

		spr.width = spr.width * (DPI / DPI_720p);
		spr.height = spr.height * (DPI / DPI_720p);

		spr.interactive = true;

		let inst = this;
		spr.on("mousedown", function () { 
			cedit.tool = PENCIL_PAINT_TOOL;
			inst.deselect();
			inst.selectedPaintTool = spr;
			spr.tint = 0x909090;
			console.log("Selected " + cedit.tool);
		});


		console.log("<<< %s", methodName);
		return spr;
	},
	makeEraserSprite: function(cedit) {
		let spr = new PIXI.Sprite(
			PIXI.loader.resources[CEdit.Icons.ERASER].texture);
		let toolx = 2;
		let tooly = 1;

		spr.x = (ONE_HALF_INCH * toolx); // icon width * position
		spr.y = (ONE_HALF_INCH * tooly); // half an inch

		spr.width = spr.width * (DPI / DPI_720p);
		spr.height = spr.height * (DPI / DPI_720p);

		spr.interactive = true;

		let inst = this;
		spr.on("mousedown", function () { 
			cedit.tool = ERASER_PAINT_TOOL;
			inst.deselect();
			inst.selectedPaintTool = spr;
			spr.tint = 0x909090;
			console.log("Selected " + cedit.tool);
		});

		return spr;
	},
	addPaintToolboxIcons: function(toolboxContainer, cedit) {
		let methodName = "CEdit.Icons.addPaintToolboxIcons(toolboxContainer)";
		console.log(">>> %s", methodName);

		let hand = this.makeHandSprite(cedit);
		toolboxContainer.addChild(hand);

		let pencil = this.makePencilSprite(cedit);
		toolboxContainer.addChild(pencil);

		let eraser = this.makeEraserSprite(cedit);
		toolboxContainer.addChild(eraser);


		console.log("<<< %s", methodName);
	},
	makeEyeSprite: function(cedit) {
		let spr = new PIXI.Sprite(
			PIXI.loader.resources[CEdit.Icons.EYE].texture);
		let toolx = 0;
		let tooly = 0;

		spr.x = (ONE_SIXTH_INCH * toolx); // icon width * position
		spr.y = (ONE_SIXTH_INCH * tooly); // half an inch

		spr.width = spr.width * (DPI / DPI_720p);
		spr.height = spr.height * (DPI / DPI_720p);

		spr.interactive = true;

		let inst = this;
		spr.on("mousedown", function () { 
			console.log("CLICKED THE EYEBALL");
		});

		return spr;
	},
	addLayerBoxIcons: function(layerBoxContainer, cedit) {
		let methodName = "CEdit.Icons.addLayerBoxIcons(layerBoxContainer)";
		console.log(">>> %s", methodName);

		let eye = this.makeEyeSprite(cedit);
		layerBoxContainer.addChild(eye);


		console.log("<<< %s", methodName);
	}
};
