function RenderCircles(options) {
    
    var fps = options.fps || 20;
    var canvasSize = options.canvasSize || 600;
    var circleCount = options.circleCount || Math.floor(Math.random() * 21) + 4;
    var circleGap = options.circleGap || Math.floor(Math.random() * 5) + 2;

    var ctx;
    var tick;
    var delay = 1000 / fps;

    init();

    function init() 
    {
        tick = 0;
        renderCanvas();
    }

    function renderCanvas() 
    {
        var canvas = $("canvas#display").get(0);

        if (canvas.getContext)
        {
            ctx = canvas.getContext("2d");
            ctx.lineWidth = 2;

            window.setInterval(function() {
                tick += 1;
                clear(ctx);
                drawCircleGrid(
                    ctx, 
                    stairwayGrid,
                    sineBrightness);
            }, delay);
        }

    }

    function clear(ctx) 
    {
        ctx.clearRect(0, 0, canvasSize, canvasSize);
    }

    // function scheduleRedraw(drawFunc) 
    // {
    //     if (drawFunc) drawFunc();
    //     tick += 1;
    //     window.setTimeout(function() { scheduleRedraw(drawFunc) }, delay);
    // }

    function randomBrightness(x, y, tick) 
    {
        var bright = Math.max(0.7, Math.random())
        return bright;
    }

    function sineBrightness(x, y, tick) 
    {
        var rate = fps / 2;
        var bright = .8 - (Math.sin(tick / rate) * 0.2);
        return bright;
    }

    function stairwayGrid(x, y, tick, rate) 
    {
        return ((x + 2) % (Math.floor(tick / rate) % (circleCount - 2)) == 0 || 
                (y + 3) % (Math.floor(tick / rate) % (circleCount + 3)) == 0)
    }

    function test(x, y, tick, rate) 
    {
        return (x == tick % 10 || y == tick % 10);
    }

    function drawCircleGrid(ctx, renderFunc, brightFunc) 
    {
        var size = canvasSize / circleCount;
        var circles = circleCount;
        var factor = 255.0 / circles;
        var rate = fps / 8;

        for (var i = 0; i < circles; i++) 
        {
            for (var j = 0; j < circles; j++) 
            {
                var bright = brightFunc(i, j, tick);

                  var sr = Math.floor(255 - (255 * bright));
                  var sg = Math.floor(255 - factor * i * bright);
                  var sb = Math.floor(255 - factor * j * bright);

                  var fr = Math.floor(255 - factor * j * bright);
                  var fg = Math.floor(255 - (255 * bright));
                  var fb = Math.floor(255 - factor * i * bright);

                ctx.strokeStyle = 'rgb(' + sr + ',' + sg + ',' + sb + ')';
                ctx.fillStyle = 'rgb(' + fr + ',' + fg + ',' + fb + ')';
                ctx.beginPath();
                ctx.arc((size / 2) + j * size, 
                        (size / 2) + i * size, 
                        (size / 2) - circleGap, 0, Math.PI * 2, true);

                if (renderFunc(i, j, tick, rate)) ctx.fill();
                else ctx.stroke();
            }
        }
    }

}