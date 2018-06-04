import React, { Component } from 'react';
import axios from 'axios'
const parser = require('ua-parser-js')
module.exports = class Comment extends Component{
    constructor(props) {
        super(props);
        this.submitComment = this.submitComment.bind(this)
        this.changeEvent = this.changeEvent.bind(this)
        this.formatTime = this.formatTime.bind(this)
        this.reply = this.reply.bind(this)
        this.getCommentList = this.getCommentList.bind(this)
        this.state = {
            comment:"",
            nickname:"",
            email:"",
            website:"" ,
            comments:[],
            placeholder:"留下来说几句吧...",
            currentPage:1,
            commentList: this.props.data.data.commentList
        };
    }
    
    componentDidMount() {
        let commentsInfo = JSON.parse(localStorage.getItem('commentInfo'))
        if (commentsInfo){
            let email = commentsInfo.email
            let nickname = commentsInfo.nickname
            let website = commentsInfo.website
            this.setState({email,nickname,website})
        }
        console.log(this.props.data)
        // getCommentList()
        // axios.get('/getCommentList').then((data)=>{
        //     this.setState({
        //         comments:data.data
        //     })
        // })
        //console.log(this.props.data.data)
    }
    getCommentList(page,pageSize){
        const id = this.props.data.id
        const that = this
        if (this.state.currentPage==page){
            return
        }
        axios.get(`/getCommentList/${id}?page=${page}&pageSize=${pageSize}`)
        .then(function (response) {
            if (response.statusText == "OK") {
                that.setState({
                    commentList: response.data.data,
                    currentPage: Number(response.data.page)
                })
            } else {
                console.log(`错误${response.data.message}`)
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    submitComment(){
        console.log(this.state)
        const data = this.state
        axios.post('/submitComment', {
            data: data,
            id:this.props.data.id
        })
        .then(function (response) {
            if (response.data.affectedRows && response.statusText=="OK"){
                let commentsInfo = {
                    email:data.email,
                    nickname:data.nickname,
                    website:data.website
                }
                commentsInfo = JSON.stringify(commentsInfo)
                localStorage.setItem("commentInfo", commentsInfo)
                if (parser(navigator.userAgent).browser.name == "WeChat") //fuck WeChat！ 
                    window.location.href = location.href + '?time=' + ((new Date()).getTime());
                else
                    location.reload()
            }else{
                console.log(`错误${response.data.message}`)
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
        let result = this.state.commentList.map((obj,index)=>{
            
            let Md5email = require('crypto').createHash('md5').update(obj.email).digest('hex')
            let ua = parser(obj.ua)
            return(
            <li className="comment-main" key={index} data-commentId={obj.id}>
                <div className="author-info">
                    <img src={`//secure.gravatar.com/avatar/${Md5email}?s=100`}/>
                        <p>
                            <a href={obj.website} target="_blank"><span className="ua author-name">{obj.nickname}</span></a>
                            <span className="ua ua-browser">{`${ua.browser.name} ${ua.browser.major} `}</span>
                            <span className="ua ua-os">{`${ua.os.name} ${ua.os.version}`}</span>
                        </p>
                        <p className="comment-time">{this.formatTime(obj.timestamp)}</p>
                </div>
                    <div className="comment-body">
                    {obj.detail}
                </div>
                    <button class="reply" onClick={() => this.reply(obj.id, obj.nickname)}>回复</button>
            </li>)
        })
        let totalPage = Math.ceil(this.props.data.data.total / this.props.data.pageSize)
        let div = []
        for(let i = 1 ; i<= totalPage; i++){
            if (this.state.currentPage == i){
                div.push(<li className="active" onClick={()=>this.getCommentList(i,10)}>{i}</li>)
            }else{
                div.push(<li onClick={() => this.getCommentList(i, 10)}>{i}</li>)
            }
        }
        const nav = div.map((item)=>{
            return item
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
                <h3><span>{this.props.data.data.total ? `共 ${this.props.data.data.total} 条评论`:"暂无评论"}</span></h3>
                <div id="commentBox">
                    <ul className="commentList">
                        {result}
                    </ul>
                    <ul className="page-nav-commment">
                        {nav}
                    </ul>
                </div>
            </div>
        )
    }
}
