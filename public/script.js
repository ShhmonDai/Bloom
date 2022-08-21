 

<script>
    function restoreAndSkipContent() {
        setTimeout(function () {
            var hidden = document.querySelector('.Header2');

            hidden.classList.add('unhide');
            window.scroll(0, hidden.offsetHeight);
        }, 100);
        };
    restoreAndSkipContent();
</script>

 
 
 
 SPIRIT
<script>

    var slider_size,
        slider_level,
        slider_rot,
        slider_lenRand,
        slider_branchProb,
        slider_rotRand,
        slider_Count,
        slider_leafProb;

    var button_seed,
        button_newSeed,
        button_randomParams,
        button_change;

    var label_size,
        label_level,
        label_rot,
        label_lenRand,
        label_branchProb,
        label_rotRand,
        label_leafProb,
        label_perf,
        label_seed,
        label_source,
        label_source2,
        label_Count;

    var div_inputs;

    var input_seed,
        size,
        maxLevel,
        rot,
        lenRan,
        branchProb,
        rotRand,
        leafProb;

    var hide = false,
        prog = 1,
        growing = false,
        mutating = false,
        //randSeed = 699,
        randSeed = 80,
        paramSeed = Math.floor(Math.random() * 1000),
        randBias = 0;

        

    var completedCount = parseFloat(document.getElementById("MindCount").value);


    
    const Y_AXIS = 1;
    var b1, b1;

    function setup() {

        var myCanvas = createCanvas(window.innerWidth - 17, Math.min(window.innerHeight, 600));
        myCanvas.parent("insertTree");

        //create slider ( min, max, value, step)

        //size
        slider_size = createSlider(100, 150, /mobile/i.test(window.navigator.userAgent) ? 100 : 125, 1);
        slider_size.position(10, 410);

        //recursion level
        slider_level = createSlider(1, 14, 13, 1);
        slider_level.position(10, 430);

        //length variation
        slider_lenRand = createSlider(0, 1.2, 1, 0.01);
        slider_lenRand.position(10, 470);

        //split probability
        slider_branchProb = createSlider(0.72, 1, 0.95, 0.01);
        slider_branchProb.position(10, 490);

        slider_Count = createSlider(0, 100, 0, 1);
        slider_Count.position(10, 510);

        //flower probability
        slider_leafProb = createSlider(0, 0.45, 0.35, 0.01);
        slider_leafProb.position(10, 530);


        //Read inputs of sliders initial values ? 
        slider_size.input(function () { readInputs(true) });
        slider_level.input(function () { readInputs(true) });

        slider_lenRand.input(function () { readInputs(true) });
        slider_branchProb.input(function () { readInputs(true) });
        slider_Count.input(function () {readInputs(true)});

        slider_leafProb.input(function () { readInputs(true) });



        label_size = createSpan('Size');
        label_size.position(150, 410);
        label_level = createSpan('Recursion level');
        label_level.position(150, 430);

        label_lenRand = createSpan('Length variation');
        label_lenRand.position(150, 470);
        label_branchProb = createSpan('Split probability');
        label_branchProb.position(150, 490);

        label_Count = createSpan('Completed Goals Count');
        label_Count.position(150, 510);

        label_leafProb = createSpan('Flower probability');
        label_leafProb.position(150, 530);


        button_seed = createButton('Watch it bloom!');
        button_seed.position(10, 560);
        button_seed.mousePressed(function () {
            startGrow();
        });

        
        

        // button_randomParams = createButton('Set level to 0.72');
        // button_randomParams.position(10, 1200);
        // button_randomParams.mousePressed(function () {

        

        //     slider_level.value(13);

        //     readInputs(true);
        // });

        //Darker Color
        b1 = color(30, 63, 60);
        // b2 = color(125, 169, 154);

        //Lighter Color
        b2 = color(79, 83, 156);

        div_inputs = createDiv('');

        mX = mouseX;
        mY = mouseY;
        panX = 0;
        panY = 0;




        readInputs(false);
        startGrow();

    }


    function readInputs(updateTree) {
        //Static Values
        rot = ((PI / 2) / 4 - 0.05);
        rotRand = 0.10;


        //Dynamic Values
        completedCount = slider_Count.value();
        size = slider_size.value();
        maxLevel = slider_level.value();
        lenRand = slider_lenRand.value();
        branchProb = slider_branchProb.value();
        leafProb = slider_leafProb.value();

        if (updateTree && !growing) {
            prog = maxLevel + 1;
            loop();
        }
    }



    function windowResized() {
        resizeCanvas(windowWidth - 17, Math.min(windowHeight, 600));
    }

    function draw() {
        // stroke(255, 255, 255);
        setGradient(0, 0, width, height, b2, b1, Y_AXIS);
        stroke(255, 255, 255);

        // background(33, 66, 62);
        translate(width / 2, height);
        scale(1, -1);

        translate(0, 0);

        branch(1, randSeed);



        noLoop();
    }

    function branch(level, seed) {
        if (prog < level)
            return;

        randomSeed(seed);

        var seed1 = random(1000),
            seed2 = random(1000);

        var growthLevel = (prog - level > 1) || (prog >= maxLevel + 1) ? 1 : (prog - level);

        strokeWeight(15 * Math.pow((maxLevel - level + 1) / maxLevel, 2));

        var len = growthLevel * size * (1 + rand2() * lenRand);

        line(0, 0, 0, len / level);
        translate(0, len / level);


        var doBranch1 = rand() < branchProb;
        var doBranch2 = rand() < branchProb;

        var doLeaves = rand() < leafProb;

        if (level < maxLevel) {

            var r1 = rot * (1 + rrand() * rotRand);
            var r2 = -rot * (1 - rrand() * rotRand);

            if (doBranch1) {
                push();
                rotate(r1);
                branch(level + 1, seed1);
                pop();
            }
            if (doBranch2) {
                push();
                rotate(r2);
                branch(level + 1, seed2);
                pop();
            }
        }

        if ((level >= maxLevel || (!doBranch1 && !doBranch2)) && doLeaves) {
            var p = Math.min(1, Math.max(0, prog - level));

            var flowerSize = (size / 100) * p * (1 / 6) * (len / level);

            strokeWeight(4);
            stroke(140 + 15 * rand2(), 155 + 15 * rand2(), 240 + 15 * rand2());

            rotate(-PI);
            for (var i = 0; i <= 8; i++) {
                line(0, 0, 0, flowerSize * (1 + 0.5 * rand2()));
                rotate(2 * PI / 8);
            }
        }
    }

    function startGrow() {
        growing = true;
        prog = 1;
        grow();
    }

    function grow() {
        if (prog > (maxLevel + 3)) {
            prog = maxLevel + 3;
            loop();
            growing = false;
            return;
        }

        var startTime = millis();
        loop();
        var diff = millis() - startTime;

        prog += maxLevel / 8 * Math.max(diff, 20) / 200;
        setTimeout(grow, Math.max(1, 20 - diff));
    }


    function rand() {
        return random(1000) / 1000;
    }

    function rand2() {
        return random(2000) / 1000 - 1;
    }

    function rrand() {
        return rand2() + randBias;
    }

    function setGradient(x, y, w, h, c1, c2, axis) {
        noFill();

        if (axis === Y_AXIS) {
            // Top to bottom gradient
            for (let i = y; i <= y + h; i++) {
                let inter = map(i, y, y + h, 0, 1);
                let c = lerpColor(c1, c2, inter);
                stroke(c);
                line(x, i, x + w, i);
            }
        } else if (axis === X_AXIS) {
            // Left to right gradient
            for (let i = x; i <= x + w; i++) {
                let inter = map(i, x, x + w, 0, 1);
                let c = lerpColor(c1, c2, inter);
                stroke(c);
                line(i, y, i, y + h);
            }
        }
    }


</script>





MIND
<script>
    var slider_size,
        slider_level,
        slider_rot,
        slider_lenRand,
        slider_branchProb,
        slider_rotRand,
        slider_leafProb;

    var button_seed,
        button_newSeed,
        button_randomParams,
        button_change;

    var label_size,
        label_level,
        label_rot,
        label_lenRand,
        label_branchProb,
        label_rotRand,
        label_leafProb,
        label_perf,
        label_seed,
        label_source,
        label_source2;

    var div_inputs;

    var input_seed,
        size,
        maxLevel,
        rot,
        lenRan,
        branchProb,
        rotRand,
        leafProb;

    var hide = false,
        prog = 1,
        growing = false,
        mutating = false,
        randSeed = 80,
        paramSeed = Math.floor(Math.random() * 1000),
        randBias = 0;

    const Y_AXIS = 1;
    var b1, b1;

    function setup() {

        var myCanvas = createCanvas(window.innerWidth - 17, Math.min(window.innerHeight, 600));
        myCanvas.parent("insertTreeMind");

        //create slider ( min, max, value, step)

        //size
        slider_size = createSlider(100, 150, /mobile/i.test(window.navigator.userAgent) ? 100 : 125, 1);
        slider_size.position(10, 410);

        //recursion level
        slider_level = createSlider(1, 14, 11, 1);
        slider_level.position(10, 430);

        //length variation
        slider_lenRand = createSlider(0, 1, 1, 0.01);
        slider_lenRand.position(10, 470);

        //split probability
        slider_branchProb = createSlider(0.72, 1, 0.72, 0.01);
        slider_branchProb.position(10, 490);


        //flower probability
        slider_leafProb = createSlider(0, 1, 0.5, 0.01);
        slider_leafProb.position(10, 530);

        slider_size.input(function () { readInputs(true) });
        slider_level.input(function () { readInputs(true) });

        slider_lenRand.input(function () { readInputs(true) });
        slider_branchProb.input(function () { readInputs(true) });

        slider_leafProb.input(function () { readInputs(true) });



        label_size = createSpan('Size');
        label_size.position(150, 410);
        label_level = createSpan('Recursion level');
        label_level.position(150, 430);

        label_lenRand = createSpan('Length variation');
        label_lenRand.position(150, 470);
        label_branchProb = createSpan('Split probability');
        label_branchProb.position(150, 490);

        label_leafProb = createSpan('Flower probability');
        label_leafProb.position(150, 530);


        button_seed = createButton('Watch it grow!');
        button_seed.position(10, 560);
        button_seed.mousePressed(function () {
            startGrow();
        });


        /*button_randomParams = createButton('Set level to 0.72');
        button_randomParams.position(10, 1200);
        button_randomParams.mousePressed(function () {



            slider_level.value(13);

            readInputs(true);
        }); */

        //Dark Color
        b1 = color(79, 83, 156);
        //Light Color
        b2 = color(125, 169, 154);


        div_inputs = createDiv('');

        mX = mouseX;
        mY = mouseY;
        panX = 0;
        panY = 0;

        readInputs(false);
        startGrow();
    }


    function readInputs(updateTree) {
        size = slider_size.value();
        maxLevel = slider_level.value();
        rot = ((PI / 2) / 4 - 0.05);
        lenRand = slider_lenRand.value();
        branchProb = slider_branchProb.value();
        rotRand = 0.10;
        leafProb = slider_leafProb.value();

        if (updateTree && !growing) {
            prog = maxLevel + 1;
            loop();
        }
    }



    function windowResized() {
        resizeCanvas(windowWidth - 17, Math.min(windowHeight, 600));
    }

    function draw() {
        stroke(30, 63, 60);
        setGradient(0, 0, width, height, b2, b1, Y_AXIS);
        // stroke(255, 255, 255);

        //  background(33, 66, 62);

        translate(width / 2, height);
        scale(1, -1);

        translate(0, 0);

        branch(1, randSeed);



        noLoop();
    }

    function branch(level, seed) {
        if (prog < level)
            return;

        randomSeed(seed);

        var seed1 = random(1000),
            seed2 = random(1000);

        var growthLevel = (prog - level > 1) || (prog >= maxLevel + 1) ? 1 : (prog - level);

        strokeWeight(12 * Math.pow((maxLevel - level + 1) / maxLevel, 2));

        var len = growthLevel * size * (1 + rand2() * lenRand);

        line(0, 0, 0, len / level);
        translate(0, len / level);


        var doBranch1 = rand() < branchProb;
        var doBranch2 = rand() < branchProb;

        var doLeaves = rand() < leafProb;

        if (level < maxLevel) {

            var r1 = rot * (1 + rrand() * rotRand);
            var r2 = -rot * (1 - rrand() * rotRand);

            if (doBranch1) {
                push();
                rotate(r1);
                branch(level + 1, seed1);
                pop();
            }
            if (doBranch2) {
                push();
                rotate(r2);
                branch(level + 1, seed2);
                pop();
            }
        }

        if ((level >= maxLevel || (!doBranch1 && !doBranch2)) && doLeaves) {
            var p = Math.min(1, Math.max(0, prog - level));

            var flowerSize = (size / 100) * p * (1 / 6) * (len / level);

            strokeWeight(2);
            stroke(240 + 15 * rand2(), 140 + 15 * rand2(), 140 + 15 * rand2());

            rotate(-PI);
            for (var i = 0; i <= 8; i++) {
                line(0, 0, 0, flowerSize * (1 + 0.5 * rand2()));
                rotate(2 * PI / 8);
            }
        }
    }

    function startGrow() {
        growing = true;
        prog = 1;
        grow();
    }

    function grow() {
        if (prog > (maxLevel + 3)) {
            prog = maxLevel + 3;
            loop();
            growing = false;
            return;
        }

        var startTime = millis();
        loop();
        var diff = millis() - startTime;

        prog += maxLevel / 8 * Math.max(diff, 20) / 200;
        setTimeout(grow, Math.max(1, 20 - diff));
    }


    function rand() {
        return random(1000) / 1000;
    }

    function rand2() {
        return random(2000) / 1000 - 1;
    }

    function rrand() {
        return rand2() + randBias;
    }

    function setGradient(x, y, w, h, c1, c2, axis) {
        noFill();

        if (axis === Y_AXIS) {
            // Top to bottom gradient
            for (let i = y; i <= y + h; i++) {
                let inter = map(i, y, y + h, 0, 1);
                let c = lerpColor(c1, c2, inter);
                stroke(c);
                line(x, i, x + w, i);
            }
        } else if (axis === X_AXIS) {
            // Left to right gradient
            for (let i = x; i <= x + w; i++) {
                let inter = map(i, x, x + w, 0, 1);
                let c = lerpColor(c1, c2, inter);
                stroke(c);
                line(i, y, i, y + h);
            }
        }
    }

</script>
