// ---------------------------------------
// Test program for LED display functions.
// Josh Hays - 9/2012

function PixelWave(options) 
{
    
    var config = _.defaults(options, 
    {
        fps: 10,
        canvasContainer: '#displayContainer',
        canvasSize: 600,
        pixelCount: Math.floor(Math.random() * 21) + 4,
        pixelSize: Math.floor(Math.random() < 0.8 ? Math.random() * 30 + 10 : Math.random() * 50 + 40),
        lineWidth: Math.floor(Math.random() < 0.8 ? Math.random() * 6 + 1 : Math.random() * 50 + 10),
    });

    var state = 
    {
        intervalId: 0,
        tick: 0,
        lastTickTime: 0,
        currentTickTime: 0,

        get time() { return this.tick / config.fps },
        get actualFps() { return 1000 / (this.currentTickTime - this.lastTickTime) }
    };

    var displays = 
    {
        fill: null,
        stroke: null
    };

    // var colorFuncs = [ sineBrightness, randomBrightness ];
    // var colorFunc = randomElement(colorFuncs);

    init();

    
    // --------------
    // Initialization

    function init() 
    {
        initState();
        createCanvas();
    }

    function initState() 
    {
        // build display buffer arrays

        _.each(displays, function(display, name) 
        {
            displays[name] = new CanvasDisplay({ 
                width: config.pixelCount, 
                height: config.pixelCount,
                canvasSize: config.canvasSize,
                pixelSize: config.pixelSize * config.canvasSize / (config.pixelCount * 2) - 1,
                lineWidth: config.lineWidth,
                drawType: name
            });
        });
    }

    function createCanvas() 
    {
        $container = $("<div/>").
            css("position", "relative").
            css("width", config.canvasSize).
            css("height", config.canvasSize).
            appendTo($(config.canvasContainer));

        _.each(displays, function(display, name) 
        {
            if (display instanceof CanvasDisplay) 
            {
                var canvas = $("<canvas/>").
                    attr("id", "displayCanvas-" + name).
                    attr("width", config.canvasSize).
                    attr("height", config.canvasSize).
                    css("position", "absolute").
                    /*css("left", "10px").
                    css("top", "10px").*/
                    appendTo($container).
                    get(0);

                if (canvas.getContext)
                {
                    display.ctx = canvas.getContext("2d");
                }
            }
        });
    }


    // ------------
    // Time control

    function start()
    {
        var delay = 1000 / config.fps;
        state.intervalId = setInterval(step, delay);
    }

    function stop()
    {
        clearInterval(state.intervalId);
    }

    function reset()
    {
        state.tick = 0;
    }

    function step()
    {
        state.tick += 1;
        state.lastTickTime = state.currentTickTime;
        state.currentTickTime = new Date().getTime()

        renderFrame();
    }


    // --------------
    // Main rendering

    function renderFrame()
    {


        rainbow(displays.fill, { saturation: 0.9, value: 0.9 });
        rainbow(displays.stroke, { offset: 40 });

        effect(displays.fill, flicker, { chance: 0.05 });
        effect(displays.stroke, glitter, { chance: 0.1 });

        effect(displays.fill, vignette, { brightness: Math.sin(state.time * 1.05) - 1.5, radius: 0.25 });
        effect(displays.stroke, vignette, { brightness: Math.cos(state.time * 2.3) });

        _.each(displays, function(display) {
            display.drawAllPixels();
        });
    }


    // -----------------------------------
    // Drawing / color placement functions

    function purpleCircleShuffle(display, options) 
    {
        var brightFunc = sineBrightness;
        var bright = brightFunc(state.tick);
        var factor = 255.0 / config.pixelCount;

        for (var x = 0; x < config.pixelCount; x++) 
        {
            for (var y = 0; y < config.pixelCount; y++) 
            {
                  var sr = Math.floor(255 - (255 * bright));
                  var sg = Math.floor(255 - factor * x * bright);
                  var sb = Math.floor(255 - factor * y * bright);

                  displays.stroke.setPixel(x, y, MakeColor.fromRGB(sr, sg, sb));

                  var fr = Math.floor(255 - factor * x * bright);
                  var fg = Math.floor(255 - (255 * bright));
                  var fb = Math.floor(255 - factor * y * bright);

                  displays.fill.setPixel(x, y, MakeColor.fromRGB(fr, fg, fb));
            }
        }
    }

    function rainbow(display, options) 
    {
        var defaultOptions = { 
            speed: 60, // hue-degrees per second
            xFactor: -12, 
            yFactor: -20,
            random: 0,
            offset: 0,
            saturation: 1,
            value: 1
        };

        var o = options ? _.defaults(options, defaultOptions) : defaultOptions;

        for (var x = 0; x < config.pixelCount; x++) 
        {
            for (var y = 0; y < config.pixelCount; y++) 
            {
                var hue =  
                    state.time * o.speed + 
                    x * o.xFactor + 
                    y * o.yFactor +
                    Math.random() * o.random;

                //setPixel('stroke', x, y, MakeColor.fromHSV(hue + o.strokeOffset, 1, 1));
                //displays.stroke.setPixel(x, y, MakeColor.fromHSV(hue + o.strokeOffset, 1, 1));
                //setPixel('fill', x, y, MakeColor.fromHSV(hue, .9, .9));
                //displays.fill.setPixel(x, y, MakeColor.fromHSV(hue, .9, .9));

                display.setPixel(x, y, MakeColor.fromHSV(hue + o.offset, o.saturation, o.value));
            }
        }
    }

    function solid(display, options)
    {
        var color = (options && options.color) ? options.color : Colors.red;
        display.setAllPixels(color);
        display.setAllPixels(color);
    }
    

    // ----------------
    // Effect functions

    function effect(display, effect, options)
    {
        if (!display instanceof Display) return;
        if (!_.isFunction(effect)) return;

        display.eachPixel(function(x, y, color) {
            display.setPixel(x, y, effect(color, { x: x, y: y }, options));
        })
    }

    function vignette(color, position, options) 
    {
        var defaultOptions = {
            brightness: -1,
            radius: 0
        }

        var o = options ? _.defaults(options, defaultOptions) : defaultOptions;
        var x = (config.pixelCount / 2.0 - position.x) / config.pixelCount;
        var y = (config.pixelCount  / 2.0 - position.y) / config.pixelCount;

        var radius = Math.sqrt(x * x + y * y);
        var brightness = o.brightness * Math.max(radius - o.radius, 0);

        return color.setHSV(color.hue, color.saturation, color.value + brightness);

    }

    function sparkle(color, position, options) 
    {
        var defaultOptions = { 
            chance: 0.05,
            hueChange: 0,
            saturationChange: 0.1,
            valueChange: 0.2
        };

        var o = options ? _.defaults(options, defaultOptions) : defaultOptions;
        
        return Math.random() > o.chance ? 
            color : 
            color.setHSV(color.hue + o.hueChange, 
                         color.saturation + o.saturationChange, 
                         color.value + o.valueChange);
    }

    function flicker(color, position, options)
    {
        var chance = options && options.chance != null ? options.chance : 0.1;
        return sparkle(color, position, { chance: chance, saturationChange: -0.1, valueChange: -0.2 })
    }

    function glitter(color, position, options)
    {
        var chance = options && options.chance != null ? options.chance : 0.1;
        return sparkle(color, position, { chance: chance, saturationChange: -0.5, valueChange: 0.8 })
    }

    function sineBrightness(tick) 
    {
        var rate = config.fps / 2;
        var bright = .8 - (Math.sin(tick / rate) * 0.2);
        return bright;
    }

    // function randomBrightness(tick) 
    // {
    //     var bright = Math.max(0.7, Math.random())
    //     return bright;
    // }


    // ---------
    // Utilities

    function randomElement(array) 
    {
        return array[Math.floor(Math.random() * array.length)]
    }


    // ----------------
    // Public interface

    return {
        start: start,
        stop: stop,
        reset: reset
    }

}
