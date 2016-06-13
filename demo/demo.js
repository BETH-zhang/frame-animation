/**********************************************
 * created by beth on 2016年6月12日
 * 创建一个动画对象
 **********************************************/

function $(id) {
    return document.getElementById(id);
}

var $rabbit1 = $('rabbit1');
var $rabbit2 = $('rabbit2');
var $rabbit3 = $('rabbit3');
var $rabbit4 = $('rabbit4');

var images = ['rabbit-big.png', 'rabbit-lose.png', 'rabbit-win.png']

// var imgUrl = 'rabbit-big.png';
var rightRunningMap = ["0 -854", "-174 -852", "-349 -852", "-524 -852", "-698 -851", "-873 -848"];
var leftRunningMap = ["0 -373", "-175 -376", "-350 -377", "-524 -377", "-699 -377", "-873 -379"];
var rabbitWinMap = ["0 0", "-198 0", "-401 0", "-609 0", "-816 0", "0 -96", "-208 -97", "-415 -97", "-623 -97", "-831 -97", "0 -203", "-207 -203", "-415 -203", "-623 -203", "-831 -203", "0 -307", "-206 -307", "-414 -307", "-623 -307"];
var rabbitLoseMap = ["0 0", "-163 0", "-327 0", "-491 0", "-655 0", "-819 0", "0 -135", "-166 -135", "-333 -135", "-500 -135", "-668 -135", "-835 -135", "0 -262"];

var animation = window.animation;


function repeat() {
    var repeatAnimation = animation().loadImage([images]).changePosition($rabbit1, rightRunningMap, images[0]).repeatForever();
    repeatAnimation.start(80);
}

repeat();

function win() {
    var winAnimation = animation().loadImage([images]).changePosition($rabbit3, rabbitWinMap, images[2]).repeat(3).then(function() {
        console.log('win animation repeat 3 times and fined');
    });
    winAnimation.start(200);
}

win();

function lose() {
    var loseAnimation = animation().loadImage([images]).changePosition($rabbit4, rabbitLoseMap, images[1]).wait(3000).repeat(1).then(function() {
        console.log('lose');
    });
    loseAnimation.start(200);
}

lose();

function run() {
    var speed = 6;
    var initLeft = 100;
    var finalLeft = 400;
    var frameLength = 6;
    var frame = 4;
    var right = true;
    var interval = 50;

    var runAnimation = animation().loadImage([images]).enterFrame(function(success, time) {
        var ratio = time / interval;
        var position;
        var left;
        //向右跑
        if (right) {
            position = rightRunningMap[frame].split(' ');
            left = Math.min(initLeft + speed * ratio, finalLeft);

            if (left === finalLeft) {
                right = false;
                frame = 4;
                success();
                return;
            }
        } else {
            position = leftRunningMap[frame].split(' ');
            left = Math.max(initLeft, finalLeft - speed * ratio);
            if (left === initLeft) {
                right = true;
                frame = 4;
                success();
                return;
            }
        }

        $rabbit2.style.backgroundImage = 'url(' + images[0] + ')';
        $rabbit2.style.backgroundPosition = position[0] + 'px ' + position[1] + 'px';
        $rabbit2.style.left = left + 'px';
        frame++;
        if (frame == frameLength) {
            frame = 0;
        }
    }).repeat(2).wait(1000).changePosition($rabbit2, rabbitWinMap, images[2]).then(function() {
        console.log('finished!');
    });
    runAnimation.start(interval);
}

run();



// animation(ele, positions, imgUrl);

// function animation(ele, positions, imgUrl) {

//     ele.style.backgroundImage = 'url(' + imgUrl + ')';
//     ele.style.backgroundRepeat = 'no-repeat';

//     var index = 0;

//     function run() {

//         var position = positions[index].split(' ');
//         ele.style.backgroundPosition = position[0] + 'px ' + position[1] + 'px';
//         index++;
//         if (index >= position.length) {
//             index = 0;
//         }
//         setTimeout(run, 80);
//     }

//     run();
// }