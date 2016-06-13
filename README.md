# frame-animation

###js实现帧动画的原理
1.如果有多张帧图片，用一个image标签去承载图片，定时改变image的src属性

2.把所有动画关键帧绘制在一张图片里，把图片作为元素的background-image,定时改变元素的background-position属性

###设计一个通用的帧动画库
1.需求分析
    1.支持图片预加载
    2.支持2种动画播放方式，及自定义每帧动画
    3.支持单组动画控制循环次数（可支持无限次）
    4.支持一组动画库完成，继续完成下一组动画
    5.支持每个动画完成后有等待时间
    6.支持动画暂停和继续播放
    7.支持动画完成后执行回调函数

2.编程接口
    1.loadImage(imglist)//与加载图片
    2.changePosition(ele, position, imageUrl)//改变元素的background-position动画
    3.changeSrc(ele, imglist)//通过改变image元素的src
    4.enterFrame(callback)//每一帧动画执行的函数，相当于用户可以自定义每一帧动画的callback
    5.repeat(times)//动画重复执行的次数，times为空时表示无限次
    6.repeatForever()//无限重复上一次动画，相当于repeat（），更友好的一个接口
    7.wait(time)//每个动画执行完后等待的时间
    8.then(callback)//动画执行完成后的回调函数
    9.start(interval)//动画开始执行，interval表示动画执行的间隔
    10.pause()//动画暂停
    11.restart()//动画从上一次暂停处重新执行
    12.dispose()//释放资源

3.调用方式
    1.支持链式调用，我们期望动词的方式描述接口，调用方式如下：
        var animation = require("animation");
        var demoAnimation = animation().loadImage(images).changePosition(ele, positions).repeat(2).then(function(){
            //动画执行完成后调用此函数
        });
        demoAnimation.start(80);

4.代码设计
    1.任务链
    2.记录当前任务链
    3.
