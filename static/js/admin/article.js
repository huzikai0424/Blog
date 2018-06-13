import React, { Component } from 'react';
import { Table, Button, Popconfirm, message, Spin, Divider  } from 'antd';
import commonJs from "../../../server/routes/common"
import axios from "axios"
class Article extends Component {
    constructor(props) {
        super(props);
        this.state={
            articleList:[],
            page: 1,
            pageSize: 10,
            reload: false,
            pagination: {
                defaultCurrent: 1,
                total: 1,
                showTotal: (total, range) => `第${range[0]}-${range[1]}条 共 ${total} 条`,
                onChange: (page, pageSize) => {
                    this.setState({ page, pageSize })
                    // this.getCommentList(page, pageSize)
                }
            }
        }
    }
    getArticleList(page=1,pageSize=10){
        axios.get(`/getArticleList?page=${page}&pageSize=${pageSize}`)
            .then((res) => {
                res.data.data.forEach(function (item) {
                    item.postTime = commonJs.formatTime(item.postTime)
                });
                this.setState({
                    articleList: res.data.data,
                    pagination: Object.assign(this.state.pagination, {
                        total: res.data.total
                    })
                })
            })
            .catch((error) => {
                console.log(error);
            });
    }
    componentDidMount() {
        this.getArticleList()
    }
    render() {
        const columns = [{
            title: '标题',
            dataIndex: 'title',
            key: 'title',
        }, {
            title: '分类',
            dataIndex: 'type',
            key: 'type',
            render: (text) => text?text:"暂无分类"
        }, {
            title: '标签',
            dataIndex: 'tags',
            key: 'tags',
        }, {
            title: '发布时间',
            dataIndex: 'postTime',
            key: 'postTime',
        },
        {
            title: '其他',
            dataIndex: 'views',
            key: 'views',
            render:(text,row)=>(
                <span>
                {text}次浏览
                &nbsp;&nbsp;
                <span>
                    {row.like?`${row.like}次点赞`:""}
                </span>
               
                </span>
            )
        },{
            title: '操作',
            key: 'operate',
            render: (text, row, index) => {

                return(
                    <span>
                        <a href="#">编辑</a>
                        <Divider type="vertical" />
                        <a href="#">删除</a>
                    </span>

                )
            }
                
            
        }];
        return (
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                <Spin spinning={this.state.reload}>
                    <Table
                        dataSource={this.state.articleList}
                        columns={columns}
                        bordered={true}
                        rowKey="id"
                        pagination={this.state.pagination}
                    />
                </Spin>
              
            </div>
        )
    }
}
export default Article