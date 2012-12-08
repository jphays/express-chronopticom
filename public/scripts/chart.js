// =================================
//  AstroChart
// =================================

function AstroChart(options) {

    var chart;
    var info;
    var controls;

    var chartData = options.chartData;

    var MIN_SIZE=350;

    init();

    function init()
    {
        $(window).resize(function() { setSize(); });

        chart    = Chart({ chartData: chartData, eyeCandy: options.eyeCandy });
        info     = ChartInfo({ chartData: chartData });
        controls = ChartControls({ chart: chart, eyeCandy: options.eyeCandy });

        setSize();
    }

    function setSize(size)
    {
        if (!size)
        {
            size = Math.min($(window).width() - 300, $(window).height() - 200);
        }

        size = Math.max(MIN_SIZE, size);

        $("#content").css("width", size + 265 + "px").css("height", size + "px");

        chart.setSize(size);
        info.setSize(size);
        controls.setSize(size);
    }

    return {
        chartData: chartData,
        chart: chart
    };
}


// ---------------------------------
//  Chart Info Panel
// ---------------------------------

function ChartInfo(options) {

    var chartData = options.chartData;

    var element = $("#info").get(0);
    var width   = $(element).width;
    var height  = $(element).height;

    renderInfo();

    function renderInfo()
    {

        $(element).empty();

        if (chartData)
        {
            $(element).
                append($("<h2/>").
                    addClass("chartName").
                    text(chartData.name)).
                append($("<div/>").
                    addClass("birthInfo").
                    text("Born on " + chartData.birth.date.toGMTString() +
                         " in " + chartData.birth.place)).
                append($("<div/>").
                    addClass("planets").
                    append($("<h3/>").
                        text("planets")));
        }
        else
        {
            $(element).
                append($("<div/>").
                    addClass("empty").
                    text("no chart data loaded."));
        }

    }

    function setSize(size)
    {
        width  = 230;
        height = size - 220;

        $(element).css("width", width + "px").css("height", height + "px");
    }

    return {
        setSize: setSize
    };

}


// ---------------------------------
//  Chart Control Panel
// ---------------------------------

function ChartControls(options) {

    var chart = options.chart;

    var element = $("#controls").get(0);
    var width   = $(element).width;
    var height  = $(element).height;

    renderControls();

    function renderControls()
    {
        var eyeCandyEnabled = chart.eyeCandy.enabled || options.eyeCandy;
        $(element).empty();
        $(element).append(
            $("<p>").
                text("Eye candy: ").
                append($("<span>").
                    addClass("linkish").
                    text(eyeCandyEnabled ? "stop" : "start").
                    click(function() {
                        chart.eyeCandy.enabled = !eyeCandyEnabled;
                        eyeCandyEnabled ? chart.stopAnimation() : chart.startAnimation();

                        renderControls();
                    })));
    }

    function setSize(size)
    {
        width  = 230;
        height = 165;

        $(element).css("width", width + "px").css("height", height + "px");
    }

    return {
        setSize: setSize
    }

}


// ---------------------------------
//  The Chart Itself
// ---------------------------------

function Chart(options) {

    var chartData = options.chartData;

    var eyeCandy = {
        enabled: options.eyeCandy || false,
        randomizeLines: true,
        drawSpirographs: true,
        animate: true,
        fadeOut: true,
        fadeColor: "rgba(0, 0, 0, 0.02)",
        randomizeFadeColor: true
    }

    var element = $("#chart").get(0);
    var container = $("#chartContainer").get(0);

    // canvas width and height
    var width = options.size || 600;
    var height = options.size || 600;

    // canvas rendering context
    var ctx;

    var tick;       // animation clock
    var tasks = []; // window.setInterval ids

    function init()
    {
        var canvas = $(chart).get(0);

        if (canvas.getContext)
        {
            ctx = canvas.getContext("2d");
            render();

            return true;
        }
        else
        {
            alert("Your browser doesn't seem to support the canvas element.");

            return false;
        }
    }


    // chart rendering

    function render()
    {
        drawChart();

        if (eyeCandy.enabled && eyeCandy.animate)
        {
            stopAnimation();
            startAnimation();
        }
    }

    function clear()
    {
        ctx.clearRect(0, 0, width, height);

        ctx.lineWidth = 2;
        ctx.strokeStyle = "#444";
        ctx.font = "12pt consolas";
        ctx.textAlign = "center";
        ctx.globalCompositeOperation =
            eyeCandy.enabled ?
                (Math.random() > 0.8 ? 'xor' : 'destination-over') :
                'lighter';
    }

    function drawChart()
    {
        ctx.save();
        ctx.translate(width / 2, height / 2);

        drawBase();

        if (chartData)
        {
            drawPlanets();
        }

        ctx.restore();
    }

    function drawBase()
    {
        ctx.strokeStyle = "#DDD";

        drawCircle(.93, .5);
        drawCircle(.9, 2);
        drawCircle(.75, 2);
        drawCircle(.72, .5);
        drawCircle(.15, .5);

        // drawDegrees();

        drawSignDividers(0);
        //drawSignNames(0);
    }

    function drawCircle(radius, thickness)
    {
        ctx.save();

        var r = width / 2 * radius;
        ctx.lineWidth = thickness;

        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2, false);
        ctx.stroke();

        ctx.restore();
    }

    function drawSignDividers(offset)
    {
       // drawDividers(offset, 0, 0.5);
       drawDividers(offset, 1, 2);
       drawDividers(offset, 2, 1);
    }

    function drawSignNames(offset)
    {
        ctx.textAlign = "center";
        ctx.font = "7pt calibri";
        ctx.fillStyle = "#DDD";

        for (var sign in Sign)
        {
            ctx.save();
            ctx.rotate(zang(sign.id * 30 + 15));
            ctx.fillText(sign, 0, rad(0.908));
            ctx.restore();
        }
    }

    function drawHouseDiviers(houses)
    {

    }

    function drawDividers(offset, location, thickness)
    {
        if (eyeCandy.enabled && eyeCandy.randomizeLines)
        {
            var multiple = Math.floor(Math.random() * 12);

            for (var i = 0; i < 12; i++)
            {
                drawDivider(multiple * (Math.PI * 2 / i) + offset, location, thickness);
            }
        }
        else
        {
            for (var i = 0; i < 12; i++)
            {
                drawDivider(zang(i * 30), location, thickness);
            }
        }
    }

    function drawDivider(angle, location, thickness, color)
    {
        var start, end;
        ctx.save();
        ctx.lineWidth = thickness;
        if (color) ctx.strokeStyle = color;

        switch(location)
        {
            case 0:
                start = .15; end = .72; break;
            case 1:
                start = .75; end = .9; break;
            case 2:
                start = .93; end = 2;
                if (eyeCandy.enabled) {
                    ctx.strokeStyle = randColor(true);
                    angle = angle + Math.PI;
                    ctx.lineWidth = Math.random() > 0.9 ? 9 : thickness;
                }
                break;
        }

        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, rad(start));
        ctx.lineTo(0, rad(end));
        ctx.stroke();

        ctx.restore();
    }


    function drawDegrees()
    {
        ctx.fillStyle = "#888";
        ctx.textAlign = "center";
        ctx.font = "7pt calibri";

        for (var i = 0; i < 360; i += 10)
        {
            ctx.save();
            ctx.rotate(zang(i));
            ctx.fillText(i, 0, rad(0.908));
            ctx.restore();
        }
    }

    function drawPlanets()
    {
        ctx.textAlign = "center";
        ctx.font = "10pt consolas";

        if (chartData && chartData.planets)
        {
            for (var planet in chartData.planets)
            {
                drawPlanet(planet, chartData.planets[planet]);
            }
        }
    }


    function drawPlanet(planet, data)
    {
        var sign = data.sign;
        var angle = (data.degree || 15) + (sign.id - 1) * 30;
        var color = randColor(true);

        ctx.save();
        ctx.rotate(zang(angle));

        // planet color
        ctx.fillStyle = ctx.strokeStyle = color;

        // write planet name
        ctx.fillText(planet, 0, rad(0.81));

        ctx.restore();

        drawDivider(zang(angle), 0, 0.5, color);
        drawDivider(zang(angle), 2, 6, color);
    }


    // utilities

    function rad(dist)
    {
        // returns the y-coordinate for a given radius.
        // 0 = center, 1 = edge of canvas at middle.
        return dist * -(width) / 2;
    }

    function zang(deg)
    {
        // returns an angle in radians for a given degree of the zodiac.
        return -(deg + 90) / 360 * Math.PI * 2;
    }


    // resizing

    function setSize(size)
    {
        if (!size) {
            size = Math.min($(window).width() - 250, $(window).height() - 200);
        }

        width = height = size;

        $(container).css("width", width + "px").css("height", height + "px");
        $(chart).attr("width", width).attr("height", height);

        render();
    }


    // animation

    function stopAnimation()
    {
        var oldTask;
        while (oldTask = tasks.pop()) window.clearInterval(oldTask);
    }

    function startAnimation()
    {
        drawEyeCandy();
        tasks.push(window.setInterval(drawEyeCandy, 2400));

        if (eyeCandy.fadeOut)
        {
            fadeOut();
            tasks.push(window.setInterval(fadeOut, 50));
        }
    }

    function drawEyeCandy()
    {
        clear();
        drawChart();
        if (eyeCandy.drawSpirographs) drawSpiros(2);
        if (eyeCandy.fadeOut && eyeCandy.randomizeFadeColor)
            eyeCandy.fadeColor = randColor(false);
    }

    function fadeOut()
    {
        ctx.globalCompositeOperation = "source-atop";
        ctx.fillStyle = eyeCandy.fadeColor;
        ctx.fillRect(0, 0, width, height);
    }


    // goodies

    function randColor(goodOnes)
    {
        var colors = Colors.tehcolors;

        if (goodOnes == true)
        {
            return colors[Math.floor(Math.random() * colors.length)];
        }
        else
        {
            return "rgba(" + Math.floor(Math.random() * 255) + ", " +
                             Math.floor(Math.random() * 255) + ", " +
                             Math.floor(Math.random() * 255) + ", " +
                             "0.03)";
        }
    }

    function drawSpiros(pattern)
    {
        // pattern 1: rectangular, 3x3
        // pattern 2: radial, 1 central and 8 randomly around edge

        ctx.save();

        if (pattern == 1)
        {
            for (var i = 0; i < 3; i++)
            {
                for (var j = 0; j < 3; j++)
                {
                    var k = Math.floor(i + Math.random() - 0.5);
                    var l = Math.floor(j + Math.random() - 0.5);

                      ctx.save();

                      ctx.strokeStyle = randColor(true);
                      ctx.lineWidth = Math.random() > 0.8 ? 6 : 2;
                      ctx.translate((width * 0.2) + j * (width * 0.3), (height * 0.2) + i * (height * 0.3));
                      drawSpirograph(ctx, (width * 0.06) * (l + 2)/(l + 1), -8 * (k + 3)/(k + 1), 10);

                      ctx.restore();
                }
              }
        }
        else
        {
            ctx.translate(width / 2, height / 2);

            var multiple = Math.floor(Math.random() * 12);
            var locations = [
                { trans: 0, size: 0.08 },
                { trans: 0.46, size: 0.045 },
                { trans: 0.83, size: 0.05 },
                { trans: 0.95, size: 0.1 }
            ]

            for (var i = 0; i < 9; i++)
            {
                ctx.save();

                var k = i % 3;
                var l = Math.floor(i / 3);

                ctx.strokeStyle = randColor(true);
                ctx.lineWidth = Math.random() > 0.8 ? 6 : 2;
                var location = locations[Math.floor(Math.random() * 4)];

                //ctx.rotate(Math.random() * Math.PI * 2);
                ctx.rotate(multiple * Math.PI * 2 / i)
                ctx.translate(0, width / 2 * location.trans)

                drawSpirograph(ctx, Math.floor((width * location.size) * (l + 2)/(l + 1)), -8 * (k + 3)/(k + 1), 25);

                ctx.restore();
            }
        }

          ctx.restore();
    }

    function drawSpirograph(ctx, R, r, O)
    {
        var x1 = R-O;
        var y1 = 0;
        var i  = 1;

        ctx.beginPath();
        ctx.moveTo(x1,y1);

        do
        {
            if (i>20000) break;
            var x2 = (R+r)*Math.cos(i*Math.PI/72) - (r+O)*Math.cos(((R+r)/r)*(i*Math.PI/72));
            var y2 = (R+r)*Math.sin(i*Math.PI/72) - (r+O)*Math.sin(((R+r)/r)*(i*Math.PI/72));
            ctx.lineTo(x2,y2);
            x1 = x2;
            y1 = y2;
            i++;
        } while (x2 != R-O && y2 != 0 );

        ctx.stroke();
    }


    if (init())
    {
        return {
            setSize: setSize,
            render: render,
            startAnimation: startAnimation,
            stopAnimation: stopAnimation,
            eyeCandy: eyeCandy
        };
    }
    else
    {
        return null;
    }

}