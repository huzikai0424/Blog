import React, { Component } from 'react';
import axios from 'axios'
import { Input, Select, Button, Form, Tooltip, Popconfirm, message} from 'antd'
const { TextArea } = Input
const Option = Select.Option
const FormItem = Form.Item
const parser = require('ua-parser-js')
class Comment extends Component{
    constructor(props) {
        super(props);
        this.formatTime = this.formatTime.bind(this)
        this.reply = this.reply.bind(this)
        this.getCommentList = this.getCommentList.bind(this)
        this.state = {
            placeholder:"留下来说几句吧...",
            currentPage:1,
            commentList: this.props.data.data.commentList,
            childComment:this.props.data.pidComment,
            replyId:null,
            isLogin: this.props.data.isLogin
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
                    currentPage: Number(response.data.page),
                    childComment: response.data.pidComment
                })
            } else {
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
    reply(id,nickname,detail,email){
        
        this.setState({ 
            placeholder: `回复给: ${nickname}`,
            replyId:id,
            replyNiceName: nickname,
            detail: detail,
            email: email
        })
        this.props.form.getFieldInstance('comment').focus()
       // this.comment.focus()
    }
    cancelReply=()=>{
        this.setState({
            placeholder: "留下来说几句吧...",
            replyId: null,
        })
    } 
    delete(id,pid){
        let arr = [id]
        axios.post('/deleteComments', {
            data: arr
        })
            .then((res) => {
                if (res.data.affectedRows){
                    if(pid!=0){
                        let count = ""
                        this.state.childComment.forEach((item,index)=>{
                            if(item.id==id){
                                count=index
                            }
                        })
                        let arr=this.state.childComment
                        arr.splice(count, 1)
                        this.setState({
                            childComment:arr
                        })
                    }
                    message.success('删除成功');
                }
            })
            .catch((err) => {
                message.error(`不是管理员你删个锤子啊！`);
            });
        console.log(id)
    }
    changeEvent(e){
        const value = event.target.value
        const name = event.target.id
        this.setState({
            [name]: value
        })
    }
    handleSubmit=(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(err){
                console.log(err)
                return;
            }
            let data = values
            data.website = data.website?(data.agreement + data.website).toLowerCase():""
            let id = this.props.data.id
            let replyId = this.state.replyId
            let mailData = {
                title: this.props.data.title,
                to: this.state.email,
                blogName: this.props.data.blogName,
                replyNiceName: this.state.replyNiceName,
                detail: this.state.detail,
                url: window.location.href
            }
            axios.post('/submitComment', {
                data: data,
                id: id,
                replyId: replyId,
                mailData: mailData
            })
            .then(function (response) {
                if (response.data.affectedRows && response.statusText == "OK") {
                    let commentsInfo = {
                        email: data.email,
                        nickname: data.nickname,
                        website: data.website
                    }
                    commentsInfo = JSON.stringify(commentsInfo)
                    localStorage.setItem("commentInfo", commentsInfo)
                    if (parser(navigator.userAgent).browser.name == "WeChat") //fuck WeChat！ 
                        window.location.href = location.href + '?time=' + ((new Date()).getTime());
                    else
                        location.reload()
                } else {
                    console.log(`错误${response.data.message}`)
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        })
    }
    
    
    render(){
        const { getFieldDecorator } = this.props.form
        const selectBefore = getFieldDecorator('agreement',{
                    initialValue:"https://"
                })(
                    <Select style={{ width: 95 }}>
                        <Option value="http://">http://</Option>
                        <Option value="https://">https://</Option>
                    </Select>
                )
        let result = this.state.commentList.map((obj,index)=>{
            let chilidCommentsArr=[]
            this.state.childComment.map((item,key)=>{
                if (item.pid==obj.id){
                    let deleteBtn = ""
                    if(this.state.isLogin){
                        deleteBtn=(
                            <Popconfirm placement="topLeft" title="确定删除这条评论吗?" onConfirm={() => this.delete(item.id,item.pid)} okText="Yes" cancelText="No">
                                <button className="deleteChild">删除</button>
                            </Popconfirm>
                        )
                    }
                    let arr=(
                        <div className="child-comment-main" data-commentid={item.id} key={key}>
                            <span className="arr-top">
                                <i className="bd">◆</i>
                                <i className="bg">◆</i>
                            </span>
                            <a href={item.website} target="_blank"><span>{item.nickname}</span></a>
                            <span> : {item.detail}</span>
                            {deleteBtn}
                        </div> 
                    )
                    chilidCommentsArr.push(arr)
                }
            })
            let chilidComments = ()=>{
                let arr = chilidCommentsArr.map((obj, index) => obj )
                if(arr.length){
                    return(
                        <div className="child-comment">
                            {arr}
                        </div>
                    )
                }else{
                    return ""
                }
            }
            let ifshowDeleteBtn = ()=>{
                let dom = ""
                if(this.state.isLogin){
                    dom = (
                        <div className="operate">
                            <Popconfirm placement="topLeft" title="确定删除这条评论吗?" onConfirm={() => this.delete(obj.id, obj.pid)} okText="Yes" cancelText="No">
                                <button className="delete">删除</button>
                            </Popconfirm>
                            <button className="reply" onClick={() => this.reply(obj.id, obj.nickname,obj.detail,obj.email)}>回复</button>
                        </div>
                    )
                }else{
                    dom=(
                        <div className="operate">
                            <button className="reply" onClick={() => this.reply(obj.id, obj.nickname, obj.detail, obj.email)}>回复</button>
                        </div>
                    )
                }
                return dom
            }
            let Md5email = require('crypto').createHash('md5').update(obj.email).digest('hex')
            let ua = parser(obj.ua)
            return(
            <li className="comment-main" key={index} data-commentid={obj.id}>
                <div className="root-comment">
                    <div className="author-info">
                        <img src={`//secure.gravatar.com/avatar/${Md5email}?s=100`}/>
                            <p>
                                <Tooltip placement="topLeft" title={`${ua.browser.name} ${ua.browser.major} / ${ua.os.name} ${ua.os.version}`}>
                                    <a href={obj.website} target="_blank"><span className="ua author-name">{obj.nickname}</span></a>
                                </Tooltip>
                                
                            </p>
                            <p className="comment-time">{this.formatTime(obj.timestamp)}</p>
                    </div>
                    <div className="comment-body">
                        {obj.detail}
                    </div>
                        {ifshowDeleteBtn()}
                </div>
                {chilidComments()}
            </li>)
        })
        let totalPage = Math.ceil(this.props.data.data.ptotal / this.props.data.pageSize)
        let div = []
        for(let i = 1 ; i<= totalPage; i++){
            if (this.state.currentPage == i){
                div.push(<li className="active" onClick={()=>this.getCommentList(i,10)} key={i}>{i}</li>)
            }else{
                div.push(<li onClick={() => this.getCommentList(i, 10)} key={i}>{i}</li>)
            }
        }
        const nav = div.map((item)=>{
            return item
        })
        
        return(
            <div>
                <h2>发表评论</h2>
                <p className={this.state.isLogin ?"isLogin":"hidden"}>
                    <span>目前是管理员身份,<a href="/logout">退出</a>?</span>
                </p>
                <p className="tipInfo">
                    {this.state.placeholder ? this.state.placeholder : ""}
                    <span onClick={this.cancelReply} className={this.state.replyId ?"tipInfo":"hidden"}>取消</span>
                </p>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem>
                        {getFieldDecorator('comment', {
                            rules: [{ required: true, message: '请至少输入一个汉字', pattern: /[\u4e00-\u9fa5]/gm}],
                        })(
                            <TextArea placeholder={this.state.placeholder}  autosize={{ minRows: 6, maxRows: 6 }} tabIndex="1" />
                        )}
                    </FormItem>
                    
                    <div id="author-info">
                        <FormItem
                            hasFeedback
                        >
                            {getFieldDecorator('nickname', {
                                rules: [{ required: true, message: '昵称不能为空' }],
                            })(
                                <Input placeholder="昵称 (必填)" tabIndex="2"/>
                            )}
                        </FormItem>
                        
                        <FormItem
                            hasFeedback
                        >
                            {getFieldDecorator('email', {
                                rules: [{ required: true, message: '邮箱为空或格式错误', pattern:/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/ },{
                                    
                                }],
                            })(
                                <Input placeholder="邮箱 (必填)" tabIndex="3"/>
                            )}
                        </FormItem>
                        
                        <FormItem>
                            {getFieldDecorator('website')(
                                <Input addonBefore={selectBefore} tabIndex="4"/>
                            )}
                        </FormItem>
                        
                        <FormItem>
                            <Button 
                            type="primary"
                            htmlType="submit"
                            >
                                发表评论
                            </Button>
                        </FormItem>
                    </div>
                </Form>
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

const CommentForm = Form.create()(Comment);
export default CommentForm