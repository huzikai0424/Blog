import React, { Component } from 'react';
import axios from 'axios'

module.exports = class Comment extends Component{
    constructor(props) {
        super(props);
        this.submitComment = this.submitComment.bind(this)
        this.changeEvent = this.changeEvent.bind(this)
       
        this.state = {
            comment:"",
            nickname:"",
            email:"",
            website:"" ,
            comments:[]
        };
    }
    
    componentDidMount() {
        axios.get('/getCommentList').then((data)=>{
            this.setState({
                comments:data.data
            })
        })
            
      
    }
    
    submitComment(){
        console.log(this.state)
        axios.post('/submitComment', {
            data:this.state
        })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    changeEvent(e){
       
        const value = event.target.value
        const name = event.target.id
        
        this.setState({
            [name]: value
        })
    }
    render(){
       let result = this.state.comments.map((obj,index)=>{
            let Md5email = require('crypto').createHash('md5').update(obj.email).digest('hex')
            return(
            <li className="comment-main">
                <div className="author-info">
                       <img src={`//secure.gravatar.com/avatar/${Md5email}?s=100`}/>
                    <p><a href={obj.website} target="_blank">{obj.nickname}</a><span>{obj.ua}</span></p>
                    <p className="comment-time">{obj.createdAt}</p>
                </div>
                    <div className="comment-body">
                    {obj.detail}
                </div>
            </li>)
       })
            
        
        return(
            <div>
                <h2>发表评论</h2>
                <p className="islogin">已登入为admin。登出？</p>
                <textarea className="commentbody" id="comment" name="comment" rows="5" placeholder="留下来说几句吧..." value={this.state.comment} required onChange={this.changeEvent}></textarea>
                <div id="author-info">
                    <input id="nickname" placeholder="昵称" type="text" required onChange={this.changeEvent} value={this.state.nickname} />
                    <input id="email" placeholder="邮箱" type="text" onChange={this.changeEvent} value={this.state.email} />
                    <input id="website" placeholder="网站" type="text" onChange={this.changeEvent} value={this.state.website} />
                    <button id="submit" onClick={this.submitComment}>发表评论</button>
                </div>
                <h3>{this.state.comments.length ? `共 ${this.state.comments.length} 条评论`:"暂无评论"}</h3>
                <div id="commentBox">
                    <ul class="commentList">
                        {result}
                    </ul>
                </div>
            </div>
        )
    }
}
