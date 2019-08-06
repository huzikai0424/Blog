import React, { Component } from 'react'
import SimpleMDE from 'simplemde'
import 'simplemde/dist/simplemde.min.css'
import axios from 'axios'
import moment from 'moment'
import PropTypes from 'prop-types'
import { Form, Icon, Input, Button, DatePicker, Select, message, Upload } from 'antd'
const { Option } = Select
const FormItem = Form.Item
class Editor extends Component {
	constructor(props) {
		super(props)
		this.state = {
			reload: false,
			tags: [],
			types:[]
		}
	}
	componentDidMount() {
		this.getAllTags()
		this.getAllTypes()
		const id = this.props.match.params.id
		if (id){
			this.setState({ id })
			axios.get(`/getArticle/${id}`)
				.then((res) => {
					this.smde = new SimpleMDE({
						element: document.getElementById('editor'),
						spellChecker: false,
						autofocus: true,
						promptURLs: true,
						status: ['autosave', 'lines', 'words', 'cursor'],
						styleSelectedText: false,
						initialValue: res.data.posts,
					})
					const data = res.data
					this.props.form.setFieldsValue({
						title:data.title,
						type: data.type ? data.type : '',
						tags:data.tags,
						views:data.views,
						postTime:moment(data.postTime)
					})
				})
				.catch((error) => {
					this.props.history.push('/admin/article')
					console.log(error)
				})
		} else {
			this.smde = new SimpleMDE({
				element: document.getElementById('editor'),
				spellChecker: false,
				autofocus: true,
				promptURLs: true,
				status: ['autosave', 'lines', 'words', 'cursor'],
				styleSelectedText: false,
			})
		}
	}
	/**
	 * 获得所有标签
	 */
	getAllTags() { 
		axios.get('/api/getAllTags').then(res => {
			this.setState({
				tags:res.data
			})
		}).catch(err => {
			message.error('获取标签失败')
			console.error(err)
		})
	}
	/**
	 * 获得所有分类
	 */
	getAllTypes() { 
		axios.get('/api/getAllTypes').then(res => {
			this.setState({
				types:res.data
			})
		}).catch(err => {
			message.error('获取分类失败')
			console.error(err)
		})
	}
	transform=(value)=>{
		return value ? Number(value + 1) : null
	}
	handleSubmit = (e) => {
		e.preventDefault()
		
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				this.setState({
					reload:true
				})
				
				let markdown = this.smde.value()
				let data = {
					id:Number(this.state.id),
					title: values.title,
					type: values.type,
					views: values.views,
					posts: markdown,
					tags: values.tags,
					postTime: moment(values.postTime).unix() * 1000,
					updateTime:moment().unix() * 1000,
					oldPath: this.state.oldPath,
					newPath: this.state.newPath
				}
				if (this.state.id){
					axios.post('/updateArticleById', {data})
						.then((res) =>{
							setTimeout(() => {
								this.setState({
									reload: false
								})
								message.success('更新成功',1)
							}, 500)
						
							setTimeout(() => {
								this.props.history.push('/admin/article')
							}, 1500)
							console.log(res)
						})
						.catch((err) =>{
							this.setState({
								reload:false
							})
							message.error(err)
							console.log(err)
						})
				} else {
					axios.post('/postArticle',{
						data: data
					}).then((res)=>{
						if (res.data.affectedRows){
							
							setTimeout(() => {
								this.setState({
									reload: false
								})
								message.success('发布成功', 1)
							}, 500)
							setTimeout(() => {
								this.props.history.push('/admin/article')
							}, 1500)
						}
					}).catch((err)=>{
						this.setState({
							reload: false
						})
						message.error(err)
						console.log(err)
					})
				}
			}
		})
	}
	disabledDate=(current) =>{
		return  current > moment().endOf('day')
	}
	beforeUpload = (file, fileList)=>{
		console.log(file.type)
		const fileSize = file.size / 1024 / 1024
		const suffix = file.name.split('.')
		if (suffix[suffix.length - 1] != 'md'){
			message.error('只能上传.md后缀的文件')
			fileList.splice(0, fileList.length)   //清空文件列表
			return false
		}
		if (fileSize > 1){
			message.error('Markdown must smaller than 1MB!')
			return false
		}
	}
	render() {
		const that = this
		const props = {
			name: 'file',
			action: '/upload',
			beforeUpload:this.beforeUpload,
			showUploadList:false,
			onChange(info) {
				if (!info.file.status){
					return
				}
				if (info.file.status === 'done') {
					let res = info.file.response
					if (res.state){
						message.success('读取文件成功')
						that.setState({
							oldPath: res.oldPath,
							newPath: res.newPath
						})
						that.props.form.setFieldsValue({
							title: res.data.title,
							type: res.data.type ? res.data.type : '',
							tags: res.data.tags ? res.data.tags : '',
							views: res.data.views ? res.data.views : 0,
							postTime: moment(res.data.postTime)
						})
						that.smde.value(res.md)
					} else {
						message.error(`上传失败 ${info.file.response.msg}`)
					}
				} else if (info.file.status === 'error') {
					message.error(`${info.file.name} file upload failed.`)
				}
			},
		}


		const { reload ,tags,types} = this.state
		const { getFieldDecorator } = this.props.form
		const tagList = tags.map((item,index) => {
			return <Option value={item} key={index}>{ item }</Option>
		})
		const typeList = types.map((item, index) => {
			return <Option value={item} key={index}>{ item }</Option>
		})
		return (
			<div>
				<Upload {...props} className={this.state.id ? '' : 'hidden'}>
					<Button> <Icon type="upload" />导入markdown</Button>
				</Upload>
				<br /><br />
				<Form layout="vertical" onSubmit={this.handleSubmit}>
					<FormItem >
						{getFieldDecorator('title', {
							rules: [{ required: true }],
						})(
							<Input
								style={{ width: 700 }}
								prefix={<Icon type="file-markdown" style={{ color: 'rgba(0,0,0,.25)' }} />}
								placeholder="文章标题"
							/>
						)}
					</FormItem>
					<FormItem >
						{getFieldDecorator('type')(
							<Select
								showSearch
								style={{ width: 200 }}
								placeholder="输入文章分类"
								optionFilterProp="children"
								filterOption={(input, option) =>
									option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
								}
							>
								{typeList}
							</Select>
						)}
					</FormItem>
					<FormItem >
						{getFieldDecorator('tags', {
							rules: [{ required: true }],
						})(
							<Select
								showSearch
								style={{ width: 200 }}
								placeholder="输入文章标签"
								optionFilterProp="children"
								filterOption={(input, option) =>
									option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
								}
							>
								{tagList}
							</Select>
						)}
					</FormItem>
					<FormItem>
						{getFieldDecorator('postTime', {
							rules: [{ type: 'object', required: true, message: '文章发布时间发不能为空' }],
						})(
							<DatePicker
								style={{ width: 200 }}
								disabledDate={this.disabledDate}
							/>
						)}
					</FormItem>
					<textarea id="editor"></textarea>
					<FormItem>
						<Button
							type="primary"
							htmlType="submit"
							disabled={reload}
							loading={reload}
						>
							提交
						</Button>
					</FormItem>
				</Form >
			</div>
		)
	}
}
Editor.propTypes = {
	match: PropTypes.any,
	form: PropTypes.any,
	history:PropTypes.any
}
const WrappedNormalLoginForm = Form.create()(Editor)
export default WrappedNormalLoginForm