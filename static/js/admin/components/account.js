import React, { Component } from 'react'
import { Button, Form, Icon, Input, Switch, message} from 'antd'
import axios from 'axios'
import md5 from 'md5'
import PropTypes from 'prop-types'
const FormItem = Form.Item
class Account extends Component {
	constructor(props) {
		super(props)
		this.state = {
			username:window.session.user,
			changeUser:false,
			isCheckPassword:false
		}
	}
	componentDidMount() {
		this.props.form.setFieldsValue({
			username: this.state.username,
			changeUsername:false
		})
	}
	handleChange=()=>{
		let changeUser = !this.props.form.getFieldValue('changeUsername')
		if (changeUser){
			this.setState({
				changeUser:true
			}, () => {
				console.log(this.state.changeUser)
			})
		} else {
			this.setState({
				changeUser: false
			},()=>{
				console.log(this.state.changeUser)
			})
		}
	}
	handleSubmit=(e)=>{
		e.preventDefault()
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err){
				axios.post('/checkLogin', {
					username: window.session.user,
					password: md5(values.oldpsw)
				})
					.then( (res)=> {
						if (res.data) {
							this.setState({
								isCheckPassword:true
							},()=>{
								let obj = {
									username:window.session.user,
									newpsw:md5(values.newpsw),
									oldpsw:md5(values.oldpsw),
									changeUsername:values.changeUsername
								}
								if (values.changeUsername){
									obj = Object.assign(obj,{
										usernameChange:values.username
									})
								}
								axios.post('/resetPassword',{data:obj}).then((res)=>{
									if (res.data.success){
										message.success('修改成功',1)
										setTimeout(() => {
											location.reload()
										}, 1000)

									} else {
										message.error(res.data.msg)
									}
								}).catch((err)=>{
									message.error(err)
								})
							})
							message.success('验证成功')
						} else {
							message.error('验证失败,用户名或密码错误')
						}
					})
					.catch(function (err) {
						message.error(err)
						console.log(err)
					})
			}

		})
	}

	checkPassword=(rule,value,callback)=>{
		const form = this.props.form
		if (value && value != form.getFieldValue('newpsw')){
			callback('两次密码输入不一致')
		} else {
			callback()
		}
	}
	render() {

		const { getFieldDecorator } = this.props.form
		return (
			<Form style={{ maxWidth: '300px' }} onSubmit={this.handleSubmit}>
				<FormItem>
					{getFieldDecorator('changeUsername',{valuePropName:'checked'})(
						<Switch
							onChange={this.handleChange}
						/>
					)}
				</FormItem>
				<FormItem>
					{getFieldDecorator('username', {
						rules: [{ required: true, message: '请输入旧用户名!' }],
					})(
						<Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名" disabled={!this.state.changeUser}/>
					)}
				</FormItem>
				<FormItem>
					{getFieldDecorator('oldpsw', {
						rules: [{ required: true, message: '请输入旧密码!' }],
					})(
						<Input prefix={<Icon type="unlock" style={{ fontSize: 13 }} />} placeholder="旧密码" />
					)}
				</FormItem>
				<FormItem>
					{getFieldDecorator('newpsw', {
						rules: [{ required: true, message: '请输入新密码!' }],
					})(
						<Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="新密码" />
					)}
				</FormItem>
				<FormItem>
					{getFieldDecorator('repeatPsw', {
						rules: [{ required: true, message: '请重复输入新密码!' }, {
							validator: this.checkPassword
						}],
					})(
						<Input prefix={<Icon type="check" style={{ fontSize: 13 }} />} type="password" placeholder="确认新密码" />
					)}
				</FormItem>
				<Button type="primary" htmlType="submit" className="login-form-button" style={{ width: '100%' }}>
				提交
				</Button>


			</Form>
		)}
}
Account.propTypes = {
	form:PropTypes.any,
}
const NormalForm = Form.create()(Account)
export default NormalForm