import React, { Component } from 'react';
import axios from 'axios'

module.exports = class Comment extends Component{
    constructor(props) {
        super(props);
        this.submitComment = this.submitComment.bind(this)
        this.changeEvent = this.changeEvent.bind(this)
        this.formatTime = this.formatTime.bind(this)
        this.reply = this.reply.bind(this)
        this.state = {
            comment:"",
            nickname:"",
            email:"",
            website:"" ,
            comments:[],
            placeholder:"留下来说几句吧..."
        };
    }
    
    componentDidMount() {
        // axios.get('/getCommentList').then((data)=>{
        //     this.setState({
        //         comments:data.data
        //     })
        // })
        console.log(this.props.data)
    }
    
    submitComment(){
        console.log(this.state)
        axios.post('/submitComment', {
            data:this.state
        })
        .then(function (response) {
            if(response.data.success){
                console.log(response);
                location.reload()
            }else{
                console.log(`错误${response.data.err}`)
            }
           
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    formatTime(time){
        let date=new Date(time)
        let year = date.getFullYear();
        let month = date.getMonth()+1;
        let day = date.getDay()
        let hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
        let minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
        return `${year}年${month}月${day}日 ${hour}:${minute}`
    }
    reply(id,nickname){
        this.setState({ placeholder: `回复给: ${nickname}`})
        this.refs.comment.focus()
    }
    changeEvent(e){
        const value = event.target.value
        const name = event.target.id
        this.setState({
            [name]: value
        })
    }
    render(){
        let result = this.props.data.map((obj,index)=>{
            
            let Md5email = require('crypto').createHash('md5').update(obj.email).digest('hex')
            return(
            <li className="comment-main" key={index} data-commentId={obj.id}>
                <div className="author-info">
                    <img src={`//secure.gravatar.com/avatar/${Md5email}?s=100`}/>
                    <p><a href={obj.website} target="_blank">{obj.nickname}</a><span>chrome win10</span></p>
                        <p className="comment-time">{this.formatTime(obj.timestamp)}</p>
                </div>
                    <div className="comment-body">
                    {obj.detail}
                </div>
                    <button class="reply" onClick={() => this.reply(obj.id, obj.nickname)}>回复</button>
            </li>)
       })
            
        
        return(
            <div>
                <h2>发表评论</h2>
                <p className="islogin">已登入为admin。登出？</p>
                <textarea ref="comment" className="commentbody" id="comment" name="comment" rows="5" placeholder={this.state.placeholder} value={this.state.comment} required onChange={this.changeEvent}></textarea>
                <div id="author-info">
                    <input id="nickname" placeholder="昵称 (必填)" type="text" required onChange={this.changeEvent} value={this.state.nickname} />
                    <input id="email" placeholder="邮箱 (必填)" type="text" onChange={this.changeEvent} value={this.state.email} />
                    <input id="website" placeholder="网站 (选填)" type="text" onChange={this.changeEvent} value={this.state.website} />
                    <button id="submit" onClick={this.submitComment}>发表评论</button>
                </div>
                <h3><span>{this.props.data.length ? `共 ${this.props.data.length} 条评论`:"暂无评论"}</span></h3>
                <div id="commentBox">
                    <ul class="commentList">
                        {result}
                    </ul>
                </div>
            </div>
        )
    }
}
