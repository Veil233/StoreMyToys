/**
 * 封装ajax
 * @param option{ url , data , type , success() }
 * data=param1&param2&...
 */
function ajax(option) {
    option=option || {}//如果没有设置默认为空对象
    option.type=option.type || "get"//默认请求格式为get

    var xhr

    //创建
    if (window.XMLHttpRequest){
        xhr=new XMLHttpRequest()
    }
    else {
        xhr=new ActiveXObject('Microsoft.XMLHTTP')
    }

    //连接&发送
    if ( option.type == 'get' ){
        xhr.open("get", `${option.url}?{option.data}` , true )
        xhr.send()
    }
    else if ( option.type == 'post' ){
        xhr.open("post" , option.url , true)
        xhr.setRequestHeader("Content-Type" , "application/x-www-form-urlencoded")
        xhr.send(option.data)
    }

    //接收
    xhr.onreadystatechange=function () {
        if ( xhr.readyState == 4 && xhr.status == 200 ){
            console.log("response from server : "+xhr.responseText)
            option.success( xhr.responseText )
        }
        else {
            console.log(xhr.error)
        }
    }
}