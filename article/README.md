---
title: kk-koa-framework文档
description: 使用文档
tags: kk-koa
date: 2017/05/24
---

# kk-koa-framework
## 安装	| Install
```shell
	$ npm init
	$ npm install kk-koa-framework
    $ kk-init
```

### 创建所需要的文件夹
目录结构如下：
```
|-- kk-koa
    |-- app.js    <-- 入口文件
    |-- package-lock.json
    |-- package.json
    |-- assets	  <-- 静态资源存放路径
    |-- config	
    |   |-- routes.js    <-- 路由配置文件
    |   |-- env
    |       |-- base.js    <-- 环境配置文件
	|-- src
    |   |-- controller
    |       |-- index.js    <-- 控制器文件
    |-- views
        |-- index.pug    <--pug 静态模板文件
```

## 初始化 | Init
`app.js`作为一个默认的入口文件，只需简单的引入kk-koa框架并注册
``` javaScript
const Koa = require('kk-koa-framework')
let app = new Koa()
app.setup().startup()
```

框架会自动完成各类初始化事件
## 文件详解 | Detail
#### `config/env/base.js`
`base.js`作为一个环境配置文件，存放一些和环境有关的配置项
示例代码：
``` javaScript
module.exports = {
    session:{
        adapter : 'redis',
        password:'youknowthat',
        host: '10.0.3.24',
        port : 6379,
        db : 1,
        ttl : 20 * 60,
        prefix:'kk/test'
    },
    port:3344
}
```

#### `src/controller/index.js`
`controller`里面写对应的方法，示例代码如下：
```javaScript
module.exports.hello = async(ctx) => {
    ctx.body="hello world"
    console.log("print...")
}
```

#### `config/routes.js`
`routes.js`里面可以写各种路由规则，语法非常简单，示例代码如下：
``` javaScript
module.exports = {
    'post /login':'index.login',
    'get /':'index.hello'
}
```

使用`module.exports`向外导出成模块。
语法为一个json格式的键值对`key:value`
    `key`: `请求类型(post,get) /路径`
    `value`:调用的方法，值为一个对象。该值默认为`src/controller/index.js` 中导出的方法  
如：`index/login`表示`cntroller`下的默认`index.js`文件中的`login`方法
## 渲染pug文件
Pug语法可以参考：[Pug中文文档](https://pug.bootcss.com/language/attributes.html)

假设`views/index.pug`默认如下
``` Pug
doctype html
html
    head
    body
        .div Welcome To KK WEB FRAMEWORK
        div Hello #{user.nickName}
```

要渲染pug文件，我们首先在`controller/index.js`里写对应的方法
``` JavaScript
module.exports.showHome = async(ctx) => {
    ctx.state.user = {      //通过ctx.state转值
        nickName:"Lemon",
        age:21
    }
    await ctx.render('index')   //通过ctx.render()完成渲染，默认为view目录，
                                //传入的变量为文件名，默认文件后缀为.js
}
```

然后在`config/routes.js`中写相应的路由：
``` JavaScript
module.exports = {
   'get /':'index.showHome'
}
```

随后我们运行app.js入口文件
```shell
$ node app.js
```

访问`localhost:3344` 可以看到pug模板文件已经被渲染并显示:
```
Welcome To KK WEB FRAMEWORK
Hello Lemon
```

## Post / Get请求
做一个小小demo，模拟表单提交：
```pug
doctype html
html
    head
        title 欢迎你 --- #{user.username}
    body
        div #{text}
        form(method="post" action="/login")
            span post 请求
            br
            input(type="text", name="username" placeholder="please enter username")
            br
            input(type="password", name="password" placeholder="please enter password")
            br
            input(type="submit", value="submit")
```

在`controller`中写对应的方法
```
module.exports.showHome = async(ctx) => {
    ctx.state.user = {     
        nickName:"Lemon",
        age:21
    }
    await ctx.render('index')   
}

module.exports.getDate = async(ctx) => {
    let {username,password} = ctx.request.body
    ctx.body = {
        username:username,
        password:password
    }
    console.log(`username:${username}`)
    console.log(`password:${password}`)
}
```

写完`controller`后开始写对应的路由。
路由有两种方式，一种是上文提到的写在`config/routes.js`

```javaScript
module.exports = {
    'get /':"index.showHome",
    'post /login':'index.getDate'
}
```

或者直接在`controller`通过设置全局`meta`对象进行配置：

``` javaScript
module.exports.meta ={
    getDate:{
        url:'/login',
        methods:['post'],
        bodyParser:true
    }
 }
```

注意：通过这种方式定义的路由，如果要解析的参数传递方法为`post`，则需要在`controller`中配置`bodyParser:true`

运行入口文件
```shell
$ node app.js
```

我们会看到控制台输出了`username`和`password`的值

## session
`kk-koa`框架将session存放在`radis`中，因此，使用session需要先安装并连接到`redis`
### session配置
在`/config/env/base.js`配置`redis`中的相应变量：
```
module.exports = {
    session:{
        adapter : 'redis',
        password:'youknowthat',
        host: '10.0.3.24',
        port : 6379,
        db : 1,
        ttl : 20 * 60,
        prefix:'kk/test'
    },
    port:2333
}
```

### session方法
`session`是上下文`(Context)`中的一个对象，对象暴漏了几个常用的方法：
`session.save()`  保存`session`
`session.destroy()` 销毁`session`
`session.refresh()` 刷新`session`防止过期

小demo，模拟登陆注册，实现：
如果未登陆，直接跳转到登陆界面。若已登录则显示登陆的用户名：
`index.pug`
```pug
doctype html
html
    head
        title 欢迎你 --- #{username}
    body
        div 欢迎你 --- #{username}
        a(href="/logout") 注销

```

`login.pug`
```
doctype html
html
    head
        title 欢迎登陆
    body
        div #{title} , #{msg}
        form(method="post" action="/checklogin")
            br
            input(type="text", name="username" placeholder="请输入你的用户名")
            br
            input(type="password", name="password" placeholder="请输入你的密码")
            br
            input(type="submit", value="submit")
```

controller控制器：controller/index.js 
```
module.exports.showLogin = async(ctx) => {
    await ctx.render("login",{
        title:"你好",
        msg:"欢迎登陆..."
    })
}
module.exports.checklogin= async(ctx)=>{
    await ctx.render("index")
    let {username,password} = ctx.request.body
    if( xxx ){ //写相应的判断 
        ctx.response.redirect('/index') //登陆成功后路由跳转
        ctx.session.profile = {     //给session存入一些自定义字段
            username:username,
            isLogin:true
        }
        ctx.session.save()  //保存session到redis中
    }else{
        console.log("用户名或密码错误")
        ctx.response.redirect('/')  //登陆失败，跳转到登陆界面
    }
}
module.exports.show = async(ctx) => {
    let session = ctx.session
    let isEmpty = JSON.stringify(session)=="{}"?true:false
    if(!isEmpty){   //判断是否存在session，不存在即为未登录
        let isLogin = ctx.session.profile.isLogin
        if(!isLogin){
            console.log("你还未登陆")
            ctx.response.redirect("/")
        }else{
            ctx.state={  //通过ctx.state传值给pug模板
                username:ctx.session.profile.username
            }
            console.log("登陆成功")
            await ctx.render("index")
        }
    }else{
        console.log("你还未登陆")
        ctx.response.redirect("/")
    }
}
module.exports.logout = async(ctx) => {
    ctx.session.destroy()   //销毁session
    ctx.response.redirect('/')
}
```

路由：config/route.js
```
module.exports = {
    'get /':"index.showLogin",
    'post /checklogin':"index.checklogin",
    'get /index':"index.show",
    'get /logout':"index.logout"
}
```