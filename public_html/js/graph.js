var Graph = {
    canvas: undefined,
    context: undefined,
    offset: 20,
    scale: 2.0,

    height: undefined,
    width: undefined,

    init: function(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.height = canvas.height/this.scale;
        this.width = canvas.width/this.scale;
    },

    convertCoordinate: function(coordinate) {
        var x, y;
        x = coordinate[0] + this.offset;
        y = this.height - coordinate[1] - this.offset;

        return [x, y];
    },

    moveTo: function (x, y) {
        var coordinate = this.convertCoordinate([x, y]);
        this.context.moveTo(coordinate[0], coordinate[1]);
    },

    lineTo: function(x, y) {
        var coordinate = this.convertCoordinate([x, y]);
        this.context.lineTo(coordinate[0], coordinate[1]);
    },

    fillText: function(txt, x, y) {
        var coordinate = this.convertCoordinate([x, y]);
        this.context.fillText(txt, coordinate[0], coordinate[1]);
    },

    fillRect: function(x, y, width, height) {
        var coordinate = this.convertCoordinate([x, y]);
        this.context.fillRect(coordinate[0], coordinate[1], width, height);
    },

    fillPoint: function(x, y) {
        this.fillRect(x-1.5, y+1.5, 3, 3);
    },

    fillArrow: function canvas_arrow(fromx, fromy, tox, toy) {
        var context = this.context;
        var headlen = 5;   // length of head in pixels
        var c1 = this.convertCoordinate([fromx, fromy]),
            c2 = this.convertCoordinate([tox, toy]);
        fromx = c1[0];
        fromy = c1[1];
        tox = c2[0];
        toy = c2[1];

        var angle = Math.atan2(toy-fromy,tox-fromx);
        context.moveTo(fromx, fromy);
        context.lineTo(tox, toy);
        context.lineTo(tox-headlen*Math.cos(angle-Math.PI/6),toy-headlen*Math.sin(angle-Math.PI/6));
        context.moveTo(tox, toy);
        context.lineTo(tox-headlen*Math.cos(angle+Math.PI/6),toy-headlen*Math.sin(angle+Math.PI/6));
    },

    drawGrid: function() {
        var context = this.context,
            canvas = this.canvas,
            width = this.width,
            height = this.height,
            offset = this.offset;

        context.scale(this.scale, this.scale);


        for(var x = 0; x < width-offset; x += 10) {
            this.moveTo(x, 0);
            this.lineTo(x, canvas.height);
        }
        for (var y = 0; y < height-offset; y += 10) {
            this.moveTo(0, y);
            this.lineTo(canvas.width, y);
        }
        context.strokeStyle = "#eee";
        context.lineWidth = 0.5;
        context.stroke();

        // Draw x-axis

        context.strokeStyle = "#000";
        context.beginPath();
        this.moveTo(0, 0);
        this.lineTo(width, 0);
        context.stroke();
        // Draw y-axis
        context.beginPath();
        this.moveTo(0, height);
        this.lineTo(0, 0);
        context.stroke();

        context.font = "8px sans-serif";

        context.textAlign = "center";
        for(x = 50; x < width-offset; x += 50) {
            context.beginPath();
            this.moveTo(x, -2.5);
            this.lineTo(x, 2.5);
            context.stroke();
            this.fillText(x.toString(), x, -10);
        }

        for(y = 50; y < height-offset; y += 50) {
            context.beginPath();
            this.moveTo(-2.5, y);
            this.lineTo(2.5, y);
            context.stroke();
            this.fillText(y.toString(), -10, y-2.5);
        }
    },

    getMouseClick: function(e) {
        var canvas = this.canvas,
            offset = this.offset,
            scale = this.scale;
        var x;
        var y;
        if (e.pageX || e.pageY) {
            x = e.pageX;
            y = e.pageY;
        } else {
            x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        x -= canvas.offsetLeft;
        y -= canvas.offsetTop;
        x /= scale;
        y /= scale;
        // TODO: What the heck?
        x -= 53;
        y -= 12;

        return this.convertCoordinate([x,y]);
    }
};