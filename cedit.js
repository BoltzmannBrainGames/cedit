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

const STAGE_BORDER_THICKNESS = 2;

const BORDERED_STAGE_WIDTH = ONE_INCH * 10;
const BORDERED_STAGE_HEIGHT = ONE_INCH * 6;
const DRAWING_AREA_WIDTH = 5 * ONE_INCH;
const DRAWING_AREA_HEIGHT = 5 * ONE_INCH;
const SCROLLBAR_THICKNESS = ONE_QUARTER_INCH;


const LAYER_BOX_ROW_THICKNESS = ONE_SIXTH_INCH;

const EYE_ICON_WIDTH = LAYER_BOX_ROW_THICKNESS;
const EYE_ICON_HEIGHT = EYE_ICON_WIDTH;
const	UP_ARROW_SMALL_ICON_WIDTH = LAYER_BOX_ROW_THICKNESS;
const	UP_ARROW_SMALL_ICON_HEIGHT = UP_ARROW_SMALL_ICON_WIDTH;
const	DOWN_ARROW_SMALL_ICON_WIDTH = LAYER_BOX_ROW_THICKNESS;
const	DOWN_ARROW_SMALL_ICON_HEIGHT = DOWN_ARROW_SMALL_ICON_WIDTH;


const LAYER_BOX_WIDTH = ONE_INCH + ONE_HALF_INCH;
const LAYER_BOX_HEIGHT = 3 * ONE_INCH;

const LAYER_BOX_TEXT_WIDTH = LAYER_BOX_WIDTH - SCROLLBAR_THICKNESS - EYE_ICON_WIDTH - UP_ARROW_SMALL_ICON_WIDTH - DOWN_ARROW_SMALL_ICON_WIDTH;


function CEdit() {
	this.className = "CEdit";
	let methodName = this.classname + "()";
	console.log(">>> %s", methodName);
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
	//this.layers.push(new CEdit.Layer("Layer19", true));
	//this.layers.push(new CEdit.Layer("Layer20", true));

	this.layerbox = new CEdit.Layerbox(this, this.borderedStage);


	this.toolbox = new CEdit.Toolbox(this.borderedStage);


	// Tell tbhe 'renderer' to 'render' the 'stage'
	this.renderer.render(this.stage);

	console.log("<<< %s", methodName);
}

CEdit.prototype = {
	constructor: CEdit,
	setup: function() {
		let methodName = this.className + ".setup()";
		console.log(">>> %s", methodName);
		let inst = this;
		console.log("<<< %s", methodName);
		return new Promise(function(resolve, reject) {
			if (inst) {
				let ceditInst = inst;
				inst.icons = new CEdit.Icons();
				inst.icons.load().then(function(icons){
					inst.toolbox.addToolboxIcons(inst);
					inst.layerbox.addLayerBoxIcons(inst);
					// Shit is this better than a goto?
					resolve(ceditInst);
				}).catch(function(error) {
					reject(error);
				});
			} else {
				reject(new Error("Could not CEdit.setup()"));
			}
		});
	},
	run: function() {
		let methodName = this.className + ".run()";
		console.log(">>> %s", methodName);
		this.gameLoop();
		console.log("<<< %s", methodName);
	},
	gameLoop: function() {
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
	this.className = "CEdit.Layer";
	let methodName = this.className + "(name,visible)";
	console.log(">>> %s", methodName);
	this.name = name;
	this.visible = (visible != null) ? visible : true;
	console.log("<<< %s", methodName);
};

CEdit.Layer.prototype = {
	constructor: CEdit.Layer,
	remove: function(container) {
		let methodName = this.className + ".remove(container)";
		console.log(">>> %s", methodName);

		if ( this.text != null ) {
			container.removeChild(this.text);
			this.text.destroy();
		}
		if (this.eyeSprite != null ) {
			container.removeChild(this.eyeSprite);
			this.eyeSprite.destroy();
		}
		if (this.upArrowSmallSprite != null ) {
			container.removeChild(this.upArrowSmallSprite);
			this.upArrowSmallSprite.destroy();
		}
		if (this.downArrowSmallSprite != null ) {
			container.removeChild(this.downArrowSmallSprite);
			this.downArrowSmallSprite.destroy();
		}
	}
};

// CEdit.Layerbox

CEdit.Layerbox = function(cedit, parentContainer) {
	this.className = "CEdit.Layerbox";
	let methodName = this.className + "(cedit,parentContainer)";

	console.log(">>> %s", methodName);

	this.container = new PIXI.Container();
	this.container.x = DRAWING_AREA_WIDTH + SCROLLBAR_THICKNESS;
	this.container.y = 0;
	let layerBoxRect = new PIXI.Rectangle(
		0, 0,
		SCROLLBAR_THICKNESS + LAYER_BOX_WIDTH, LAYER_BOX_HEIGHT);
	this.makeLayerBox(cedit, layerBoxRect);
	parentContainer.addChild(this.container);

	console.log("<<< %s", methodName)
};

CEdit.Layerbox.prototype = {
	constructor: CEdit.Layerbox,
	makeLayerBox: function(cedit, layerBoxRect) {
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
		this.container.addChild(g);
		this.makeLayerBoxSlider(layerBoxRect.height);
		this.makeLayerBoxTexts(cedit);
	},
	makeLayerBoxSlider: function(height) {
		let g = new PIXI.Graphics();
		let inst = this;
		let width = ONE_QUARTER_INCH;
		let borderColor = 0x000000;
		let bgColor = 0xd0d0d0;	
		g.lineStyle(1,borderColor);
		g.beginFill(bgColor);
		g.drawRect(0,0, width,height);
		g.endFill();
		this.container.addChild(g);
	},
	makeLayerBoxTexts: function(cedit) {
		let rows = LAYER_BOX_HEIGHT / LAYER_BOX_ROW_THICKNESS;
		
		let borderSize = 1;
		for (let r = 0; r < rows; r++) {
			if (r < cedit.layers.length) {
				let text = this.makeLayerBoxText(cedit, r);
				cedit.layers[r].text = text;
				this.container.addChild(text);
			}
		}
	},
	makeLayerBoxText: function(cedit,layerIndex) {
		let inst = this;

		if (layerIndex >= cedit.layers.length ) {
			console.log("Called makeLayerBoxText for layerIndex out of bounds: " + layerIndex );
			return null;
		}
		let style = {
			fontFamily: "Arial",
			fontSize: "9px",
			wordWrap: false,
			stroke: "#000000"
		};

		let text = new PIXI.Text(cedit.layers[layerIndex].name, style);
		text._extraFields = {};
		text._extraFields.layerIndex = layerIndex;

		text.x = LAYER_BOX_WIDTH - LAYER_BOX_TEXT_WIDTH;
		text.y = layerIndex * LAYER_BOX_ROW_THICKNESS + (LAYER_BOX_ROW_THICKNESS / 2);

		text.anchor = new  PIXI.Point(0,0.5);
		text.interactive = true;
		text.hitArea = new PIXI.Rectangle(0,-0.5 * LAYER_BOX_ROW_THICKNESS,LAYER_BOX_TEXT_WIDTH, LAYER_BOX_ROW_THICKNESS);
		text.on("mousedown", function(e) {
			let thisText = text;
			let li = thisText._extraFields.layerIndex;	
			console.log("li = " + li);
			let oldName = cedit.layers[li].name;
			console.log(thisText._text);
			console.log(li);
			console.log(cedit.layers[li].text._text);
			console.log(cedit.layers[li].name);
			let newName = window.prompt("Enter new layer name", oldName); 
			e.stopPropagation();

			if (newName == null) {
				console.log("User canceled: not changing text");
			} else if (newName == "") {
				let answer = window.confirm("Are you sure you want to delete the layer named " + oldName + "?" );
				if (answer == true) {
					console.log("Deleting layer " + li);
					cedit.layers[li].remove(inst.container);
					cedit.layers.splice(li,1); // delete from array and reindex
					for (let i = li; i < cedit.layers.length; i++) {
						if ( i * LAYER_BOX_ROW_THICKNESS < LAYER_BOX_HEIGHT ) {
							console.log("My index is: " + i);
							if (cedit.layers[i] != null ) {
								console.log("cedit.layers[" + i + "] was not null");
								console.log("cedit.layers[" + i + "].name = " + cedit.layers[i].name);
								if (cedit.layers[i].text != null ) {
									console.log("cedit.layers[" + i + "].text._text = " + cedit.layers[i].text._text);
									cedit.layers[i].text.y -= LAYER_BOX_ROW_THICKNESS;
									cedit.layers[i].text._extraFields.layerIndex = i;
								} else {
									let text = inst.makeLayerBoxText(cedit,i);
									cedit.layers[i].text = text;
									console.log("Newly created cedit.layers[" + i + "].text._text = " + cedit.layers[i].text._text);
									inst.container.addChild(text);
								}

								if (cedit.layers[i].eyeSprite != null ) {
									cedit.layers[i].eyeSprite.y -= LAYER_BOX_ROW_THICKNESS;
								} else {
									let eyeSprite = inst.makeEyeSprite(cedit,i);
									cedit.layers[i].eyeSprite = eyeSprite;
									inst.container.addChild(eyeSprite);
								}

								if (cedit.layers[i].upArrowSmallSprite != null ) {
									cedit.layers[i].upArrowSmallSprite.y -= LAYER_BOX_ROW_THICKNESS;
								} else {
									let upArrowSmallSprite =  inst.makeUpArrowSmallSprite(cedit,i);
									cedit.layers[i].upArrowSmallSprite = upArrowSmallSprite;
									inst.container.addChild(upArrowSmallSprite);
								}
							} else {
								console.log("cedit.layers[" + i + "] was null");
							}

							if (cedit.layers[i].downArrowSmallSprite != null ) {
								cedit.layers[i].downArrowSmallSprite.y -= LAYER_BOX_ROW_THICKNESS;
								cedit.layers[i].downArrowSmallSprite._extraFields.layerIndex = i;
							} else {
								let downArrowSmallSprite =  inst.makeDownArrowSmallSprite(cedit,i);
								cedit.layers[i].downArrowSmallSprite = downArrowSmallSprite;
								inst.container.addChild(downArrowSmallSprite);
							}
						}
					} 
				}
			} else {
				cedit.layers[li].name = newName;	
				text.text = cedit.layers[li].name;
			}
		});

		return text;
	},
	makeEyeSprite: function(cedit, layerIndex) {
		let textureName = CEdit.Icons.EYE;
		if (!cedit.layers[layerIndex].visible ) {
			textureName = CEdit.Icons.EYE_CLOSED;
		}
		let spr = new PIXI.Sprite( cedit.icons.getIconTexture(textureName) );
		let toolx = 0;
		let tooly = layerIndex;

		spr.x = ONE_QUARTER_INCH + (EYE_ICON_WIDTH * toolx); // icon width * position
		spr.y = (EYE_ICON_HEIGHT * tooly); // half an inch

		spr.width = spr.width * (DPI / DPI_720p);
		spr.height = spr.height * (DPI / DPI_720p);

		spr.interactive = true;

		spr._extraFields = {};
		spr._extraFields.layerIndex = layerIndex;

		let inst = this;
		spr.on("mousedown", function () { 
			let li = spr._extraFields.layerIndex;
			console.log("CLICKED THE eyeSprite: " + cedit.layers[li].name + " idx: " + li);
			cedit.layers[li].visible = ! cedit.layers[li].visible;
			let tname = CEdit.Icons.EYE_CLOSED;
			if (cedit.layers[li].visible) {
				tname = CEdit.Icons.EYE;
			}
			spr.texture = cedit.icons.getIconTexture(tname);
		});
	

		return spr;
	},
	makeUpArrowSmallSprite: function(cedit, layerIndex) {
		let textureName = CEdit.Icons.UP_ARROW_SMALL;
		let spr = new PIXI.Sprite( cedit.icons.getIconTexture(textureName) );
		let toolx = 1;
		let tooly = layerIndex;

		spr.x = ONE_QUARTER_INCH + (UP_ARROW_SMALL_ICON_WIDTH * toolx); // icon width * position
		spr.y = (UP_ARROW_SMALL_ICON_HEIGHT * tooly); // half an inch

		spr.width = spr.width * (DPI / DPI_720p);
		spr.height = spr.height * (DPI / DPI_720p);

		spr.interactive = true;

		spr._extraFields = {};
		spr._extraFields.layerIndex = layerIndex;

		let inst = this;

		spr.on("mousedown", function () { 
			let li = spr._extraFields.layerIndex;
			console.log("li = " + li );
			console.log("CLICKED THE upArrowSmallSprite: " + cedit.layers[li].name + " idx: " + li);
			if (li <= 0) { 
				console.log("li = " + li + " is <= " + 0 );
				return;
			}

			let temp = null;
			let newRow = li - 1;
			if (0 <= newRow ) {
				temp = cedit.layers[newRow];
				cedit.layers[newRow] = cedit.layers[li];
			}
			console.log("newRow = " + newRow + " cedit.layers.length = " + cedit.layers.length );
			let newRowPos = newRow * LAYER_BOX_ROW_THICKNESS;
			let offTheEnd = false;
			if (newRowPos < 0) {
				offTheEnd = true;
				console.log("Off the end: " + newRowPos + " < " + 0 );
				if ( cedit.layers[li].text != null ) {
					inst.container.removeChild(cedit.layers[li].text);
					console.log("GOT HERE :" + li);
					console.log(cedit.layers[li].text);
					delete cedit.layers[li].text;
				}
				if ( cedit.layers[li].eyeSprite != null ) {
					inst.container.removeChild(cedit.layers[li].eyeSprite);
					cedit.layers[li].eyeSprite.destroy();
					delete cedit.layers[li].eyeSprite;
				}

				if ( cedit.layers[li].upArrowSmallSprite != null ) {
					inst.container.removeChild(cedit.layers[li].upArrowSmallSprite);
					cedit.layers[li].upArrowSmallSprite.destroy();
					delete cedit.layers[li].upArrowSmallSprite;
				}
			
				if ( cedit.layers[li].downArrowSmallSprite != null ) {
					inst.container.removeChild(cedit.layers[li].downArrowSmallSprite);
					cedit.layers[li].downArrowSmallSprite.destroy();
					delete cedit.layers[li].downArrowSmallSprite;
				}
			} else {
				console.log("Not off the end: " + newRowPos + " >= " + 0 );
				offTheEnd = false;
				if (newRow >= 0) {
					cedit.layers[li].text._extraFields.layerIndex -= 1;
					cedit.layers[li].eyeSprite._extraFields.layerIndex -= 1;
					cedit.layers[li].upArrowSmallSprite._extraFields.layerIndex -= 1;
					cedit.layers[li].downArrowSmallSprite._extraFields.layerIndex -= 1;
					cedit.layers[li].text.y -= LAYER_BOX_ROW_THICKNESS;
					console.log("FYI text.y = %d", cedit.layers[li].text.y);
					console.log("FYI eyeSprite.y = %d", cedit.layers[li].eyeSprite.y);
					cedit.layers[li].eyeSprite.y -= LAYER_BOX_ROW_THICKNESS;
					cedit.layers[li].upArrowSmallSprite.y -= LAYER_BOX_ROW_THICKNESS;
					cedit.layers[li].downArrowSmallSprite.y -= LAYER_BOX_ROW_THICKNESS;
				}
			}	
	
			if (temp != undefined && temp != null) {
				cedit.layers[li] = temp;
				if ( temp.text != undefined && temp.text != null ) {
					console.log("temp.text != null");
					temp.text._extraFields.layerIndex += 1;	
					temp.eyeSprite._extraFields.layerIndex += 1;	
					temp.upArrowSmallSprite._extraFields.layerIndex += 1;	
					temp.downArrowSmallSprite._extraFields.layerIndex += 1;	
					temp.text.y += LAYER_BOX_ROW_THICKNESS;
					temp.eyeSprite.y += LAYER_BOX_ROW_THICKNESS;
					temp.upArrowSmallSprite.y += LAYER_BOX_ROW_THICKNESS;
					temp.downArrowSmallSprite.y += LAYER_BOX_ROW_THICKNESS;
				} else {
					cedit.layers[li] = temp;
					console.log("! temp.text != null");
					let text = inst.makeLayerBoxText(cedit, li);
					temp.text = text;
					console.log("Text of text = " + temp.text._text);
					console.log("Layer index of text = " + li);
					inst.container.addChild(text);
				
					let eyeSprite =  inst.makeEyeSprite(cedit, li);
					temp.eyeSprite = eyeSprite;
					inst.container.addChild(eyeSprite);

					let upArrowSmallSprite =  
						inst.makeUpArrowSmallSprite(cedit, li);
					temp.upArrowSmallSprite = upArrowSmallSprite;
					inst.container.addChild(upArrowSmallSprite);

					let downArrowSmallSprite =  
						inst.makeDownArrowSmallSprite(cedit, li);
					temp.downArrowSmallSprite = downArrowSmallSprite;
					inst.container.addChild(downArrowSmallSprite);
				}
			} else {
				console.log("Temp was undefined.  temp was = cedit.layers[" + newRow + "]");
			}
			console.log("Layer[" + li + "]'s text = " + cedit.layers[li].text._text);
		});
	
		return spr;
	},
	makeDownArrowSmallSprite: function(cedit, layerIndex) {

		let textureName = CEdit.Icons.DOWN_ARROW_SMALL;
		let spr = new PIXI.Sprite(cedit.icons.getIconTexture(textureName));
		let toolx = 2;
		let tooly = layerIndex;

		spr.x = ONE_QUARTER_INCH + (DOWN_ARROW_SMALL_ICON_WIDTH * toolx); // icon width * position
		spr.y = (DOWN_ARROW_SMALL_ICON_HEIGHT * tooly); // half an inch

		spr.width = spr.width * (DPI / DPI_720p);
		spr.height = spr.height * (DPI / DPI_720p);

		spr.interactive = true;

		spr._extraFields = {};
		spr._extraFields.layerIndex = layerIndex;

		let inst = this;

		spr.on("mousedown", function () { 
			let li = spr._extraFields.layerIndex;
			console.log("li = " + li );
			console.log("CLICKED THE downArrowSmallSprite: " + cedit.layers[li].name + " idx: " + li);
			if (li >= cedit.layers.length) { 
				console.log("li = " + li + " is past cedit.layers.length = " + cedit.layers.length );
				return;
			}

			let temp = null;
			let newRow = li + 1;
			if (cedit.layers.length > newRow ) {
				temp = cedit.layers[newRow];
				cedit.layers[newRow] = cedit.layers[li];
			}
			console.log("newRow = " + newRow + " cedit.layers.length = " + cedit.layers.length );
			let newRowPos = newRow * LAYER_BOX_ROW_THICKNESS + LAYER_BOX_ROW_THICKNESS;
			let offTheEnd = false;
			if (newRowPos > LAYER_BOX_HEIGHT ) {
				offTheEnd = true;
				console.log("Off the end: " + newRowPos + " > " + LAYER_BOX_HEIGHT );
				if ( cedit.layers[li].text != null ) {
					inst.container.removeChild(cedit.layers[li].text);
					console.log("GOT HERE :" + li);
					console.log(cedit.layers[li].text);
					delete cedit.layers[li].text;
				}
				if ( cedit.layers[li].eyeSprite != null ) {
					console.log("GOT HERE2 :" + li + " cedit.layers[" + li + "].eyeSprite._extraFields.layerIndex = " + cedit.layers[li].eyeSprite._extraFields.layerIndex);
					inst.container.removeChild(cedit.layers[li].eyeSprite);
					cedit.layers[li].eyeSprite.destroy();
					delete cedit.layers[li].eyeSprite;
				}

				if ( cedit.layers[li].upArrowSmallSprite != null ) {
					console.log("GOT HERE3 :" + li);
					inst.container.removeChild(cedit.layers[li].upArrowSmallSprite);
					cedit.layers[li].upArrowSmallSprite.destroy();
					delete cedit.layers[li].upArrowSmallSprite;
				}
			
				if ( cedit.layers[li].downArrowSmallSprite != null ) {
					console.log("GOT HERE4 :" + li);
					inst.container.removeChild(cedit.layers[li].downArrowSmallSprite);
					cedit.layers[li].downArrowSmallSprite.destroy();
					delete cedit.layers[li].downArrowSmallSprite;
				}
			} else {
				console.log("Not off the end: " + newRowPos + " <= " + LAYER_BOX_HEIGHT );
				offTheEnd = false;
				if (newRow < cedit.layers.length) {
					cedit.layers[li].text._extraFields.layerIndex += 1;
					cedit.layers[li].eyeSprite._extraFields.layerIndex += 1;
					cedit.layers[li].upArrowSmallSprite._extraFields.layerIndex += 1;
					cedit.layers[li].downArrowSmallSprite._extraFields.layerIndex += 1;
					cedit.layers[li].text.y += LAYER_BOX_ROW_THICKNESS;
					cedit.layers[li].eyeSprite.y += LAYER_BOX_ROW_THICKNESS;
					cedit.layers[li].upArrowSmallSprite.y += LAYER_BOX_ROW_THICKNESS;
					cedit.layers[li].downArrowSmallSprite.y += LAYER_BOX_ROW_THICKNESS;
				}
			}	
	
			if (temp != undefined && temp != null) {
				cedit.layers[li] = temp;
				if ( temp.text != undefined && temp.text != null ) {
					console.log("temp.text != null");
					temp.text._extraFields.layerIndex -= 1;	
					temp.eyeSprite._extraFields.layerIndex -= 1;	
					temp.upArrowSmallSprite._extraFields.layerIndex -= 1;	
					temp.downArrowSmallSprite._extraFields.layerIndex -= 1;	
					temp.text.y -= LAYER_BOX_ROW_THICKNESS;
					temp.eyeSprite.y -= LAYER_BOX_ROW_THICKNESS;
					temp.upArrowSmallSprite.y -= LAYER_BOX_ROW_THICKNESS;
					temp.downArrowSmallSprite.y -= LAYER_BOX_ROW_THICKNESS;
				} else {
					cedit.layers[li] = temp;
					console.log("! temp.text != null");
					let text = inst.makeLayerBoxText(cedit, li);
					temp.text = text;
					console.log("Text of text = " + temp.text._text);
					console.log("Layer index of text = " + li);
					inst.container.addChild(text);
				
					let eyeSprite =  inst.makeEyeSprite(cedit, li);
					temp.eyeSprite = eyeSprite;
					inst.container.addChild(eyeSprite);

					let upArrowSmallSprite =  
						inst.makeUpArrowSmallSprite(cedit, li);
					temp.upArrowSmallSprite = upArrowSmallSprite;
					inst.container.addChild(upArrowSmallSprite);

					let downArrowSmallSprite =  
						inst.makeDownArrowSmallSprite(cedit, li);
					temp.downArrowSmallSprite = downArrowSmallSprite;
					inst.container.addChild(downArrowSmallSprite);
				}
			} else {
				console.log("Temp was undefined.  temp was = cedit.layers[" + newRow + "]");
			}
			console.log("Layer[" + li + "]'s text = " + cedit.layers[li].text._text);
		});
	

		return spr;
	},
	addLayerBoxIcons: function(cedit) {
		let methodName = this.className + ".addLayerBoxIcons(layerBoxContainer)";
		console.log(">>> %s", methodName);

		let y = 0;
		for (let layerIndex = 0; layerIndex < cedit.layers.length; layerIndex++) {
			if ( y < LAYER_BOX_HEIGHT ) {
				let eye = this.makeEyeSprite(cedit, layerIndex);
				this.container.addChild(eye);
				cedit.layers[layerIndex].eyeSprite = eye;

				let upArrowSmall = this.makeUpArrowSmallSprite(cedit, layerIndex);
				this.container.addChild(upArrowSmall);
				cedit.layers[layerIndex].upArrowSmallSprite = upArrowSmall;

				let downArrowSmall = this.makeDownArrowSmallSprite(cedit, layerIndex);
				this.container.addChild(downArrowSmall);
				cedit.layers[layerIndex].downArrowSmallSprite = downArrowSmall;
			}
			y += LAYER_BOX_ROW_THICKNESS;
		}


		console.log("<<< %s", methodName);
	}
};



// CEdit.Toolbox


CEdit.Toolbox = function(parentContainer) {
	this.className = "CEdit.Toolbox";
	let methodName = this.className + "()";

	console.log(">>> %s", methodName);

	this.container = new PIXI.Container();
	this.container.x = DRAWING_AREA_WIDTH + 2 * SCROLLBAR_THICKNESS;
	this.container.y = 4 * ONE_INCH;
	parentContainer.addChild(this.container);

	console.log("<<< %s", methodName)
};

CEdit.Toolbox.PENCIL = "PENCIL";
CEdit.Toolbox.ERASER = "ERASER";
CEdit.Toolbox.HAND = "HAND";

CEdit.Toolbox.prototype = {
	constructor: CEdit.Toolbox,
	deselect: function() {
		let methodName = this.className + ".deselect()";
		console.log(">>> %s", methodName);
		if (this.selectedToolSprite != null) {
			this.selectedToolSprite.tint = 0xFFFFFF;
		}
		this.selectedTool = null;
		console.log("<<< %s", methodName);
	},
	makeHandSprite: function(cedit) {
    let methodName = this.className + ".makeHandSprite()";
		console.log(">>> %s", methodName);

		let texture = cedit.icons.getIconTexture(CEdit.Icons.HAND);
		let spr = new PIXI.Sprite(texture);
		let toolx = 0;
		let tooly = 1;

		spr.x = (ONE_HALF_INCH * toolx); // icon width * position
		spr.y = (ONE_HALF_INCH * tooly); // half an inch

		spr.width = spr.width * (DPI / DPI_720p);
		spr.height = spr.height * (DPI / DPI_720p);

		spr.interactive = true;

		let inst = this;
		spr.on("mousedown", function () { 
			inst.deselect();
			inst.selectedTool = CEdit.Toolbox.HAND;
			inst.selectedToolSprite = spr;
			spr.tint = 0x909090;
			console.log("Selected " + cedit.tool);
		});

		console.log("<<< %s", methodName);
		return spr;
	},
	makePencilSprite: function(cedit) {
    let methodName = this.className + ".makePencilSprite()";
		console.log(">>> %s", methodName);

		let texture = cedit.icons.getIconTexture(CEdit.Icons.PENCIL);
		let spr = new PIXI.Sprite(texture);
		let toolx = 1;
		let tooly = 1;

		spr.x = (ONE_HALF_INCH * toolx); // icon width * position
		spr.y = (ONE_HALF_INCH * tooly); // half an inch

		spr.width = spr.width * (DPI / DPI_720p);
		spr.height = spr.height * (DPI / DPI_720p);

		spr.interactive = true;

		let inst = this;
		spr.on("mousedown", function () { 
			inst.deselect();
			inst.selectedTool = CEdit.Toolbox.PENCIL;
			inst.selectedToolSprite = spr;
			spr.tint = 0x909090;
			console.log("Selected " + inst.tool);
		});


		console.log("<<< %s", methodName);
		return spr;
	},
	makeEraserSprite: function(cedit) {
    let methodName = this.className + ".makePencilSprite()";
		console.log(">>> %s", methodName);
		let texture = cedit.icons.getIconTexture(CEdit.Icons.ERASER);
		let spr = new PIXI.Sprite(texture);
		let toolx = 2;
		let tooly = 1;

		spr.x = (ONE_HALF_INCH * toolx); // icon width * position
		spr.y = (ONE_HALF_INCH * tooly); // half an inch

		spr.width = spr.width * (DPI / DPI_720p);
		spr.height = spr.height * (DPI / DPI_720p);

		spr.interactive = true;

		let inst = this;
		spr.on("mousedown", function () { 
			inst.deselect();
			inst.selectedTool = CEdit.Toolbox.ERASER;
			inst.selectedToolSprite = spr;
			spr.tint = 0x909090;
			console.log("Selected " + inst.tool);
		});

		console.log("<<< %s", methodName);
		return spr;
	},
	addToolboxIcons: function(cedit) {
		let methodName = this.className + ".addToolboxIcons(cedit)";
		console.log(">>> %s", methodName);

		let hand = this.makeHandSprite(cedit);
		this.container.addChild(hand);

		let pencil = this.makePencilSprite(cedit);
		this.container.addChild(pencil);

		let eraser = this.makeEraserSprite(cedit);
		this.container.addChild(eraser);
		console.log("<<< %s", methodName);
	}
};

// CEdit.Icons 
CEdit.Icons = function() {
	let methodName = "CEdit.Icons()";
	console.log(">>> %s", methodName);
	this.className = "CEdit.Icons";
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
CEdit.Icons.UP_ARROW_SMALL = "CEdit.Icons.UP_ARROW_SMALL";
CEdit.Icons.UP_ARROW_SMALL_URI = CEdit.Icons.DIRECTORY + "/up-arrow-small.png";
CEdit.Icons.DOWN_ARROW_SMALL = "CEdit.Icons.DOWN_ARROW_SMALL";
CEdit.Icons.DOWN_ARROW_SMALL_URI = CEdit.Icons.DIRECTORY + "/down-arrow-small.png";


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
				add(CEdit.Icons.UP_ARROW_SMALL, CEdit.Icons.UP_ARROW_SMALL_URI).
				add(CEdit.Icons.DOWN_ARROW_SMALL, CEdit.Icons.DOWN_ARROW_SMALL_URI).
				on("progress", CEdit.Icons.loadProgressHandler).
				load(function() {
					console.log("We are done loading");
					console.log(inst);
					resolve(inst);
				});
			});

	},
	getIconTexture: function(iconName) {
		return PIXI.loader.resources[iconName].texture;
	},
};
