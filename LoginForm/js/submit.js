window.onload=function () {
    //支持localstorage
    if (window.localStorage){
        console.log("support localstorage")
        //本地存有用户信息
        if (localStorage.getItem( "user" ) ){
            var username=localStorage.getItem("user")
            console.log("find user info : "+username)
            var type=getTypeOfUsername(username)
            var option={
                type : "post",
                url : "http://localhost:8080/autoLogin",
                data : `type=${type}&username=${username}`,
                success(response){
                    console.log(response)
                    if ( response=="success" )   alert("登录成功")
                    else if( response=="failed" ) alert("登录失败")
                }
            }
            ajax(option)
        }
    }
    else alert("您的浏览器不支持localstorage，建议使用chrome浏览器")
}

/**
 * 判断登录的用户名类型是手机号、用户名还是邮箱
 * @param username
 * @returns {string}
 */
function getTypeOfUsername(username) {
    var type=""
    if (username.includes("@")) type="email"
    else if ( Number(username) && username.length==11 ) type="phone"
    else type="name"
    console.log("type="+type)
    return type
}

function login(){
    var username=$("#userName")[0].value
    var password=$("#password")[0].value
    var type=getTypeOfUsername(username)

    var option={
        type : "post",
        url : "http://localhost:8080/login",
        data : `type=${type}&username=${username}&password=${password}`,
        success(response){
            console.log(response)
            if ( response=="success" )   {
                if ($("#isRemember").prop("checked") ){
                    if ( !localStorage.getItem("user") ){
                        localStorage.setItem("user" , username)
                        console.log("remember : username="+localStorage.getItem("user"))
                    }
                    else {
                        console.log(`remove user : ${localStorage.getItem("user")}`)
                        localStorage.removeItem("user")
                        localStorage.setItem("user" , username)
                        console.log(`update user : ${localStorage.getItem("user")}`)
                        alert("检测到本地已存在登录信息，已覆盖")

                    }
                }
                alert("登录成功")
            }
            else if( response=="failed" ) alert("登录失败")
        }
    }
    ajax(option)
    return false
}


function signUp() {
    var username=$("#singUserName")[0].value
    var password=$("#signPassword")[0].value
    var confirm=$("#confirmPassword")[0].value
    var phone=$("#phone")[0].value
    var email=$("#email")[0].value
    var check=false

    for ( let item in legal){
        if (legal[item]==true) check=true
        else {
            check=false
            break
        }
    }

    if (check){
        var option={
            type : "post",
            data : `username=${username}&password=${password}&phone=${phone}&email=${email}`,
            url : "http://localhost:8080/signUp",//这里写node.js监听的端口
            success(response){
                console.log(response)
                if ( response =="success" ) alert("注册成功")
                else if ( response=="failed" )alert("注册失败")
            },
        }
        ajax(option)
    }
    else alert("好好看看是不是哪里不对")
    return false
}

/**
 * 提交表单时检查表单数据合法性
 * 默认全false
 * 所有检测项都满足设为true，不满足为false
 * @type {{confirm: boolean, password: boolean, phone: boolean, email: boolean, username: boolean}}
 */
var legal={
    username : false,
    password : false,
    confirm : false,
    phone : false,
    email : false,
}


/**
 * 检查用户名合法性
 * @param username
 */
function checkUsername(username) {
    var hint=$("#nameHint")
    if (username.length>16){
        hint.show()
        hint[0].innerHTML="用户名过长"
    }
    else hint.hide()
    if (/[^0-9A-Za-z]/.test(username)){
        hint.show()
        hint[0].innerHTML="非法字符"
    }
    else hint.hide()
    legal.username=true
}




/**
 * 判断密码合法性及强度
 * @param password
 */
function passStrength(password) {
    var level=0
    var length=password.length
    var hint=$("#passHint")
    var [weak , normal , strong , perfect] = [ $("#weak") , $("#normal") , $("#strong") , $("#perfect")]
    hint.hide()

    //判断密码长度
    if (length>16) {
        hint[0].innerHTML="密码过长"
        hint.show()
    }
    else if(length<6){
        hint[0].innerHTML="密码过短"
        hint.show()
    }
    else {
        //判断密码强度
        if ( /[0-9]/.test(password) )   level++
        if ( /[a-z]/.test(password) )  level++
        if ( /[A-Z]/.test(password) )  level++
        if ( /\./.test(password) )  level++
        if( /[^a-zA-Z0-9\.]/.test(password) ) {
            hint[0].innerHTML="出现非法字符"
            hint.show()
        }
        else legal.password=true
    }

    //密码强度提醒
    if (level>=1) weak.show()
    else weak.hide()
    if (level>=2) normal.show()
    else normal.hide()
    if (level>=3) strong.show()
    else strong.hide()
    if (level==4) perfect.show()
    else perfect.hide()

    return true
}

/**
 * 判断两次密码是否一致
 * @param confirmPass
 */
function confirmPass(confirmPass) {
    var hint=$("#confirmHint")
    var length=confirmPass.length
    hint.show()
    if (length>16) {
        hint[0].innerHTML="密码过长"
        hint.show()
    }
    else if(length<6){
        hint[0].innerHTML="密码过短"
    }
    else{
        if( confirmPass == $("#signPassword")[0].value ){
            hint[0].innerHTML="两次密码一致"
            legal.confirm=true
        }
    }
}


function checkPhone(phone) {
    var hint=$("#phoneHint")
    hint.show()
   if ( phone.length==11 && /[0-9]/.test(phone) ) {
       hint.hide()
       legal.phone=true
   }
}

function checkEmail(email) {
   var completeEmail=$(".completeEmail")
    var hint=$("#emailHint")
    if (email == "")    hint.hide()//文本框为空，隐藏提示
    if ( email.includes("@") ) {
        if (/\.com$/.test(email)) {//有@且结尾是.com才是有效的电子邮箱
            legal.email = true
        }
        else hint[0].innerHTML=="无效的电子邮箱"
    }
    else {//文本框内没有@显示提示
        hint.show()
        completeEmail[0].innerHTML = `${email}@qq.com`
        completeEmail[1].innerHTML = `${email}@163.com`
        completeEmail[2].innerHTML = `${email}@126.com`
        completeEmail[3].innerHTML = `${email}@gmail.com`
    }
}
function completeEmail(email) {
    console.log(email)
    $("#email")[0].value=email//input 赋值用value 其他用innerHTML
}
