# frame-animation

###js实现帧动画的原理
1.如果有多张帧图片，用一个image标签去承载图片，定时改变image的src属性

2.把所有动画关键帧绘制在一张图片里，把图片作为元素的background-image,定时改变元素的background-position属性
