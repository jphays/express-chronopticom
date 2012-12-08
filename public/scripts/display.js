// Display object for pixel rendering

function Display(options)
{

    this.width = options ? options.width || 1 : 1;
    this.height = options ? options.height || 1 : 1;

    this.buffer = new Array(this.height);

    for (var row = 0; row < this.height; row++)
    {
        this.buffer[row] = new Array(this.width);

        for (var col = 0; col < this.width; col++)
        {
            this.buffer[row][col] = MakeColor.from(Colors.black);
        }
    }

}

Display.prototype.eachPixel = function(func)
{
    for (var y = 0; y < this.height; y++)
    {
        for (var x = 0; x < this.width; x++)
        {
            func(x, y, this.buffer[y][x]);
        }
    }
}

Display.prototype.setPixel = function(x, y, color)
{
    if (x < 0 || x >= this.width || 
        y < 0 || y >= this.height) return;

    if (!color instanceof Color) return;

    this.buffer[y][x] = color;
}

Display.prototype.setAllPixels = function(color)
{
    for (var y = 0; y < this.height; y++) 
    {
        for (var x = 0; x < this.width; x++)
        {
            this.setPixel(x, y, MakeColor.from(color));
        }
    }
}

Display.prototype.drawPixel = function(x, y)
{
    console.log("Drawing pixel at (" + x + ", " + y + "): " + this.buffer[y][x].toString());
}

Display.prototype.drawAllPixels = function() 
{
    for (var y = 0; y < this.height; y++)
    {
        for (var x = 0; x < this.width; x++) 
        {
            this.drawPixel(x, y);
        }
    }
}


// Display for rendering pixels on an HTML canvas

CanvasDisplay.prototype = new Display();
CanvasDisplay.prototype.constructor = CanvasDisplay;
CanvasDisplay.prototype.parent = Display.prototype;

CanvasDisplay.prototype.drawPixel = function(x, y)
{
    var offsetX = this.canvasSize / this.width;
    var offsetY = this.canvasSize / this.height;
    var position = { 
        x: (offsetX / 2) + x * offsetX, 
        y: (offsetY / 2) + y * offsetY };
    var radius = this.pixelSize;

    var color = this.buffer[y][x];

    // probably doesn't need to be here.  another step for applying an effects chain?
    //if (typeof drawFunc == 'function') 
    //{
    //    color = drawFunc(color, { display: display, x: x, y: y }, options);
    //}

    switch (this.drawType) {
        case 'stroke':
            this.ctx.beginPath();
            this.ctx.arc(position.x, position.y, radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = color.getHexString();
            this.ctx.stroke();
            break;
        case 'fill':
            this.ctx.beginPath();
            this.ctx.arc(position.x, position.y, radius, 0, Math.PI * 2);
            this.ctx.fillStyle = color.getHexString();
            this.ctx.fill();
            break;
    }
}

CanvasDisplay.prototype.drawAllPixels = function() 
{
    this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);
    this.ctx.lineWidth = this.lineWidth;

    this.parent.drawAllPixels.call(this);
}

function CanvasDisplay(options)
{
    this.ctx = options.ctx;
    this.canvasSize = options.canvasSize || 600;
    this.pixelSize = options.pixelSize || 60;
    this.lineWidth = options.lineWidth || 5;
    this.drawType = options.drawType || 'fill';

    if (_.isFunction(options.drawPixel)) this.drawPixel = options.drawPixel;

    this.parent.constructor.call(this, options);
}


// Display for rendering pixels on a set of LEDs

LEDDisplay.prototype = new Display();
LEDDisplay.prototype.constructor = LEDDisplay;
LEDDisplay.prototype.parent = Display.prototype;

function LEDDisplay(options)
{
    this.parent.constructor.call(this, options);
}

LEDDisplay.prototype.drawPixel = function(x, y) 
{

};
