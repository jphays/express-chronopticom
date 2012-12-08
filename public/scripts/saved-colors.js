var Colors = 
{

    // standard colors
    black:   MakeColor.fromRGB(  0,   0,   0),
    white:   MakeColor.fromRGB(255, 255, 255),
    red:     MakeColor.fromRGB(255,   0,   0),
    green:   MakeColor.fromRGB(  0, 255,   0),
    blue:    MakeColor.fromRGB(  0,   0, 255),
    yellow:  MakeColor.fromRGB(255, 255,   0),
    aqua:    MakeColor.fromRGB(  0, 255, 255),
    magenta: MakeColor.fromRGB(255,   0, 255),

    // tehcolors (http://dotshare.it/dots/203/)
    tc_darkgray:      MakeColor.fromHex('#242424'),
    tc_midgray:       MakeColor.fromHex('#454545'),
    tc_lightgray:     MakeColor.fromHex('#dbdcdc'),
    tc_white:         MakeColor.fromHex('#fdfdfd'),
    tc_darkred:       MakeColor.fromHex('#c23669'),
    tc_lightred:      MakeColor.fromHex('#ff669d'),
    tc_darkorange:    MakeColor.fromHex('#fd971f'),
    tc_lightorange:   MakeColor.fromHex('#fecf35'),
    tc_yellow:        MakeColor.fromHex('#9cff00'),
    tc_darkgreen:     MakeColor.fromHex('#a6e22e'),
    tc_lightgreen:    MakeColor.fromHex('#beed5f'),
    tc_darkblue:      MakeColor.fromHex('#435e87'),
    tc_lightblue:     MakeColor.fromHex('#587aa4'),
    tc_darkcyan:      MakeColor.fromHex('#789ec6'),
    tc_lightcyan:     MakeColor.fromHex('#46a4ff'),
    tc_darkgrayblue:  MakeColor.fromHex('#5e7175'),
    tc_lightgrayblue: MakeColor.fromHex('#a3babf')

}

var ColorCollections = 
{
    tehcolors:
    [
        Colors.tc_darkgray,
        Colors.tc_midgray,
        Colors.tc_lightgray,
        Colors.tc_white,
        Colors.tc_darkred,
        Colors.tc_lightred,
        Colors.tc_darkorange,
        Colors.tc_lightorange,
        Colors.tc_yellow,
        Colors.tc_darkgreen,
        Colors.tc_lightgreen,
        Colors.tc_darkblue,
        Colors.tc_lightblue,
        Colors.tc_darkcyan,
        Colors.tc_lightcyan,
        Colors.tc_darkgrayblue, 
        Colors.tc_lightgrayblue
    ]
}

var Gradients =
{
}
