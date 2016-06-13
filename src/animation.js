/**********************************************
 * created by beth on 2016年6月13日
 * 动画库
 **********************************************/

'use strict';

var loadImage = require('./imageloader');
var Timeline = require('./timeline');

//初始化状态
var STATE_INITIAL = 0;
//开始状态
var STATE_START = 1;
//停止状态
var STATE_STOP = 2;

//同步任务
var TASK_SYNC = 0;
//异步任务
var TASK_ASYNC = 1;

/**
 * 简单的函数封装，执行callback
 * @param  {Function} callback [description]
 * @return {Function}          [description]
 */
function next(callback) {
    callback && callback();
}

/**
 * 帧动画类
 */
function Animation() {
    this.taskQueue = [];
    this.index = 0;
    this.timeline = new Timeline();

    this.state = STATE_INITIAL;
}

/**
 * 添加一个同步任务，去预加载图片
 * @param  {[type]} imglist [description]
 * @return {[type]}         [description]
 */
Animation.prototype.loadImage = function(imglist) {
    var taskFn = function(next) {
        loadImage(imglist.slice(), next);
    }
    var type = TASK_SYNC;

    return this._add(taskFn, type);
}

/**
 * 添加一个异步定时任务，通过定时改变图片背景位置，实现帧动画
 * @param  {[type]} ele       dom对象
 * @param  {[type]} positions [description]
 * @param  {[type]} imageUrl  [description]
 * @return {[type]}           [description]
 */
Animation.prototype.changePosition = function(ele, positions, imageUrl) {
    var len = positions.length;
    var taskFn;
    var type;
    if (len) {
        var me = this;
        taskFn = function(next, time) {
            if (imageUrl) {
                ele.style.backgroundImage = 'url(' + imageUrl + ')';
            }
            //获得当前位置图片背景的索引
            var index = Math.min(time / me.interval | 0, len - 1);
            var position = positions[index].split(' ');
            //改变dom对象的背景图片位置
            ele.style.backgroundPosition = position[0] + 'px ' + position[1] + 'px';
            if (index === len - 1) {
                next();
            }
            type = TASK_ASYNC;
        }
    } else {
        taskFn = next;
        type = TASK_SYNC;
    }

    return this._add(taskFn, type);
}

/**
 * 添加一个异步定时任务，通过定时改变image标签的src属性，实现帧动画
 * @param  {[type]} ele     [description]
 * @param  {[type]} imglist [description]
 * @return {[type]}         [description]
 */
Animation.prototype.changeSrc = function(ele, imglist) {
    var len = imglist.length;
    var taskFn;
    var type;
    if (len) {
        var me = this;
        taskFn = function(next, time) {
            //获得当前图片索引
            var index = Math.min(time / me.interval | 0, len - 1);
            //改变image对象的图片地址
            ele.src = imglist[index];
            if (index == len - 1) {
                next();
            }
        }
        type = TASK_ASYNC;

    } else {
        taskFn = next;
        type = TASK_SYNC;
    }

    return _add(taskFn, type);
}

/**
 * 高级用法，添加一个异步定时执行的任务，该任务自定义动画每帧执行的任务函数
 * @param  {[type]} taskFn [description]
 * @return {[type]}        [description]
 */
Animation.prototype.enterFrame = function(taskFn) {
    return this._add(taskFn, TASK_ASYNC);
}

/**
 * 添加一个同步任务，可以在上一个任务完成后执行回调函数
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Animation.prototype.then = function(callback) {
    var taskFn = function(next) {
        callback();
        next();
    }
    var type = TASK_SYNC;
    return this._add(taskFn, type);
}

/**
 * 开始执行任务  异步任务执行的间隔
 * @param  {[type]} interval [description]
 * @return {[type]}          [description]
 */
Animation.prototype.start = function(interval) {
    if (this.state === STATE_START) {
        return this;
    }

    //如果任务链中没有任务，则返回
    if (!this.taskQueue.length) {
        return this;
    }
    this.state = STATE_START;
    this.interval = interval;
    this._runTask();
    return this;
}

/**
 * 添加一个同步任务，该任务就是回退到上一个任务，
 * 实现重复上一个任务的效率，可以定义重复的次数
 * @param  {[type]} times [description]
 * @return {[type]}       [description]
 */
Animation.prototype.repeat = function(times) {
    var me = this;
    var taskFn = function() {
        if (typeof times === 'undefined') {
            //无限回退到上一个任务
            me.index--;
            me._runTask();
            return;
        }
        if (times) {
            times--;
            //回退
            me.index--;
            me._runTask();
        } else {
            //达到重复次数,跳转到一个任务
            var task = me.taskQueue[me.index];
            me._next(task);
        }
    }
    var type = TASK_SYNC;

    return this._add(taskFn, type);
}

/**
 * 添加一个同步任务，相当于repeat（）更友好的接口，无限循环上一次任务
 * @return {[type]} [description]
 */
Animation.prototype.repeatForever = function() {
    return this.repeat();
}

/**
 * 设置当前任务执行结束后到下一个任务开始前的等待时间
 * @param  {[type]} time [description]
 * @return {[type]}      [description]
 */
Animation.prototype.wait = function(time) {
    if (this.taskQueue && this.taskQueue.length > 0) {
        this.taskQueue[this.taskQueue.length - 1].wait = time;
    }
    return this;
}

/**
 * 暂停当前异步定时任务
 * @return {[type]} [description]
 */
Animation.prototype.pause = function() {
	if(this.state === STATE_START){
		this.state = STATE_STOP;
		this.timeline.stop();
		return this;
	}
	return this;
}

/**
 * 重新执行上一次暂停的异步任务
 * @return {[type]} [description]
 */
Animation.prototype.restart = function() {
	if(this.state === STATE_STOP){
		this.state = STATE_START;
		this.timeline.restart();
		return this;
	}
	return this;
}

/**
 * 释放资源
 * @return {[type]} [description]
 */
Animation.prototype.dispose = function() {
	if(this.state!==STATE_INITIAL){
		this.state = STATE_INITIAL;
		this.taskQueue = null;
		this.timeline.stop();
		this.timeline = null;
		return this;
	}
	return this;
}

/**
 * 添加一个任务到任务队列中
 * @param {[type]} taskFn 任务方法
 * @param {[type]} type   任务类型
 */
Animation.prototype._add = function(taskFn, type) {
    this.taskQueue.push({
        taskFn: taskFn,
        type: type
    });

    return this;
}

/**
 * 执行任务
 * @return {[type]} [description]
 */
Animation.prototype._runTask = function() {
    if (!this.taskQueue || this.state !== STATE_START) {
        return;
    }
    //任务执行完毕
    if (this.index === this.taskQueue.length) {
        this.dispose();
        return;
    }
    //获得任务链上的当前任务
    var task = this.taskQueue[this.index];
    if (task.type === TASK_SYNC) {
        this._syncTask(task);
    } else {
        this._asyncTask(task);
    }
}

/**
 * 同步任务
 * @param  {[type]} task [description]
 * @return {[type]}      [description]
 */
Animation.prototype._syncTask = function(task) {
    var me = this;
    var next = function() {
        //切换到下一个任务
        me._next(task);
    };
    var taskFn = task.taskFn;
    taskFn(next);
}

/**
 * 异步任务
 * @param  {[type]} task [description]
 * @return {[type]}      [description]
 */
Animation.prototype._asyncTask = function(task) {
    var me = this;
    //定义每一帧执行的回调函数
    var enterFrame = function(time) {
        var taskFn = task.taskFn;
        var next = function() {
            //停止当前任务
            me.timeline.stop();
            //执行下一个任务
            me._next(task);
        }
        taskFn(next, time);
    }

    this.timeline.onenterframe = enterFrame;
    this.timeline.start(this.interval);
}

/**
 * 切换到下一个任务,支持如果当前任务需要等待，则延时执行
 * @param  {[type]} task [description]
 * @return {[type]}      [description]
 */
Animation.prototype._next = function(task) {
    this.index++;
    var me = this;
    task.wait ? setTimeout(function(){
    	me._runTask();
    }, task.wait) : this._runTask();
}

module.exports = function(){
	return new Animation();
}