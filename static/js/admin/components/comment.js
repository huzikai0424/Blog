import React, { Component } from 'react'
import { Table, Button, Popconfirm, message, Spin  } from 'antd'
import axios from 'axios'
import commonJs from '../../../../server/routes/common'
class Comment extends Component {
	constructor(props) {
		super(props)
		this.state = {
			comments:[],
			selectedRowKeys:[],
			loading:false,
			reload:false,
			page:1,
			pageSize:10,
			tableLoading:false,
			pagination:{
				defaultCurrent:1,
				total:1,
				showTotal: (total, range) => `第${range[0]}-${range[1]}条 共 ${total} 条`,
				onChange: (page, pageSize)=>{
					this.setState({ page, pageSize })
					this.getCommentList(page, pageSize)
				}
			}
		}
	}
	deleteComments=()=>{
		this.setState({loading:true})
		let arr = this.state.selectedRowKeys
		axios.post('/deleteComments', {
			data:arr
		})
			.then((res) => {
				this.refresh()
				this.setState({
					selectedRowKeys: [],
					loading: false
				})
				console.log(res)
				message.success('删除成功')
			})
			.catch((err) => {
				this.setState({
					loading: false
				})
				message.success(`删除失败 ${err}`)
			})
	}
	OnReload=()=>{
		this.setState({ reload: true })
		setTimeout(() => {
			this.setState({
				reload: false
			})
			message.success('刷新成功')
		}, 2000)
	}
	onSelectChange = (selectedRowKeys) => {
		this.setState({ selectedRowKeys })
	}
	componentDidMount() {
		this.getCommentList()
	}
	refresh(){
		this.getCommentList(this.state.page,this.state.pageSize)
	}
	getCommentList(page = 1, pageSize = 10){
		this.setState({
			tableLoading:true
		})
		axios.get(`/getCommentList?page=${page}&pageSize=${pageSize}`)
			.then((res) => {
				res.data.data.forEach(function (item) {
					item.timestamp = commonJs.formatTimeToDay(item.timestamp)
				})
				this.setState({
					comments: res.data.data,
					pagination: Object.assign(this.state.pagination, {
						total: res.data.total
					})
				})
			})
			.catch((error) => {
				console.log(error)
			}).finally(()=>{
				this.setState({
					tableLoading:false
				})
			})
	}
	confirm(){
		this.deleteComments()
	}
	render() {
		const text = '确定要删除吗？'
		const { reload ,tableLoading} = this.state
		const {loading,selectedRowKeys} = this.state
		const rowSelection = {
			onChange: this.onSelectChange,
			selectedRowKeys
		}
		const hasSelected = selectedRowKeys.length > 0
		const columns = [{
			title: '姓名',
			dataIndex: 'nickname',
			key: 'nickname',
			render:(text,row)=>{
				let Md5email = require('crypto').createHash('md5').update(row.email).digest('hex')
				let avatar = <img style={{ float: 'left', width: '40px', borderRadius: '50%',marginRight:'10px' }} src={`//cn.gravatar.com/avatar/${Md5email}?s=100`} />
				let emain = row.email
				let reg = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/
				let website = row.website ? <a href={reg.test(row.website) ? row.website : `//${row.website}`}>{row.website}</a> : ''
				let main = ''
				if (row.website == ''){
					main = text
				} else {
					main = <a href={reg.test(row.website) ? row.website : `//${row.website}`}>{text}</a>
				}
				return (
					<span>
						{avatar}{main}<br />{emain}<br />{website}
					</span>
				)
			}
		}, {
			title: '评论',
			dataIndex: 'detail',
			key: 'detail',
		}, {
			title: '回复至',
			dataIndex: 'title',
			key: 'title',
			width:'200px',
			render: (text, row) => <a href={`/article/${row.article_id}`} target="_blank" rel="noopener noreferrer">{text}</a>

		}, {
			title: '评论时间',
			dataIndex: 'timestamp',
			key: 'timestamp',
			width:'200px',
		}]
		return (
			<div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
				<div style={{ marginBottom: 16 }}>

					<Button
						type="primary"
						disabled={reload}
						loading={reload}
						onClick={this.OnReload}
					>
						Reload
					</Button>
					&nbsp;&nbsp;
					<Popconfirm placement="topLeft" title={text} onConfirm={()=>this.confirm()} okText="Yes" cancelText="No">
						<Button
							type="primary"

							disabled={!hasSelected}
							loading={loading}
						>
						Delect
						</Button>
					</Popconfirm>

					<span style={{ marginLeft: 8 }}>
						{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
					</span>

				</div>
				<Spin spinning={reload}>
					<Table
						dataSource={this.state.comments}
						rowSelection={rowSelection}
						columns={columns}
						bordered={true}
						rowKey="id"
						loading={tableLoading}
						pagination={this.state.pagination}
					/>
				</Spin>
			</div>
		)
	}
}

export default Comment