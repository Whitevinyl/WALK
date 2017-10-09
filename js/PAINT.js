
function Paint(ctx,width,height,pal1,pal2) {

    this.ctx = ctx;

    // generate texture //
    this.noise = new SimplexNoise();
    this.height = Math.ceil(height);
    this.width = Math.ceil(width);
    this.worms = [];


    // make scale relative to canvas size //
    this.scale = (Math.max(this.width,this.height)/(1440 * ratio));

    this.timer = 60 * tombola.rangeFloat(6,8);
    this.frames = 1;
    this.timer /= this.frames;

    this.speed = 0;

    this.wormIndex = 0;
    this.indexCount = 0;

    this.generate(pal1, pal2);

}

Paint.prototype.generate = function(pal1, pal2) {
    var l = tombola.range(3, maxLayers);
    for (var i=0; i<l; i++) {
        var p = pal1;
        if (tombola.percent(20)) p = pal2;
        this.worms.push( new Worm(this, p));
    }
};

Paint.prototype.update = function() {

    if (this.timer < -220) {
        this.kill();
        resetPaint();
    }

    if (this.timer > 0) {
        this.speed = lerp(this.speed, 1, 4);
    }
    if (this.timer < 1) {
        this.speed = lerp(this.speed, 0, 5);
    }

    /*var l = this.worms.length;
    this.indexCount ++;
    if (this.wormIndex < (l-1) && this.indexCount > (this.timer / (l-1))) {
        this.indexCount = 0;
        this.wormIndex ++;
    }*/

    /*var l = this.worms.length;
    for (var i=0; i<l; i++) {
        for (var j=0; j<this.frames; j++) {

        }
    }*/
    this.timer--;
};

Paint.prototype.draw = function() {
    if (this.timer > -90) {
        var l = this.worms.length;
        //var i = this.wormIndex;

        for (var j=0; j<this.frames; j++) {
            for (var i=0; i<l; i++) {
                this.worms[i].update(this.noise);
                this.worms[i].draw(this.ctx, canvi[i], conti[i]);
            }
        }
    }
};

Paint.prototype.kill = function() {
    var l = this.worms.length;
    for (var i=0; i<l; i++) {
        this.worms[i].kill();
    }
};


function Worm(parent,p) {
    this.n = 0;
    this.s = 0;
    this.x = null;
    this.y = null;
    this.lastX = null;
    this.lastY = null;
    this.speed = tombola.rangeFloat(0.0018,0.003);
    this.speedN = this.speed * 1.3;
    this.speedS = tombola.rangeFloat(0.001,0.005);
    this.index = tombola.rangeFloat(0,200);
    this.indexN = tombola.range(0,100);
    this.indexS = tombola.range(0,100);
    this.parent = parent;
    this.cx = this.parent.width / 2;
    this.cy = this.parent.height / 2;
    this.moveScale = tombola.rangeFloat(600,1000) * this.parent.scale;
    this.size = tombola.rangeFloat(30, 240) * this.parent.scale;
    this.palette = p;
    this.yOff = tombola.rangeFloat(1,5);
    /*this.canvas = document.createElement('canvas');
    canvasCollection.appendChild(this.canvas);
    this.canvas.width = parent.width;
    this.canvas.height = parent.height;
    this.ctx = this.canvas.getContext('2d');*/
}

Worm.prototype.update = function(noise) {

    if (this.x !== null) {
        this.lastX = this.x;
        this.lastY = this.y;
    }

    this.x = this.cx + (noise.noise(0, this.index) * this.moveScale);
    this.y = this.cy + (noise.noise(this.index, 10000 + this.yOff) * this.moveScale);


    this.n = noise.noise(10000, this.indexN);
    this.s = (noise.noise(20000, this.indexS) + 1) * (this.size / 2);
    this.s = this.size;

    // update perlin index //
    this.index += (this.speed * this.parent.speed);
    this.indexN += (this.speedN * this.parent.speed);
    this.indexS += (this.speedS * this.parent.speed);
};

Worm.prototype.draw = function(ctx,thisCanvas,thisCtx) {

    if (this.lastX) {
        // color value & contrast //
        var n = (this.n + 1) / 2; // normalise to range 0 - 1;

        // set blended fill color //
        var fillCol;
        if (n > 0.5) {
            n = (n - 0.5) * 2;
            fillCol = color.blend2(this.palette[1], this.palette[2], n * 100);
        } else {
            n *= 2;
            fillCol = color.blend2(this.palette[0], this.palette[1], n * 100);
        }

        // draw //
        thisCtx = ctx;
        thisCtx.lineWidth = this.s * ratio;
        thisCtx.lineCap = 'round';
        color.stroke(thisCtx, fillCol);
        thisCtx.beginPath();
        thisCtx.moveTo(this.lastX, this.lastY);
        thisCtx.lineTo(this.x, this.y);
        thisCtx.stroke();

        //ctx.drawImage(thisCanvas, 0, 0);
    }

};

Worm.prototype.kill = function() {
    //canvasCollection.removeChild(this.canvas);
};
