var Color = function()
{

    // RGB

    var red = 0;        // stored as values between 0 and 1
    var green = 0;
    var blue = 0;

    this.__defineGetter__("red", function() { return Math.round(red * 255); });
    this.__defineGetter__("green", function() { return Math.round(green * 255); });
    this.__defineGetter__("blue", function() { return Math.round(blue * 255); });

    this.__defineSetter__("red", function(r) { red = Math.max(0, Math.min(255, r)) / 255.0; calculateHSV(); });
    this.__defineSetter__("green", function(g) { green = Math.max(0, Math.min(255, g)) / 255.0; calculateHSV(); });
    this.__defineSetter__("blue", function(b) { blue = Math.max(0, Math.min(255, b)) / 255.0; calculateHSV(); });

    // HSV

    var hue = 0;        // stored as value between 0 and 360
    var saturation = 0; // stored as values between 0 and 1
    var value = 0;

    this.__defineGetter__("hue", function() { return hue; });
    this.__defineGetter__("saturation", function() { return saturation; });
    this.__defineGetter__("value", function() { return value; });

    this.__defineSetter__("hue", function(h) { hue = h % 360; calculateRGB(); });
    this.__defineSetter__("saturation", function(s) { saturation = Math.max(0, Math.min(1, s)); calculateRGB(); });
    this.__defineSetter__("value", function(v) { value = Math.max(0, Math.min(1, v)); calculateRGB(); });

    // internal calculations

    function calculateHSV()
    {
        var max = Math.max(Math.max(red, green), blue);
        var min = Math.min(Math.min(red, green), blue);

        value = max;

        saturation = 0;
        if (max != 0) saturation = 1 - min/max;

        hue = 0;
        if (min == max) return;

        var delta = (max - min);
        
        if (red == max) hue = (green - blue) / delta;
        else if (green == max) hue = 2 + ((blue - red) / delta);
        else hue = 4 + ((red - green) / delta);
       
         hue = hue * 60;
        if (hue < 0) hue += 360;
    }

    function calculateRGB()
    {
        red = value;
        green = value;
        blue = value;

        if (value == 0 || saturation == 0) return;

        var tHue = (hue / 60);
        var i = Math.floor(tHue);
        var f = tHue - i;
        var p = value * (1 - saturation);
        var q = value * (1 - saturation * f);
        var t = value * (1 - saturation * (1 - f));

        switch(i)
        {
            case 0:
                red = value; green = t; blue = p;
                break;
            case 1:
                red = q; green = value; blue = p;
                break;
            case 2:
                red = p; green = value; blue = t;
                break;
            case 3:
                red = p; green = q; blue = value;
                break;
            case 4:
                red = t; green = p; blue = value;
                break;
            default:
                red = value; green = p; blue = q;
                break;
        }
    }
}

Color.prototype = 
{

    setRGB: function(r, g, b)
    {
        this.red = Math.max(0, Math.min(255, r));
        this.green = Math.max(0, Math.min(255, g));
        this.blue = Math.max(0, Math.min(255, b));
        //this._calculateHSV();
        return this;
    },

    setHSV: function(h, s, v)
    {
        this.hue = h % 360;
        this.saturation = Math.max(0, Math.min(1, s));
        this.value = Math.max(0, Math.min(1, v));
        //this._calculateRGB();
        return this;
    },

    setHexString: function(hex)
    { 
        if (hex == null || typeof(hex) != "string")
        {
            this.setRGB(0,0,0);
            return;
        }

        if (hex.substr(0, 1) == '#') hex = hex.substr(1);

        if (hex.length != 6)
        {
            this.setRGB(0,0,0);
            return;
        }

        var r = parseInt(hex.substr(0, 2), 16);
        var g = parseInt(hex.substr(2, 2), 16);
        var b = parseInt(hex.substr(4, 2), 16);
        
        if (isNaN(r) || isNaN(g) || isNaN(b))
        {
            this.setRGB(0,0,0);
            return;
        }

        this.setRGB(r,g,b);
    },

    getHexString: function()
    {
        var rStr = this.red.toString(16);
        var gStr = this.green.toString(16);
        var bStr = this.blue.toString(16);

        if (rStr.length == 1) rStr = '0' + rStr;
        if (gStr.length == 1) gStr = '0' + gStr;
        if (bStr.length == 1) bStr = '0' + bStr;

        return ('#' + rStr + gStr + bStr).toUpperCase();
    },

    toString: function() 
    {
        return this.getHexString();
    },

    complement: function()
    {
        var newHue = (this.hue >= 180) ? this.hue - 180 : this.hue + 180;
        var newVal = (this.value * (this.saturation - 1) + 1);
        var newSat = (this.value * this.saturation) / newVal;
        return MakeColor.fromHSV(newHue, newVal, newSat);
    },

}


// Color factory

var MakeColor = new function()
{

    this.fromColor = this.from = function(color) 
    {
        return new Color().setRGB(color.red, color.green, color.blue);
    }

    this.fromHSV = function(hue, sat, val)
    {
        return new Color().setHSV(hue, sat, val);
    }

    this.fromRGB = function(r, g, b)
    {
        return new Color().setRGB(r, g, b);
    }

    this.fromHex = function(hexStr)
    {
        var color = new Color();
        color.hexString = hexStr;
        return color;
    }

}();
