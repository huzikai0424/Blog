import React, { Component } from 'react';
import axios from 'axios'
import { Input, Select, Button,Form} from 'antd'
import 'antd/lib/input/style/css'
import 'antd/lib/select/style/css'
import 'antd/lib/button/style/css'
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
            replyId:null
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
        
        this.setState({ 
            placeholder: `回复给: ${nickname}`,
            replyId:id
        })
        this.props.form.getFieldInstance('comment').focus()
       // this.comment.focus()
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
            let data = values
            data.website = (data.agreement + data.website).toLowerCase()
            let id = this.props.data.id
            let replyId = this.state.replyId
            axios.post('/submitComment', {
                data: data,
                id: id,
                replyId: replyId
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
        const selectBefore = (
            <FormItem>
                {getFieldDecorator('agreement',{
                    initialValue:"Https://"
                })(
                    <Select style={{ width: 95 }}>
                        <Option value="Http://">Http://</Option>
                        <Option value="Https://">Https://</Option>
                    </Select>
                )}
            </FormItem>
        );

        let result = this.state.commentList.map((obj,index)=>{
            this.state.childComment.forEach((item,count)=>{
                if (item.pid==obj.id)
                    console.log(obj.nickname,index)
            })
            let Md5email = require('crypto').createHash('md5').update(obj.email).digest('hex')
            let ua = parser(obj.ua)
            return(
            <li className="comment-main" key={index} data-commentid={obj.id}>
                <div className="root-comment">
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
                    <button className="reply" onClick={() => this.reply(obj.id, obj.nickname)}>回复</button>
                </div>
                <div className="child-comment">
                
                
                </div>
            </li>)
        })
        let totalPage = Math.ceil(this.props.data.data.total / this.props.data.pageSize)
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
                <p className="islogin">{this.state.placeholder ? this.state.placeholder:""}</p>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem>
                        {getFieldDecorator('comment', {
                            rules: [{ required: true, message: '请至少输入一个汉字', pattern: /[\u4e00-\u9fa5]/gm}],
                        })(
                            <TextArea placeholder={this.state.placeholder}  autosize={{ minRows: 3, maxRows: 6 }} />
                        )}
                    </FormItem>
                    <br />
                    <div id="author-info">
                        <FormItem>
                            {getFieldDecorator('nickname', {
                                rules: [{ required: true, message: '昵称不能为空' }],
                            })(
                                <Input placeholder="昵称 (必填)" />
                            )}
                        </FormItem>
                        <br />
                        <FormItem
                            hasFeedback
                        >
                            {getFieldDecorator('email', {
                                rules: [{ required: true, message: '邮箱为空或格式错误', pattern:/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/ },{
                                    
                                }],
                            })(
                                <Input placeholder="邮箱 (必填)" />
                            )}
                        </FormItem>
                        <br />
                        <FormItem>
                            {getFieldDecorator('website')(
                                <Input addonBefore={selectBefore} />
                            )}
                        </FormItem>
                        <br />
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