function ajax(option) {
    option=option || {}//如果没有设置默认为空对象
    option.type=option.type || "get"//默认请求格式为get
    option.dataType=option.dataType || "json"//默认响应数据格式为json

    var params=formatParams(option.data)//处理数据
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
        xhr,open("get" , `${option.url}?${params}` , true )
        xhr.send()
    }
    else if ( option.type == 'post' ){
        xhr.open("post" , option.url , true)
        xhr.setRequestHeader("Content-Type" , "application/x-www-form-urlencoded")
        xhr.send(params)
    }

    //接收
    xhr.onreadystatechange=function () {
        if ( xhr.readyState == 4 && xhr.status == 200 ){
            option.success( xhr.responseText)
        }
        else {
            console.log(xhr.error)
        }
    }
}

function formatParams(data) {
    var dataArr=[]
    for (let key in data){
        dataArr.push( `${ encodeURIComponent(key) }=${ encodeURIComponent( dataArr[name] ) }` )
    }
    dataArr.push(`id=${Math.random()}`)
    return dataArr.join("&")
}