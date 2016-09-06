var http = require('http')
var querystring = require('querystring')

var postData = querystring.stringify({
    'content':'正在学习，老师能不能解读下常用模块以及模块下主要方法',
    'cid':348,
})

var options = {
    hostname:'www.imooc.com',
    port:80,
    path:'/course/docomment',
    method:'POST',
    headers:{
        'Accept':'application/json, text/javascript, */*; q=0.01',
        'Accept-Encoding':'gzip, deflate',
        'Accept-Language':'zh-CN,zh;q=0.8',
        'Connection':'keep-alive',
        'Content-Length':postData.length,
        'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
        'Cookie':'imooc_uuid=47a75138-500f-41ef-a05a-16eeacadabf4; imooc_isnew_ct=1465291668; loginstate=1; apsid=ZlM2U3NGQyMWI4MWE5ZWUxOTAxNGUyZGJhMjUwNTMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMzcyMTY1NQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABjY3dhbmdxaXVzaGVuZ0AxNjMuY29tAAAAAAAAAAAAAGRlZTE5NDhkNWNkNjY0ZDVmYjY2MjM1NmZiNTdmZTQz9TWsV%2FU1rFc%3DZD; last_login_username=ccwangqiusheng%40163.com; PHPSESSID=f27uv8hmulrkbpusrcc2vjt6e1; bdshare_firstime=1473139394134; imooc_isnew=2; cvde=57ce2ec451599-19; IMCDNS=0; Hm_lvt_f0cfcccd7b1393990c78efdeebff3968=1471504637,1472804950,1473036783,1473130181; Hm_lpvt_f0cfcccd7b1393990c78efdeebff3968=1473143484',
        'Host':'www.imooc.com',
        'Origin':'http://www.imooc.com',
        'Referer':'http://www.imooc.com/comment/348',
        'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.75 Safari/537.36',
        'X-Requested-With':'XMLHttpRequest'
    }
}


var req = http.request(options ,function (res) {
    console.log('Status:' + res.statusCode)
    console.log('headers:' + JSON.stringify(res.headers))

    // 因为是以流的形式读取数据，所以是Buffer
    res.on('data' ,function (chunk) {
        console.log(Buffer.isBuffer(chunk))
        console.log(typeof chunk)
    })

    res.on('end' ,function () {
        console.log('评论完毕！')
    })   

    res.on('error' ,function (e) {
    console.log('Error：' + e.message)
    })
})
    


// 发起请求
req.write(postData)
// 请求结束
req.end()
