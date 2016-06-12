/**********************************************
 * created by beth on 2016年6月12日
 * 创建一个动画对象
 **********************************************/

var imgUrl = 'rabbit-big.png';
var positions = [
    '0 -854',
    '-174 -852',
    '-349 -852',
    '-524 -852',
    '-698 -852',
    '-873 -848'
];

var ele = document.getElementById('rabbit');

animation(ele, positions, imgUrl);

function animation(ele, positions, imgUrl) {

    ele.style.backgroundImage = 'url(' + imgUrl + ')';
    ele.style.backgroundRepeat = 'no-repeat';

    var index = 0;

    function run() {

        var position = positions[index].split(' ');
        ele.style.backgroundPosition = position[0] + 'px ' + position[1] + 'px';
        index++;
        if (index >= position.length) {
            index = 0;
        }
        setTimeout(run, 80);
    }

    run();
}
