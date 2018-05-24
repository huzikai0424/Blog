/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50553
 Source Host           : localhost:3306
 Source Schema         : blog

 Target Server Type    : MySQL
 Target Server Version : 50553
 File Encoding         : 65001

 Date: 24/05/2018 17:20:26
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for articleinfo
-- ----------------------------
DROP TABLE IF EXISTS `articleinfo`;
CREATE TABLE `articleinfo`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `article_id` int(11) NOT NULL,
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `des` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `coverPic` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `type` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `readCount` bigint(20) NULL DEFAULT 0,
  `commentCount` bigint(20) NULL DEFAULT 0,
  `likeCount` bigint(20) NULL DEFAULT 0,
  `postTime` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updateTime` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `article_id`(`article_id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for articles
-- ----------------------------
DROP TABLE IF EXISTS `articles`;
CREATE TABLE `articles`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fileName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `posts` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `pathName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of articles
-- ----------------------------
INSERT INTO `articles` VALUES (1, '函数节流和函数防抖', '网上对函数节流和函数防抖的定义都各不相同。经常把节流说成防抖，把防抖说成节流。主要的原因是红皮书上的案例把市面上的函数防抖定义成了函数节流导致两者定义模糊不清。\r\n\r\n这里也不讨论对错，我以网上博客的定义为准。\r\n\r\n他们的作用：都是在X毫秒内把多个事件合并成一个\r\n## 函数防抖\r\n在x毫秒内把多个事件合并成一个，只执行最后一次（执行最后一次）\r\n\r\n应用场景：验证用户输入，监听`oninput`或者`onchange`事件，ajax搜索栏(百度好像不是这么做的 orz...)\r\n\r\n代码：\r\n```javascript\r\nfunction debounce(fn,delay){\r\n	var timeoutId=null;\r\n	return function(){\r\n		clearTimeout(timeoutId)\r\n		timeoutId = setTimeout(function(){\r\n			fn()\r\n		},delay500)\r\n	}\r\n}\r\n```\r\n\r\n效果是：如果滚动间隔小于500，不管怎么拖动滚动条，函数都会在你停止拖动500毫秒后输出`我执行了`\r\n## 函数节流\r\n在X毫秒内把多个事件合并成一个并且至少执行一次（执行第一次）\r\n\r\n应用场景：图片懒加载，下拉请求ajax等。\r\n\r\n代码：\r\n```javascript\r\nfunction throttle(fn,delay){\r\n	var isReady=true\r\n	return function(){\r\n		if(isReady){\r\n			isReady=false\r\n			setTimeout(function(){\r\n				fn()\r\n				isReady=true\r\n			},delay  500)\r\n		}\r\n	}\r\n}\r\n\r\n```\r\n\r\n效果是：如果滚动间隔小于500m，疯狂拖动滚动条，函数还是会以500毫秒一次的速度输出`我执行了`\r\n\r\n', 'javascript');
INSERT INTO `articles` VALUES (2, 'react ajax渲染', '```\r\n<!DOCTYPE html>\r\n<html>\r\n\r\n<head>\r\n    <script src=\"build/react.js\"></script>\r\n    <script src=\"build/react-dom.js\"></script>\r\n    <script src=\"build/browser.min.js\"></script>\r\n    <script src=\"https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js\"></script>\r\n</head>\r\n\r\n<body>\r\n    <div id=\"example\"></div>\r\n    <script type=\"text/babel\">\r\n    class List extends React.Component{\r\n        constructor(props){\r\n            super(props);\r\n            this.state={ data:[] }\r\n        }\r\n        componentDidMount(){\r\n            /* var that=this\r\n            $.getJSON(\"./date.json\",function(result){\r\n            that.setState({\r\n                    data:result.data\r\n                })\r\n            }) */\r\n            var that=this;\r\n            var xhr = new XMLHttpRequest();\r\n            xhr.open(\'GET\',\"./date.json\",true);\r\n            xhr.onreadystatechange = function(){\r\n               if(xhr.readyState==4&&xhr.status==200||xhr.status==304){\r\n                    var result = JSON.parse(xhr.responseText)\r\n                    that.setState({\r\n                        data:result.data\r\n                    })\r\n                }\r\n            }\r\n            xhr.send();\r\n        }\r\n        render(){\r\n            var result = this.state.data.map((obj,index)=> \r\n                <tr key={index}>\r\n                    <th>{obj.fenlei}</th>\r\n                    <th>{obj.mingcheng}</th>\r\n                    <th>{obj.writer}</th>\r\n                    <th>{obj.time}</th>\r\n                </tr>\r\n            )\r\n            return <tbody>{result}</tbody>\r\n        }\r\n    }\r\n    function Showtable(){\r\n        return (\r\n            <table>\r\n                <thead>\r\n                    <tr>\r\n                        <td>分类</td>\r\n                        <td>物品名</td>\r\n                        <td>博主</td>\r\n                        <td>发布时间</td>\r\n                    </tr>\r\n                </thead>\r\n                <List />\r\n            </table>\r\n        )\r\n    }\r\n    const element =<Showtable />\r\n    ReactDOM.render(\r\n        element,\r\n        document.getElementById(\"example\")\r\n    )\r\n    </script>\r\n</body>\r\n\r\n</html>\r\n```\r\n\r\n表单绑定：\r\n```\r\n<!DOCTYPE html>\r\n<html>\r\n\r\n<head>\r\n    <script src=\"build/react.js\"></script>\r\n    <script src=\"build/react-dom.js\"></script>\r\n    <script src=\"build/browser.min.js\"></script>\r\n</head>\r\n\r\n<body>\r\n    <div id=\"example\"></div>\r\n    <script type=\"text/babel\">\r\n    class Form extends React.Component{\r\n        constructor(props){\r\n            super(props)\r\n            this.state={\r\n                name:\"\",\r\n                sex:\"\",\r\n                password:\"\"\r\n            }\r\n            this.changeEvent=this.changeEvent.bind(this)\r\n        }\r\n        /* clickEvent(event){\r\n            this.setState({\r\n                name:\r\n            })\r\n        } */\r\n        changeEvent(event){\r\n           console.log(event.target)\r\n           const value = event.target.value\r\n           const name = event.target.name\r\n           \r\n           this.setState({\r\n               [name]:value\r\n           })\r\n        }\r\n        render(){\r\n            return(\r\n            <div>\r\n                <form>\r\n                    昵称：<input type=\"text\" name=\"name\" required value={this.state.name} onChange={this.changeEvent}/><br />\r\n                    性别：<input type=\"radio\" name=\"sex\" value=\"0\" onChange={this.changeEvent} required/>男\r\n                          <input type=\"radio\" name=\"sex\" value=\"1\" onChange={this.changeEvent} required />女<br />\r\n                    密码：<input type=\"password\" name=\"password\" value={this.state.password} onChange={this.changeEvent} required /><br />\r\n                          <input type=\"submit\" value=\"提交\"  />\r\n                </form>\r\n                <hr />\r\n                昵称：<span>{this.state.name}</span><br/>\r\n                性别:<span>{this.state.sex}</span><br/>\r\n                密码：<span>{this.state.password}</span><br/>\r\n            </div>\r\n            )\r\n        }\r\n    }\r\n    ReactDOM.render(\r\n        <Form />,\r\n        document.getElementById(\"example\")\r\n    )\r\n    </script>\r\n</body>\r\n\r\n</html>\r\n```', '');
INSERT INTO `articles` VALUES (3, 'README', '# kk-koa-framework\r\n## 安装	| Install\r\n```shell\r\n	$ npm init\r\n	$ npm install kk-koa-framework\r\n    $ kk-init\r\n```\r\n\r\n### 创建所需要的文件夹\r\n目录结构如下：\r\n```\r\n|-- kk-koa\r\n    |-- app.js    <-- 入口文件\r\n    |-- package-lock.json\r\n    |-- package.json\r\n    |-- assets	  <-- 静态资源存放路径\r\n    |-- config	\r\n    |   |-- routes.js    <-- 路由配置文件\r\n    |   |-- env\r\n    |       |-- base.js    <-- 环境配置文件\r\n	|-- src\r\n    |   |-- controller\r\n    |       |-- index.js    <-- 控制器文件\r\n    |-- views\r\n        |-- index.pug    <--pug 静态模板文件\r\n```\r\n\r\n## 初始化 | Init\r\n`app.js`作为一个默认的入口文件，只需简单的引入kk-koa框架并注册\r\n``` javaScript\r\nconst Koa = require(\'kk-koa-framework\')\r\nlet app = new Koa()\r\napp.setup().startup()\r\n```\r\n\r\n框架会自动完成各类初始化事件\r\n## 文件详解 | Detail\r\n#### `config/env/base.js`\r\n`base.js`作为一个环境配置文件，存放一些和环境有关的配置项\r\n示例代码：\r\n``` javaScript\r\nmodule.exports = {\r\n    session:{\r\n        adapter : \'redis\',\r\n        password:\'youknowthat\',\r\n        host: \'10.0.3.24\',\r\n        port : 6379,\r\n        db : 1,\r\n        ttl : 20 * 60,\r\n        prefix:\'kk/test\'\r\n    },\r\n    port:3344\r\n}\r\n```\r\n\r\n#### `src/controller/index.js`\r\n`controller`里面写对应的方法，示例代码如下：\r\n```javaScript\r\nmodule.exports.hello = async(ctx) => {\r\n    ctx.body=\"hello world\"\r\n    console.log(\"print...\")\r\n}\r\n```\r\n\r\n#### `config/routes.js`\r\n`routes.js`里面可以写各种路由规则，语法非常简单，示例代码如下：\r\n``` javaScript\r\nmodule.exports = {\r\n    \'post /login\':\'index.login\',\r\n    \'get /\':\'index.hello\'\r\n}\r\n```\r\n\r\n使用`module.exports`向外导出成模块。\r\n语法为一个json格式的键值对`key:value`\r\n    `key`: `请求类型(post,get) /路径`\r\n    `value`:调用的方法，值为一个对象。该值默认为`src/controller/index.js` 中导出的方法  \r\n如：`index/login`表示`cntroller`下的默认`index.js`文件中的`login`方法\r\n## 渲染pug文件\r\nPug语法可以参考：[Pug中文文档](https://pug.bootcss.com/language/attributes.html)\r\n\r\n假设`views/index.pug`默认如下\r\n``` Pug\r\ndoctype html\r\nhtml\r\n    head\r\n    body\r\n        .div Welcome To KK WEB FRAMEWORK\r\n        div Hello #{user.nickName}\r\n```\r\n\r\n要渲染pug文件，我们首先在`controller/index.js`里写对应的方法\r\n``` JavaScript\r\nmodule.exports.showHome = async(ctx) => {\r\n    ctx.state.user = {      //通过ctx.state转值\r\n        nickName:\"Lemon\",\r\n        age:21\r\n    }\r\n    await ctx.render(\'index\')   //通过ctx.render()完成渲染，默认为view目录，\r\n                                //传入的变量为文件名，默认文件后缀为.js\r\n}\r\n```\r\n\r\n然后在`config/routes.js`中写相应的路由：\r\n``` JavaScript\r\nmodule.exports = {\r\n   \'get /\':\'index.showHome\'\r\n}\r\n```\r\n\r\n随后我们运行app.js入口文件\r\n```shell\r\n$ node app.js\r\n```\r\n\r\n访问`localhost:3344` 可以看到pug模板文件已经被渲染并显示:\r\n```\r\nWelcome To KK WEB FRAMEWORK\r\nHello Lemon\r\n```\r\n\r\n## Post / Get请求\r\n做一个小小demo，模拟表单提交：\r\n```pug\r\ndoctype html\r\nhtml\r\n    head\r\n        title 欢迎你 --- #{user.username}\r\n    body\r\n        div #{text}\r\n        form(method=\"post\" action=\"/login\")\r\n            span post 请求\r\n            br\r\n            input(type=\"text\", name=\"username\" placeholder=\"please enter username\")\r\n            br\r\n            input(type=\"password\", name=\"password\" placeholder=\"please enter password\")\r\n            br\r\n            input(type=\"submit\", value=\"submit\")\r\n```\r\n\r\n在`controller`中写对应的方法\r\n```\r\nmodule.exports.showHome = async(ctx) => {\r\n    ctx.state.user = {     \r\n        nickName:\"Lemon\",\r\n        age:21\r\n    }\r\n    await ctx.render(\'index\')   \r\n}\r\n\r\nmodule.exports.getDate = async(ctx) => {\r\n    let {username,password} = ctx.request.body\r\n    ctx.body = {\r\n        username:username,\r\n        password:password\r\n    }\r\n    console.log(`username:${username}`)\r\n    console.log(`password:${password}`)\r\n}\r\n```\r\n\r\n写完`controller`后开始写对应的路由。\r\n路由有两种方式，一种是上文提到的写在`config/routes.js`\r\n\r\n```javaScript\r\nmodule.exports = {\r\n    \'get /\':\"index.showHome\",\r\n    \'post /login\':\'index.getDate\'\r\n}\r\n```\r\n\r\n或者直接在`controller`通过设置全局`meta`对象进行配置：\r\n\r\n``` javaScript\r\nmodule.exports.meta ={\r\n    getDate:{\r\n        url:\'/login\',\r\n        methods:[\'post\'],\r\n        bodyParser:true\r\n    }\r\n }\r\n```\r\n\r\n注意：通过这种方式定义的路由，如果要解析的参数传递方法为`post`，则需要在`controller`中配置`bodyParser:true`\r\n\r\n运行入口文件\r\n```shell\r\n$ node app.js\r\n```\r\n\r\n我们会看到控制台输出了`username`和`password`的值\r\n\r\n## session\r\n`kk-koa`框架将session存放在`radis`中，因此，使用session需要先安装并连接到`redis`\r\n### session配置\r\n在`/config/env/base.js`配置`redis`中的相应变量：\r\n```\r\nmodule.exports = {\r\n    session:{\r\n        adapter : \'redis\',\r\n        password:\'youknowthat\',\r\n        host: \'10.0.3.24\',\r\n        port : 6379,\r\n        db : 1,\r\n        ttl : 20 * 60,\r\n        prefix:\'kk/test\'\r\n    },\r\n    port:2333\r\n}\r\n```\r\n\r\n### session方法\r\n`session`是上下文`(Context)`中的一个对象，对象暴漏了几个常用的方法：\r\n`session.save()`  保存`session`\r\n`session.destroy()` 销毁`session`\r\n`session.refresh()` 刷新`session`防止过期\r\n\r\n小demo，模拟登陆注册，实现：\r\n如果未登陆，直接跳转到登陆界面。若已登录则显示登陆的用户名：\r\n`index.pug`\r\n```pug\r\ndoctype html\r\nhtml\r\n    head\r\n        title 欢迎你 --- #{username}\r\n    body\r\n        div 欢迎你 --- #{username}\r\n        a(href=\"/logout\") 注销\r\n\r\n```\r\n\r\n`login.pug`\r\n```\r\ndoctype html\r\nhtml\r\n    head\r\n        title 欢迎登陆\r\n    body\r\n        div #{title} , #{msg}\r\n        form(method=\"post\" action=\"/checklogin\")\r\n            br\r\n            input(type=\"text\", name=\"username\" placeholder=\"请输入你的用户名\")\r\n            br\r\n            input(type=\"password\", name=\"password\" placeholder=\"请输入你的密码\")\r\n            br\r\n            input(type=\"submit\", value=\"submit\")\r\n```\r\n\r\ncontroller控制器：controller/index.js \r\n```\r\nmodule.exports.showLogin = async(ctx) => {\r\n    await ctx.render(\"login\",{\r\n        title:\"你好\",\r\n        msg:\"欢迎登陆...\"\r\n    })\r\n}\r\nmodule.exports.checklogin= async(ctx)=>{\r\n    await ctx.render(\"index\")\r\n    let {username,password} = ctx.request.body\r\n    if( xxx ){ //写相应的判断 \r\n        ctx.response.redirect(\'/index\') //登陆成功后路由跳转\r\n        ctx.session.profile = {     //给session存入一些自定义字段\r\n            username:username,\r\n            isLogin:true\r\n        }\r\n        ctx.session.save()  //保存session到redis中\r\n    }else{\r\n        console.log(\"用户名或密码错误\")\r\n        ctx.response.redirect(\'/\')  //登陆失败，跳转到登陆界面\r\n    }\r\n}\r\nmodule.exports.show = async(ctx) => {\r\n    let session = ctx.session\r\n    let isEmpty = JSON.stringify(session)==\"{}\"?true:false\r\n    if(!isEmpty){   //判断是否存在session，不存在即为未登录\r\n        let isLogin = ctx.session.profile.isLogin\r\n        if(!isLogin){\r\n            console.log(\"你还未登陆\")\r\n            ctx.response.redirect(\"/\")\r\n        }else{\r\n            ctx.state={  //通过ctx.state传值给pug模板\r\n                username:ctx.session.profile.username\r\n            }\r\n            console.log(\"登陆成功\")\r\n            await ctx.render(\"index\")\r\n        }\r\n    }else{\r\n        console.log(\"你还未登陆\")\r\n        ctx.response.redirect(\"/\")\r\n    }\r\n}\r\nmodule.exports.logout = async(ctx) => {\r\n    ctx.session.destroy()   //销毁session\r\n    ctx.response.redirect(\'/\')\r\n}\r\n```\r\n\r\n路由：config/route.js\r\n```\r\nmodule.exports = {\r\n    \'get /\':\"index.showLogin\",\r\n    \'post /checklogin\':\"index.checklogin\",\r\n    \'get /index\':\"index.show\",\r\n    \'get /logout\':\"index.logout\"\r\n}\r\n```', '');

-- ----------------------------
-- Table structure for comments
-- ----------------------------
DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments`  (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `article_id` int(11) NOT NULL,
  `pid` int(10) NOT NULL DEFAULT 0,
  `nickname` tinytext CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `website` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `ua` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `detail` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `qq` int(11) NULL DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `article_id`(`article_id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 11 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of comments
-- ----------------------------
INSERT INTO `comments` VALUES (9, 0, 0, '123456', '1234', '45', 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36', 'pinglunceshi', NULL, '2018-05-03 18:01:40');
INSERT INTO `comments` VALUES (8, 0, 0, '213123', '380476852@qq.com', '', 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36', '博主你好呀', NULL, '2018-05-03 17:58:28');
INSERT INTO `comments` VALUES (7, 0, 0, '213123', '380476852@qq.com', '', 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36', '博主你好呀', NULL, '2018-05-03 17:58:19');
INSERT INTO `comments` VALUES (6, 0, 0, '柠檬酸', '380476852@qq.com', 'https://cherryml.com', 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36', '过来踩踩', NULL, '2018-05-03 17:56:57');
INSERT INTO `comments` VALUES (5, 0, 0, '哈哈哈', '44089306@qq.com', 'www.baidu.com', 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36', '博主你好呀', NULL, '2018-05-03 16:54:34');
INSERT INTO `comments` VALUES (10, 0, 0, '1', '1', '1', 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36', '1', NULL, '2018-05-03 18:02:04');

SET FOREIGN_KEY_CHECKS = 1;
