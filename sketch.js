let img;
let faceapi;
let video;
let edgeImg
let imgDetections;
let detections;
let mode = 0;
let w = 640;
let h = 480;
let videoImg;

const options = {
    withLandmarks: true,
    withDescriptors: false,
    withExpressions: false,
}

let s1 = (s) => {
    s.setup = () => {
        img = s.loadImage('./abc.jpg')
        edgeImg = s.loadImage('./abc.jpg')
        s.createCanvas(w, h);
        faceapi = ml5.faceApi(options)
    };
    s.drawBox = () => {
        s.image(img, 0, 0)
        for (let i = 0; i < detections.length; i++) {
            const Box = detections[i].alignedRect.box;
            const px = Box._x + Box._width / 2
            const py = Box._y + Box._height / 2
            s.noStroke();
            s.fill(s.color(255, 0, 0));
            s.ellipse(px, py, 15, 15);
        }
    };
    s.drawBlur = () => {
        s.image(img, 0, 0)
        s.image(edgeImg, 0, 0)
        s.filter(s.BLUR, 2);
        detections.map(e => {
            let Box = e.alignedRect.box;
            let x1 = Math.floor(Box._x)
            let x2 = Math.floor(Box._width)
            let y1 = Math.floor(Box._y)
            let y2 = Math.floor(Box._height)
            s.copy(img, x1, y1, x2, y2, x1, y1, x2, y2);
            s.stroke(255);
            s.noFill();
        })
    }
    s.drawFace = () => {
        s.image(img, 0, 0)
        let vImg = video.get(0, 0, w, h);
        faceapi.detect(img, (err, results) => {
            if (err) {
                console.log(err)
                return
            }
            imgDetections = results;
        })
        let px;
        let py;
        for (let i = 0; i < detections.length; i++) {
            const Box = detections[i].alignedRect.box;
            px = Box._x + Box._width / 2
            py = Box._y + Box._height / 2
            s.noStroke();
            s.fill(s.color(255, 0, 0));
            s.ellipse(px, py, 15, 15);
        }
        if (imgDetections != undefined) {
            for (let i = 0; i < imgDetections.length; i++) {
                const Box = imgDetections[i].alignedRect.box;
                //console.log(Box)
                if (Box._x <= px && px <= Box._x + Box._width && Box._y <= py && py <= Box._y + Box._height) {
                    let x1 = Math.floor(Box._x)
                    let x2 = Math.floor(Box._width)
                    let y1 = Math.floor(Box._y)
                    let y2 = Math.floor(Box._height)
                    s.copy(vImg, x1, y1, x2, y2, x1, y1, x2, y2);
                    s.stroke(255);
                    s.noFill();
                    console.log("Red point inside the box")
                }
            }
        }
    }
};

let sketch1 = new p5(s1);

let s2 = (s) => {
    s.setup = () => {
        s.createCanvas(w, h);
        video = s.createCapture(s.VIDEO);
        video.size(w, h);
        video.hide(); // Hide the video element, and just show the canvas
        faceapi = ml5.faceApi(video, options, faceReady)
    };
    s.draw = () => {
        s.background(255);
        s.image(video, 0, 0, 640, 480)
        if (detections != undefined && detections.length > 0) {
            for (let i = 0; i < detections.length; i++) {
                const Rect = detections[i].alignedRect;
                const x = Rect._box._x
                const y = Rect._box._y
                const boxWidth = Rect._box._width
                const boxHeight = Rect._box._height
                s.noFill();
                s.stroke(255, 0, 0);
                s.strokeWeight(2);
                s.rect(x, y, boxWidth, boxHeight);
            }
        }
    }
    this.faceReady = () => {
        faceapi.detect(gotResults)
    }
    this.gotResults = (err, result) => {
        if (err) {
            console.log(err)
            return
        }
        detections = result;
        if (detections && detections.length > 0) {
            if (mode === 1) {
                sketch1.drawBlur()
            } else if (mode === 2) {
                sketch1.drawFace()
            } else {
                sketch1.drawBox()
            }
        }
        faceapi.detect(gotResults)
    } 
    s.keyPressed = () => {
        if (s.key === 'v') {
            console.log(s.key + "  is pressed")
            mode = 1
        } else if (s.key === 'f') {
            console.log(s.key + "  is pressed")
            mode = 2
        } else if (s.key === 'e') {
            console.log(s.key + "  is pressed")
            mode = 0;
        } else { }
    }
};

let sketch2 = new p5(s2);