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


const STAGE_BORDER_THICKNESS = 2;

const BORDERED_STAGE_WIDTH = ONE_INCH * 10;
const BORDERED_STAGE_HEIGHT = ONE_INCH * 6;
const DRAWING_AREA_WIDTH = 5 * ONE_INCH;
const DRAWING_AREA_HEIGHT = 5 * ONE_INCH;
const SCROLLBAR_THICKNESS = ONE_QUARTER_INCH;


const LAYER_BOX_ROW_THICKNESS = ONE_SIXTH_INCH;

const EYE_ICON_WIDTH = LAYER_BOX_ROW_THICKNESS;
const EYE_ICON_HEIGHT = EYE_ICON_WIDTH;

const LAYER_BOX_WIDTH = ONE_INCH + ONE_HALF_INCH;
const LAYER_BOX_HEIGHT = 3 * ONE_INCH;

const LAYER_BOX_TEXT_WIDTH = LAYER_BOX_WIDTH - SCROLLBAR_THICKNESS - EYE_ICON_WIDTH;


function CEdit() {
	let methodName = arguments.callee.name;
	console.log(">>> %s", methodName);
	this.classname = "CEdit";
	let inst = this;
	
	this.mouseDown = {};
	// Add the canvas to the HTML document
	let element = document.getElementById("cedit");
	if (!element) { element = document.body; }


	this.width = BORDERED_STAGE_WIDTH + 2 * STAGE_BORDER_THICKNESS;
	this.height = BORDERED_STAGE_HEIGHT + 2 * STAGE_BORDER_THICKNESS;
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

	this.stageGraphics = new PIXI.Graphics();
	let sG = this.stageGraphics;
	sG.lineStyle(0,0x000000,1); //lineWidth, color , alpha
	sG.beginFill(0x000000,1); 
	sG.drawRect(0,0,this.width,this.height);
	sG.endFill();
	sG.beginFill(this.backgroundColor, 1);
	sG.drawRect(
		STAGE_BORDER_THICKNESS,STAGE_BORDER_THICKNESS,
		BORDERED_STAGE_WIDTH,BORDERED_STAGE_HEIGHT);
	sG.endFill();
	this.stage.addChild(this.stageGraphics);


	this.borderedStage = new PIXI.Container();
	this.borderedStage.x = STAGE_BORDER_THICKNESS;
	this.borderedStage.y = STAGE_BORDER_THICKNESS;

	this.borderedStage.interactive = true;
	this.borderedStage.hitArea = 
		new PIXI.Rectangle(
			0, 0,
			BORDERED_STAGE_WIDTH, 
			BORDERED_STAGE_HEIGHT);
	this.borderedStage.on("mousedown", function (eventData) { inst.onMouseDown(eventData); } );
	this.borderedStage.on("mouseup", function (eventData) { inst.onMouseUp(eventData); } );
	this.stage.addChild(this.borderedStage);



	this.drawingAreaContainer = new PIXI.Container();
	this.drawingAreaContainer.x = 0;
	this.drawingAreaContainer.y = 0;

	let drawingAreaRect = 
		new PIXI.Rectangle(0,0, DRAWING_AREA_WIDTH, DRAWING_AREA_HEIGHT); 
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


	this.layers = [];
	this.layers.push(new CEdit.Layer("Background"));
	this.layers.push(new CEdit.Layer("Layer1", false));
	this.layers.push(new CEdit.Layer("Layer2", true));
	this.layers.push(new CEdit.Layer("Layer3", true));
	this.layers.push(new CEdit.Layer("Layer4", true));
	this.layers.push(new CEdit.Layer("Layer5", true));
	this.layers.push(new CEdit.Layer("Layer6", true));
	this.layers.push(new CEdit.Layer("Layer7", true));
	this.layers.push(new CEdit.Layer("Layer8", true));
	this.layers.push(new CEdit.Layer("Layer9", true));
	this.layers.push(new CEdit.Layer("Layer10", true));
	this.layers.push(new CEdit.Layer("Layer11", true));
	this.layers.push(new CEdit.Layer("Layer12", true));
	this.layers.push(new CEdit.Layer("Layer13", true));
	this.layers.push(new CEdit.Layer("Layer14", true));
	this.layers.push(new CEdit.Layer("Layer15", true));
	this.layers.push(new CEdit.Layer("Layer16", true));
	this.layers.push(new CEdit.Layer("Layer17", true));
	this.layers.push(new CEdit.Layer("Layer18", true));
	this.layers.push(new CEdit.Layer("Layer19", true));
	this.layers.push(new CEdit.Layer("Layer20", true));

	this.layerBoxContainer = new PIXI.Container();
	this.layerBoxContainer._cedit = {};
	this.layerBoxContainer.x = DRAWING_AREA_WIDTH + SCROLLBAR_THICKNESS;
	this.layerBoxContainer.y = 0;
	let layerBoxRect = new PIXI.Rectangle(
		0, 0,
		SCROLLBAR_THICKNESS + LAYER_BOX_WIDTH, LAYER_BOX_HEIGHT);
	this.makeLayerBox(this.layerBoxContainer,layerBoxRect);
	this.borderedStage.addChild(this.layerBoxContainer);


	this.paintToolboxContainer = new PIXI.Container();
	this.paintToolboxContainer.x = DRAWING_AREA_WIDTH + 2 * SCROLLBAR_THICKNESS;
	this.paintToolboxContainer.y = 4 * ONE_INCH;
	this.borderedStage.addChild(this.paintToolboxContainer);


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
	makeLayerBox: function(container, layerBoxRect) {
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
			g.drawRect(
				ONE_QUARTER_INCH,r * itemHeight, 
				itemWidth - ONE_QUARTER_INCH, itemHeight);
			g.endFill();
		}
		container.addChild(g);
		this.makeLayerBoxSlider(container, layerBoxRect.height);
		this.makeLayerBoxTexts(container, layerBoxRect);
	},
	makeLayerBoxSlider: function(container, height) {
		let g = new PIXI.Graphics();
		let inst = this;
		let width = ONE_QUARTER_INCH;
		let borderColor = 0x000000;
		let bgColor = 0xd0d0d0;	
		g.lineStyle(1,borderColor);
		g.beginFill(bgColor);
		g.drawRect(0,0, width,height);
		g.endFill();
		container.addChild(g);
	},
	makeLayerBoxTexts: function(container) {
		let rows = LAYER_BOX_HEIGHT / LAYER_BOX_ROW_THICKNESS;
		
		let borderSize = 1;
		for (let r = 0; r < rows; r++) {
			if (r < this.layers.length) {
				let text = this.makeLayerBoxText(container, r);
				this.layers[r].text = text;
				container.addChild(text);
			}
		}
	},
	makeLayerBoxText: function(container,layerIndex) {
		let inst = this;

		if (layerIndex >= inst.layers.length ) {
			console.log("Called makeLayerBoxText for layerIndex out of bounds: " + layerIndex );
			return null;
		}
		let style = {
			fontFamily: "Arial",
			fontSize: "9px",
			wordWrap: false,
			stroke: "#000000"
		};

		let text = new PIXI.Text(inst.layers[layerIndex].name, style);
		text.layerIndex = layerIndex;

		text.x = LAYER_BOX_WIDTH - LAYER_BOX_TEXT_WIDTH;
		text.y = layerIndex * LAYER_BOX_ROW_THICKNESS + (LAYER_BOX_ROW_THICKNESS / 2);

		text.anchor = new  PIXI.Point(0,0.5);
		text.interactive = true;
		text.hitArea = new PIXI.Rectangle(0,-0.5 * LAYER_BOX_ROW_THICKNESS,LAYER_BOX_TEXT_WIDTH, LAYER_BOX_ROW_THICKNESS);
		text.on("mousedown", function(e) {
			let thisText = text;
			let li = thisText.layerIndex;	
			let oldName = inst.layers[li].name;
			let newName = window.prompt("Enter new layer name", oldName); 
			e.stopPropagation();

			if (newName == null) {
				console.log("User canceled: not changing text");
			} else if (newName == "") {
				let answer = window.confirm("Are you sure you want to delete the layer named " + oldName + "?" );
				if (answer == true) {
					console.log("Deleting layer " + li);
					inst.layers[li].remove(container);
					inst.layers.splice(li,1); // delete from array and reindex
					for (let i = li; i < ( inst.layers.length - 1); i++) {
						if ( i * LAYER_BOX_ROW_THICKNESS < LAYER_BOX_HEIGHT ) {
							if (inst.layers[i] != null && inst.layers[i].text != null ) {
								inst.layers[i].text.y -= LAYER_BOX_ROW_THICKNESS;
								inst.layers[i].text.layerIndex = i;
							} else {
								let text = inst.makeLayerBoxText(container,i);
								inst.layers[i].text = text;
								container.addChild(text);
							}
							if (inst.layers[i].eyeSprite != null ) {
								inst.layers[i].eyeSprite.y -= LAYER_BOX_ROW_THICKNESS;
							} else {
								let eyeSprite =  inst.icons.makeEyeSprite(inst, i);
								inst.layers[i].eyeSprite = eyeSprite;
								container.addChild(eyeSprite);
							}
						}
					} 
				}
			} else {
				inst.layers[li].name = newName;	
				text.text = inst.layers[li].name;
			}
		});

		return text;
	},
	onDrawingAreaContainerMouseDown: function(eventData) {
		let mousePos = eventData.data.getLocalPosition(this.drawingAreaContainer);
		this.drawingAreaGraphics.moveTo(mousePos.x, mousePos.y);
	},
	onDrawingAreaContainerMouseMove: function(eventData) {
		let mousePos = eventData.data.getLocalPosition(this.drawingAreaContainer);
		if (this.isMouseDown(1)) {
			console.log(this.mouseDown);
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

// CEdit.Layer
CEdit.Layer = function(name,visible) {
	let methodName = "CEdit.Layer()";
	console.log(">>> %s", methodName);
	this.classname = "CEdit.Layer";
	this.name = name;
	this.visible = (visible != null) ? visible : true;
	console.log("<<< %s", methodName);
};

CEdit.Layer.prototype = {
	constructor: CEdit.Layer,
	remove: function(container) {
		if (this.eyeSprite != null ) {
			container.removeChild(this.eyeSprite);
		}

		if ( this.text != null ) {
			container.removeChild(this.text);
		}
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
CEdit.Icons.EYE_CLOSED = "CEdit.Icons.EYE_CLOSED";
CEdit.Icons.EYE_CLOSED_URI = CEdit.Icons.DIRECTORY + "/icon-eye-closed.png";


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
				add(CEdit.Icons.EYE_CLOSED, CEdit.Icons.EYE_CLOSED_URI).
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
	makeEyeSprite: function(cedit, layerIndex) {

		let textureName = CEdit.Icons.EYE;
		if ( ! cedit.layers[layerIndex].visible ) {
			textureName = CEdit.Icons.EYE_CLOSED;
		}
		let spr = new PIXI.Sprite(
			PIXI.loader.resources[textureName].texture);
		let toolx = 0;
		let tooly = layerIndex;

		spr.x = ONE_QUARTER_INCH + (EYE_ICON_WIDTH * toolx); // icon width * position
		spr.y = (EYE_ICON_HEIGHT * tooly); // half an inch

		spr.width = spr.width * (DPI / DPI_720p);
		spr.height = spr.height * (DPI / DPI_720p);

		spr.interactive = true;

		let inst = this;
		spr.on("mousedown", function () { 
			console.log("CLICKED THE EYEBALL: " + layerIndex);
			cedit.layers[layerIndex].visible = ! cedit.layers[layerIndex].visible;
			let tname = CEdit.Icons.EYE_CLOSED;
			if (cedit.layers[layerIndex].visible) {
				tname = CEdit.Icons.EYE;
			}
			spr.texture = PIXI.loader.resources[tname].texture;
		});
	

		return spr;
	},
	addLayerBoxIcons: function(layerBoxContainer, cedit) {
		let methodName = "CEdit.Icons.addLayerBoxIcons(layerBoxContainer)";
		console.log(">>> %s", methodName);

		let eyeY = 0;
		for (let layerIndex = 0; layerIndex < cedit.layers.length; layerIndex++) {
			if ( eyeY < LAYER_BOX_HEIGHT ) {
				let eye = this.makeEyeSprite(cedit, layerIndex);
				layerBoxContainer.addChild(eye);
				cedit.layers[layerIndex].eyeSprite = eye;
			}
			eyeY += EYE_ICON_HEIGHT;
		}

		console.log("<<< %s", methodName);
	}
};
