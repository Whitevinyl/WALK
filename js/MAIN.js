

// INIT //
var canvas;
var ctx;
var stats;

// METRICS //
var width = 0;
var height = 0;
var ratio = 1;
var TAU = 2 * Math.PI;


// INTERACTION //
var mouseX = 0;
var mouseY = 0;
var mouseIsDown = false;

// TEXTURE //
var textureCol = [new RGBA(0,32,185,1),new RGBA(235,98,216,1),new RGBA(10,200,200,1),new RGBA(255,245,235,1),new RGBA(3,4,5,1),new RGBA(255,160,180,1),new RGBA(255,170,170,1),new RGBA(255,150,90,1),new RGBA(240,30,40,1),new RGBA(10,10,70,1),
    new RGBA(255,80,100,1),new RGBA(70,0,80,1),new RGBA(120,235,200,1),new RGBA(150,152,152,1),new RGBA(220,25,70,1),new RGBA(210,150,120,1),new RGBA(60,30,35,1),new RGBA(15,90,75,1),new RGBA(255,170,90,1),new RGBA(35,140,160,1),new RGBA(0,230,200,1),new RGBA(250,200,70,1)];
var textureCol2 = [new RGBA(0,0,40,1),new RGBA(0,52,65,1),new RGBA(255,230,140,1),new RGBA(255,80,100,1),new RGBA(255,180,210,1)];
var lastPalette = 0;
var paint;
var imgData;
var canvasCollection;
var canvi = [];
var conti = [];
var maxLayers = 6;


// 3 white/cream
// 4 dark
// 5 // light pink bubblegum
// 6 // light pink cream
// 7 gold cream
// 8 red
// 9 dark purple
// 10 pink
// 11 purple
// 12 turquoise
// 13 grey
// 14 magenta
// 15 yellow cream
// 16 brown
// 17 green
// 18 yellow
// 19 cyan
// 20 peppermint
// 21 lemon

//color.lowPass = new RGBA(50,45,25,0);
color.lowPass = new RGBA(50,45,45,0);


var palettes = [
    [textureCol[8], textureCol[10], textureCol[21]], // red > coral > lemon
    [textureCol[18], textureCol[11], textureCol2[0]], // yellow > purple > dark
    [textureCol[3], textureCol[10], textureCol[20]], // white > coral > peppermint
    [textureCol[18], textureCol[13], textureCol[20]], // yellow > grey > peppermint
    [textureCol[18], textureCol[5], textureCol[20]], // yellow > bubblegum > peppermint
    [textureCol[4], textureCol[9], textureCol[8]], // dark > purple > red
    [textureCol[4], textureCol[13], textureCol[3]],  // dark > grey > white
    [textureCol[13], textureCol[3], textureCol[18]],  // grey > white > gold
    [textureCol2[0], textureCol[11], textureCol[10]], // dark > purple > coral
    [textureCol[7], textureCol[6], textureCol[16]], // gold > pink > brown
    [textureCol2[0], textureCol[17], textureCol[18]], // navy > green, yellow
    [textureCol2[0], textureCol[19], textureCol[18]], // navy > cyan, yellow
    [textureCol[9], textureCol[19], textureCol[6]], // navy > cyan, pink
    [textureCol[11], textureCol[19], textureCol[10]], // purple > cyan, coral
    [textureCol[4], textureCol[9], textureCol[14]] // dark purple > magenta

];

var all = [

    [textureCol2[0], textureCol[11], textureCol[10]], // dark > purple > coral pink
    [textureCol[4], textureCol[9], textureCol[10]], // dark blue > coral pink
    [textureCol2[0], textureCol[0], textureCol[5]], // electric blue > bubblegum
    [textureCol2[0], textureCol[10], textureCol[13]], // dark > coral > grey
    [textureCol[4], textureCol[9], textureCol[14]], // dark purple > magenta
    [textureCol2[0], textureCol[10], textureCol[12]], // dark > flesh > turquoise * might be bit much
    [textureCol[4], textureCol2[1], textureCol[10]], // petrel > pink
    [textureCol[4], textureCol[9], textureCol[11]], // dark > purple // v
    [textureCol[3], textureCol2[0], textureCol[4]],  // white > dark // v
    [textureCol2[0], textureCol2[1], textureCol[7]], // dark green > gold
    [textureCol2[0], textureCol[9], textureCol[5]], // navy > bubblegum pink /// v
    [textureCol[6], textureCol[13], textureCol[10]], // pale pink > grey coral
    [textureCol[4], textureCol2[0], textureCol[15]], // dark > cream // v
    [textureCol[4], textureCol[9], textureCol[13]], // dark blue > pale grey // v
    [textureCol[4], textureCol[9], textureCol[6]], // dark blue > pale pink // v
    [textureCol[0], textureCol2[0], textureCol[11]], // blue > dark > purple
    [textureCol[4], textureCol[9], textureCol2[1]],  // dark green > blue
    [textureCol[3], textureCol[13], textureCol[9]],  // white grey > dark purple
    [textureCol[3], textureCol[13], textureCol[10]], // white grey > pink * not sure
    [textureCol2[1], textureCol[13], textureCol[10]], // green > grey > coral
    [textureCol[10], textureCol[13], textureCol[5]], // pink > grey > pink flamingo
    [textureCol2[0], textureCol[13], textureCol[5]], // dark > grey > pink
    [textureCol[4], textureCol2[1], textureCol[14]], // dark green > magenta
    [textureCol2[0], textureCol2[1], textureCol[10]], // dark blue/green > pink
    [textureCol[4], textureCol[9], textureCol[7]], // dark blue > gold
    [textureCol[4], textureCol2[0], textureCol[7]], // dark > gold
    [textureCol[4], textureCol2[0], textureCol[10]], // very dark > pink
    [textureCol[4], textureCol[9], textureCol[8]], // dark purple > red
    [textureCol2[1], textureCol[10], textureCol[12]], // dark > flesh > turquoise
    [textureCol[14], textureCol[9], textureCol[12]], // magenta > dark > turquoise
    [textureCol[7], textureCol[14], textureCol[4]] // magenta > gold > dark
];




//-------------------------------------------------------------------------------------------
//  INITIALISE
//-------------------------------------------------------------------------------------------

function init() {

    // SETUP EXPERIMENT //
    setupExperiment();

    // SETUP CANVAS //
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    canvasCollection = document.getElementById('canvasCollection');



    // SET CANVAS & DRAWING POSITIONS //
    metrics();

    // INTERACTION //
    setupInteraction();

    // STATS //
    //initStats();

    addCanvases();

    // GENERATE NOISE LAYER //
    canvasNoise(200, 200, ratio, 0.025, 'noiseLayer');


    // CSS TRANSITION IN //
    var overlay = document.getElementById('overlay');
    overlay.style.top = '0';
    overlay.style.opacity = '1';

    setTimeout(function() {
        // INIT PAINT //
        resetPaint();

        // START LOOP //
        loop();
    }, 1000);
}


function addCanvases() {


    for (var i=0; i<maxLayers; i++) {
        var c = document.createElement('canvas');
        c.width = width;
        c.height = height;
        canvi.push(c);
        conti.push(c.getContext('2d'));
        c.classList = 'topCanvas';
        canvasCollection.appendChild(c);
    }

}

function resetPaint() {

    // clear screen //
    for (var i=0; i<maxLayers; i++) {
        conti[i].clearRect(0, 0, width, height);
    }

    var b = tombola.range(150, 220);
    color.fill(ctx, new RGBA(b,b,b,1));
    ctx.fillRect(0, 0, width, height);

    // choose palette and store memory to prevent repetition //
    var ind = lastPalette;
    while (ind === lastPalette) {
        ind = tombola.range(0, palettes.length - 1);
    }
    //ind = 0;
    var p = palettes[ind];
    lastPalette = ind;
    console.log(ind);
    var p2 = tombola.item(palettes);


    paint = new Paint(ctx, width, height, p, p2);
}


function initStats() {
    stats = new Stats();
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );
}


//-------------------------------------------------------------------------------------------
//  MAIN LOOP
//-------------------------------------------------------------------------------------------


function loop() {
    if (stats) stats.begin();
    update();
    draw();
    if (stats) stats.end();
    requestAnimationFrame(loop);
}


//-------------------------------------------------------------------------------------------
//  UPDATE
//-------------------------------------------------------------------------------------------

function update() {
    if (experiment) {
        experiment.update();
    }
    paint.update();
}


//-------------------------------------------------------------------------------------------
//  DRAW
//-------------------------------------------------------------------------------------------

function draw() {
    paint.draw();
}
