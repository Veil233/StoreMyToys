//Filpper类，每个实例对应时间上的一位，即一个翻页的部分
var Flipper =/**@Class*/ (function () {
    function Flipper(node , currentTime , nextTime) {
        //this指向实例化的对象
        this.isFlipping=false;
        this.duration=600;
        this.flipNode=node;//.flipNumber
        this.frontNode=node.querySelector(".front");
        this.backNode=node.querySelector(".back");
        this .setFrontTime(currentTime);
        this.setBackTime(nextTime);
    }

    Flipper.prototype.setFrontTime=function (time) {
        this.frontNode.dataset.number=time;//设置front的data-number
    };
    Flipper.prototype.setBackTime=function (time) {
        this.backNode.dataset.number=time
    };

    /**
     * 前边显示当前时间，后边准备即将到来的时间
     * 给.flipNumber添加一个running类名，启动动画
     * 600ms（css中的动画时间）后，将.flipNumber的.running类名移除
     *前边显示即将到来的时间（即下一阶段的当前时间）
     */
    Flipper.prototype.flipDown=function (currentTime , nextTime) {
        var _this=this;
        this.isFlipping=true;
        this.setFrontTime(currentTime);//当前时间显示在前边
        this.setBackTime(nextTime);//后边准备即将到来的时间
        this.flipNode.classList.add("running");//给flipNumber添加running类，开始动画

        setTimeout(function () {
            _this.flipNode.classList.remove("running");
            _this.isFlipping=false;
            _this.setFrontTime(nextTime);
        } , this.duration);//600ms 后移除动画
    };
    return Flipper;
} () );

/**
 * 获取时间字符串
 * @param date 日期时间字符串 ， option 是否为十二小时制
 * @returns {string}
 */
var getTimeFromDate=function (date , option ) {
    var time= date
        .toTimeString()//时间=>字符串
        .slice(0,8)//取前八位hh:mm;ss
        .split(":")//根据：分隔成数组
        .join("");//=>字符串
    var hour=parseInt(time.slice(0,2));
    var rest=time.slice(2);
    var ampm=document.getElementById("ampm");

    //当选择十二小时制
    if(option){
        if ( hour>12 ){
            hour=hour-12;
            hour=formatHour(hour);
            time=hour+rest;
            ampm.innerText="PM";
        }
        else {
            hour=formatHour(hour);
            time=hour+rest;
            ampm.innerText="AM";
        }
    }
    else {
        hour=formatHour(hour);
        time=hour+rest;
    }
    return time;
};

function formatHour(hour) {
    hour=hour.toString();
    return hour.length==1? "0"+hour : hour;
}

//存放时钟每一位的实例化对象的数组
var flippers=[]
//是否是十二小时制
var isTwelve=false


/**
 * 初始化时钟
 * @param format 时间格式
 */
function initClock(format) {
    isTwelve=format ==12;
    var flips=document.querySelectorAll(".flipNumber");
    var now=new Date();
//当前时间（由于翻页，实际上是上一秒的时间）
    var nowTimeStr=getTimeFromDate( new Date(now.getTime()-1000) , isTwelve );
//即将到来的时间（实际上是当前时间）
    var nextTimeStr=getTimeFromDate( now , isTwelve );
//将节点集合转换为数组，为时间的每一位实例化Flipper对象，返回对象集合flippers
    flippers= Array.from(flips).map(function (flip , i) {
        return new Flipper(flip , nowTimeStr[i] , nextTimeStr[i]);
    });
}

/**
 * 每秒执行一次,为时钟的每一位判断是否应该翻转并执行翻转动画
 */
setInterval(flipEverySecond, 1000);
function flipEverySecond() {
    var now=new Date()
    var nowTimeStr=getTimeFromDate( new Date(now.getTime()-1000) , isTwelve);
    var nextTimeStr=getTimeFromDate(now , isTwelve);
    for (let i=0 ; i<flippers.length ; i++){
        //如果前后时间一样，也就是该位置上的时间没有变化，则跳过，进入下一次循环
        if (nowTimeStr[i] === nextTimeStr[i]) continue;
        flippers[i].flipDown(nowTimeStr[i] , nextTimeStr[i]);
    }
}

/**
 * 时钟设置
 */
//切换十二小时制
function toggleFormat () {
    var controlFormat=document.getElementById("controlFormat");
    var twelve=document.getElementById("twelve");
    if (controlFormat.checked) {
        twelve.style.display="block"
        initClock(12)
    }
    else{
        twelve.style.display="none"
        initClock(24)
    }

}
//切换秒钟显示
function toggleSecond() {
    var seconds=document.getElementsByClassName("second");
    var controlSecond=document.getElementById("controlSecond")
    console.log(controlSecond.checked)
    if (controlSecond.checked) {
        for( let second of seconds){
            second.style.display="none"
        }
    }
    else {
        for( let second of seconds){
            second.style.display="block"
        }
    }
}

//初始化时钟，默认24小时制
initClock(24)






