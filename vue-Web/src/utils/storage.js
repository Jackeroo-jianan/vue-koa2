/*
封装storage函数
key值为命名空间，value值为JSON.stringify()后的JSON格式字符串；
通过key设为命名空间的方式防止覆盖,实际上要删除的为value里的值
*/

import config from "../config"


//设置localStorage
const setItem=(key,val)=>{
    //获取key值,注意获取时格式是字符串，所以用JSON.parse方法改为json对象才能修改
    let storage = JSON.parse(window.localStorage.getItem(config.namespace) || "{}")

    //设置value值，注意key是变量，要用中括号
    storage[key] = val 

    //存入localStorage，注意存入时格式应为JSON字符串，所以用JSON.stringify方法
    window.localStorage.setItem(config.namespace,JSON.stringify(storage))
}

//获取某个item的value值
const getItem=(key)=>{
    //JSON.parse(a)[key]
    //a=>命名空间（key)下的value值,转为JSON对象后(JSON.parse),获取要查看的值([key])
    return JSON.parse(window.localStorage.getItem(config.namespace))[key] || ""
}

//删除某一个item
const clearItem=(key)=>{
    //获取要删除元素所在的命名空间的JSON对象
    let storage = JSON.parse(window.localStorage.getItem(config.namespace))

    //删除目标值，直接利用delete删除属性
    delete storage[key]

    //删除后的值，即key(namespace)--value 整个重新写入，实际上是覆盖了以前的命名空间了
    window.localStorage.setItem(config.namespace,JSON.stringify(storage))
}

//删除全部item
const clearAll=()=>{
    window.localStorage.clear()
}

export default {
    setItem,
    getItem,
    clearItem,
    clearAll,
    
}