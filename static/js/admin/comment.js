import React, { Component } from 'react';
import { Table, Pagination } from 'antd';
//import comments from "./comments.json";
import "./index.css";
import axios from "axios";
import commonJs from "../../../server/routes/common"
class Comment extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            comments:[],
            pagination:{
                defaultCurrent:1,
                total:1,
                showTotal: (total, range) => `第${range[0]}-${range[1]}条 共 ${total} 条`,
                onChange:(page,pagesize)=>{
                    this.getCommentList(page,pagesize)
                }
            }
        };
    }
    
    componentDidMount() {
        this.getCommentList()
    }
    getCommentList(page = 1, pageSize=10){
        axios.get(`/getCommentList?page=${page}&pageSize=${pageSize}`)
            .then((res) => {
                res.data.data.forEach(function (item) {
                    item.timestamp = commonJs.formatTimeToDay(item.timestamp)
                });
                this.setState({
                    comments: res.data.data,
                    pagination: Object.assign(this.state.pagination, {
                        total: res.data.total
                    })
                })
            })
            .catch((error) => {
                console.log(error);
            });
    }
    render() {
        const columns = [{
            title: '姓名',
            dataIndex: 'nickname',
            key: 'nickname',
            render:(text,row)=>{
                let Md5email = require('crypto').createHash('md5').update(row.email).digest('hex')
                let avatar = <img style={{ float: "left", width: "40px", borderRadius: "50%",marginRight:"10px" }} src={`//cn.gravatar.com/avatar/${Md5email}?s=100`} />
                let emain = row.email
                let reg = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/; 
                let website = row.website ? <a href={reg.test(row.website) ? row.website : `//${row.website}`}>{row.website}</a>:""
                let main =""
                if(row.website==""){
                    main = text
                }else{
                    main = <a href={reg.test(row.website) ? row.website :`//${row.website}`}>{text}</a>
                }
                return (
                    <span>
                        {avatar}{main}<br />{emain}<br />{website}
                    </span>
                )
                // if (row.website==""){
                //     return (`${ avatar} ${text}` )
                // }
                // return (`${ avatar}`<a href={row.website}>{text}</a>)
            }
        }, {
            title: '评论',
            dataIndex: 'detail',
            key: 'detail',
        }, {
            title: '回复至',
            dataIndex: 'title',
            key: 'title',
                render: (text, row) => <a href={`/article/${row.article_id}`} target="_blank">{text}</a>
            
        }, {
            title: '评论时间',
            dataIndex: 'timestamp',
            key: 'timestamp',
        }];
        return(
        <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            <Table
                dataSource={this.state.comments}
                columns={columns}
                bordered={true}
                rowKey="id"
                pagination={this.state.pagination}
            />
        </div>
        )
    }
}

export default Comment