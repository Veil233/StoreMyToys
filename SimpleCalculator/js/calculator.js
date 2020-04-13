/**
 * 切换日间/夜间模式
 */
function changeStyle(){
    var changeButton=document.getElementById("change");
    var bgcolor=document.getElementById("changeButtonDiv");
    var Mode=document.getElementById("mode");
    var modeStr=Mode.href;
    var start=modeStr.lastIndexOf("/")+1;
    var end=modeStr.lastIndexOf(".");
    var mode=modeStr.slice(start,end);
   if (mode=="whiteCal"){
       Mode.href="css/darkCal.css";
       changeButton.style.top="30px";
       bgcolor.style.background="aqua";
   }
   else {
       Mode.href="css/whiteCal.css";
       changeButton.style.top="0";
       bgcolor.style.background="white";
   }
}


/**
 *计算
 */
var button=document.getElementsByClassName("button");
var answerArea=document.getElementById("answerArea");
var expression=[];//存值

/**
 * 判断视窗区是否为空
 * @returns {boolean}
 */
function isEmpty() {
    return answerArea.innerText == "";
}

/**
 * 为每个按钮添加点击事件并处理
 */
for (let i=0;i<button.length;i++){
    button[i].onclick=handleInput;//添加点击事件
    //处理输入
    function handleInput() {
        var thisValue=this.innerHTML;//被点击的按钮的值（即当前值）
        var lastValue=expression[expression.length-1];//将栈顶的值保存（即上一次操作的值）
        // 需要用expression.length 而不是length,length=1
        if ( !isNaN(thisValue) ) {//如果输入的是数字
            displayAndSave(thisValue,!isEmpty());//显示值并保存
            if ( !isNaN(lastValue) )     combineNumber(lastValue,thisValue);//如果上一次输入也是数字则合并
           else if (lastValue==".")     combineFloat(thisValue);//如果上一次输入了“.",则需要处理小数
        }

        else {//输入的不是数字,而是操作符
            if (!isEmpty()) {
                switch (thisValue) {
                        case"←" :   backspace();                          break;
                        case "C" :  clear();                                    break;
                        case "()" :  fillBrackets(true);         break;
                        case "=":   cal();                                       break;
                    default  :
                            //如果上一次输入的是数字或是括号，则可以输入+-*/.，否则报错
                            if ( !isNaN(lastValue) || lastValue=="(" || lastValue==")" )  displayAndSave(thisValue,true);
                            else alert("不能连续输入两次运算符！");
                            break;
                    }
            }
            else {//只允许先输入括号
                    if (thisValue=="()")     fillBrackets(false);
                    else    alert("上来就想操作？");
            }
        }
        console.log("输入了"+thisValue+"\t上一次输入了:"+lastValue);
        console.log("表达式:"+expression);
    }
}

/**
 * 处理连续输入的数字
 * @param lastValue
 * @param thisValue
 */
function combineNumber(lastValue,thisValue) {
    var temp="";
    temp = lastValue + thisValue;//把上一次和这一次的值合成一个字符串
    expression.pop();//弹出thisValue
    expression.pop();//弹出lastValue
    expression.push(temp);//压入新数
    console.log("整数处理后的expression："+expression);
}

/**
 * 处理小数
 * @param thisValue
 */
function combineFloat(thisValue) {
    var lastLastValue=expression[expression.length-3];//小数点前的数字
    // -1是小数点后的数字，-2是小数点，-3是小数点前的数字
    var temp="";
    console.log("小数点前的数字："+lastLastValue);
    temp=temp+lastLastValue+"."+thisValue;
    expression.pop();//弹出小数点后的数字
    expression.pop();//弹出小数点
    expression.pop();//弹出小数点钱的数字
    expression.push(temp);//压入合并后的小数
    console.log("小数处理后的expression："+expression);
}

/**
 * 清屏
 */
function clear() {
    answerArea.innerHTML="";
    expression=[];
}

/**
 * 退格
 */
function backspace() {
    //表达式的长度为1则清零，否则将截取表达式的第一位到倒数第二位，实现退格
    answerArea.innerText=answerArea.innerText.length==1 ? "" : answerArea.innerText.substr(0,answerArea.innerText.length-1);
    expression.pop();//删除最末尾的值
}

/**
 * 填写括号
 */
function fillBrackets(isSave) {
    //没左括号先写左括号，有则写右括号
    if ( answerArea.innerText.indexOf("(")==-1 )  displayAndSave("(",isSave);
    else    displayAndSave(")",isSave);
}

/**
 * 将按下的按钮的值显示在answerArea中,并存入expression[]
 * @param value 显示的值， isSave 是否保留AnswerArea中的值 : true->在其后显示；false->替换原有值
 */
function displayAndSave(value , isSave) {
    expression.push(value);
    if (isSave)     answerArea.innerHTML +=value;
    else    answerArea.innerHTML =value;
}

/**
 *计算
 */
function cal() {
    if (isEmpty()){
        alert("先按=？不对吧！")
    }
    else {
        var preExpression=[];
        var result=[];//计算结果
        var i=0;
        var top=0;
        var sub=0;
         try{
            console.log("开始计算");
            preExpression=handleExpression();//处理表达式
            var length=preExpression.length;
            var value=0;
            for ( let i=0 ; i<length ; i++   ){//从左向右遍历
                if ( !isNaN(preExpression[i]) ){//读取到数字根据其中是否有小数点判断转换类型后压入result
                    if ( preExpression[i].indexOf(".")==-1 )      value=parseInt(preExpression[i]);
                    else    value=parseFloat(preExpression[i]);
                    result.push(value);
                }
                else {//读取到运算符
                    top=result.pop();//栈顶元素
                    sub=result.pop();//次顶元素
                    result.push( compute(top,sub,preExpression[i]) );
                }
            }
            answerArea.innerHTML+="<p>="+result[0]+"</p>"
        }
       catch {
            alert("发生了问题，没得到答案，再来一次试试？");
            clear();
        }
    }
}


/**
 * 计算运算符优先级
 * @param thisOperator
 * @returns {number} 乘除返回2，加减返回1
 */
function computePriority(thisOperator) {
   if ( thisOperator=="*" || thisOperator=="/" )  return 2;
   else if ( thisOperator=="+" || thisOperator=="-" ) return 1;
   else return 0;
}


/**
 * 处理表达式
 * @returns {[]}
 */
function handleExpression() {
    console.log("开始转换表达式。原表达式为："+expression+"，长度为："+expression.length);
    var preExp=[];
    var operator=[];

    //将中缀表达式转换为前缀表达式
    for ( let i=expression.length-1 ; i>=0 ; i-- ){//从右到左遍历expression
        if ( !isNaN(expression[i]) ){//读取到操作数，入栈
            preExp.push(expression[i]);
            console.log("temp="+preExp+"\t operator="+operator);
        }
        else {//读取到非数字字符
            if ( operator=="" || operator[operator.length-1]==")" ){//operator为空或栈顶为 ）右括号 则直接入栈
                operator.push(expression[i]);
            }
            else {//operator不为空且栈顶不是）右括号
                if ( expression[i]=="(" ){//是左括号
                    while ( operator[operator.length-1] !== ")" ){
                        //将operator栈顶元素压入temp直到遇到 ）右括号
                        preExp.push(operator.pop());
                    }
                   operator.pop();//弹出）右括号
                }
                else if ( expression[i]==")" ){//是右括号，直接入栈
                    operator.push(expression[i]);
                }
                else {//是运算符
                    while ( operator[operator.length-1] !== ")" || operator.length>0){//将这个运算符与栈顶的运算符比较优先级，直到栈顶的不是运算符为止
                        if (computePriority(expression[i]) >= computePriority(operator[operator.length - 1])) {
                            operator.push(expression[i]);//如果当前运算符优先级大于等于栈顶运算符,直接入栈
                            break;
                        }
                        else {//如果当前运算符优先级低于栈顶运算符，则将栈顶运算符弹出，然后压入temp
                            preExp.push(operator.pop());
                        }
                    }
                }
            }
        }
    }
    while( operator.length>0 ){//将operator所有元素弹出并压入preExp中
        preExp.push(operator.pop());//得到是反向的前缀表达式，在计算结果时从左向右遍历即可
    }
    console.log("处理后的表达式="+preExp);
    return preExp;
}

/**
 * 中间计算
 * @param top   栈顶元素
 * @param sub   次顶元素
 * @param operator  运算符
 * @returns {number}    结果
 */
function compute(top,sub,operator) {
    var result=0;
    switch (operator) {
        case "+" :  result=top+sub ;    break;
        case "-"  :  result=top-sub ;     break;
        case "*"  :  result=top*sub ;     break;
        case "/"  :
            try{
                result=top/sub ;
            }
            catch (e) {
                console.log(e.error);
            }
            break;
    }
    result=result.toFixed(5);
    return result;
}