---
title: react ajax渲染
description: Nothing to see here
text: hello world
date: 2016/04/24
---

```
<!DOCTYPE html>
<html>

<head>
    <script src="build/react.js"></script>
    <script src="build/react-dom.js"></script>
    <script src="build/browser.min.js"></script>
    <script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"></script>
</head>

<body>
    <div id="example"></div>
    <script type="text/babel">
    class List extends React.Component{
        constructor(props){
            super(props);
            this.state={ data:[] }
        }
        componentDidMount(){
            /* var that=this
            $.getJSON("./date.json",function(result){
            that.setState({
                    data:result.data
                })
            }) */
            var that=this;
            var xhr = new XMLHttpRequest();
            xhr.open('GET',"./date.json",true);
            xhr.onreadystatechange = function(){
               if(xhr.readyState==4&&xhr.status==200||xhr.status==304){
                    var result = JSON.parse(xhr.responseText)
                    that.setState({
                        data:result.data
                    })
                }
            }
            xhr.send();
        }
        render(){
            var result = this.state.data.map((obj,index)=> 
                <tr key={index}>
                    <th>{obj.fenlei}</th>
                    <th>{obj.mingcheng}</th>
                    <th>{obj.writer}</th>
                    <th>{obj.time}</th>
                </tr>
            )
            return <tbody>{result}</tbody>
        }
    }
    function Showtable(){
        return (
            <table>
                <thead>
                    <tr>
                        <td>分类</td>
                        <td>物品名</td>
                        <td>博主</td>
                        <td>发布时间</td>
                    </tr>
                </thead>
                <List />
            </table>
        )
    }
    const element =<Showtable />
    ReactDOM.render(
        element,
        document.getElementById("example")
    )
    </script>
</body>

</html>
```

表单绑定：
```
<!DOCTYPE html>
<html>

<head>
    <script src="build/react.js"></script>
    <script src="build/react-dom.js"></script>
    <script src="build/browser.min.js"></script>
</head>

<body>
    <div id="example"></div>
    <script type="text/babel">
    class Form extends React.Component{
        constructor(props){
            super(props)
            this.state={
                name:"",
                sex:"",
                password:""
            }
            this.changeEvent=this.changeEvent.bind(this)
        }
        /* clickEvent(event){
            this.setState({
                name:
            })
        } */
        changeEvent(event){
           console.log(event.target)
           const value = event.target.value
           const name = event.target.name
           
           this.setState({
               [name]:value
           })
        }
        render(){
            return(
            <div>
                <form>
                    昵称：<input type="text" name="name" required value={this.state.name} onChange={this.changeEvent}/><br />
                    性别：<input type="radio" name="sex" value="0" onChange={this.changeEvent} required/>男
                          <input type="radio" name="sex" value="1" onChange={this.changeEvent} required />女<br />
                    密码：<input type="password" name="password" value={this.state.password} onChange={this.changeEvent} required /><br />
                          <input type="submit" value="提交"  />
                </form>
                <hr />
                昵称：<span>{this.state.name}</span><br/>
                性别:<span>{this.state.sex}</span><br/>
                密码：<span>{this.state.password}</span><br/>
            </div>
            )
        }
    }
    ReactDOM.render(
        <Form />,
        document.getElementById("example")
    )
    </script>
</body>

</html>
```