/* 
    能发送ajax请求的函数模块
    函数的返回值是promise对象
*/
import axios from 'axios'
export default function ajax(url,data={},method='GET'){
    if(method==='GET'){ //发送GET请求
        //拼请求参数串
        //data:{username:tom,password:123}
        //paramStr:username=tom&password=123
        let paramStr = ''
        Object.keys(data).forEach(key => {
            paramStr += key + '=' + data[key] + '&'
        })
        if(paramStr){
            paramStr = paramStr.substring(0,paramStr.lastIndexOf('&'))
            url = url + '?' + paramStr
        }
        return axios.get(url)
    }else{
        return axios.post(url,data)
    } 
}