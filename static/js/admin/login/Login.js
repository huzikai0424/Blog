import React, { Component } from 'react'
import './login.less'
import { Form, Icon, Input, Button, Checkbox, message, Spin } from 'antd'
import axios from 'axios'
import md5 from 'md5'
import PropTypes from 'prop-types'
const FormItem = Form.Item

class NormalLoginForm extends Component {
	constructor(props){
		super(props)
		this.state = {
			isLoding:false,
		}
	}
	handleSubmit = (e) => {
		e.preventDefault()
		this.props.form.validateFields((err, values) => {
			if (!err) {
				console.log('Received values of form: ', values)
				axios.post('/checkLogin', {
					username: values.username,
					password: md5(values.password)
				})
					.then(function (res) {
						if (res.data){
							message.success('登陆成功')
							setTimeout(() => {
								window.location.href = '/admin'
							}, 500)
						} else {
							message.error('登陆失败,用户名或密码错误')
						}
					})
					.catch(function (err) {
						message.error(err)
						console.log(err)
					})
			}
		})
	};

	render() {
		const { getFieldDecorator } = this.props.form
		return (
			this.state.isLoding ? <Spin size="large" className="loading" /> :
				<div className="login">
					<div className="login-form">
						<div className="login-logo">
							<div className="login-name">Absorbed</div>
						</div>
						<Form onSubmit={this.handleSubmit} style={{maxWidth: '300px'}}>
							<FormItem>
								{getFieldDecorator('username', {
									rules: [{ required: true, message: '请输入用户名!' }],
								})(
									<Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名" />
								)}
							</FormItem>
							<FormItem>
								{getFieldDecorator('password', {
									rules: [{ required: true, message: '请输入密码!' }],
								})(
									<Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码" />
								)}
							</FormItem>
							<FormItem style={{marginBottom:'0'}}>
								{getFieldDecorator('remember', {
									valuePropName: 'checked',
									initialValue: true,
								})(
									<Checkbox>记住我</Checkbox>
								)}

								<Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%'}}>
								登录
								</Button>
							Or <a href="/">去首页!</a>
							</FormItem>
						</Form>
						<a className="githubUrl" href="https://github.com/huzikai0424/Blog" target='_blank' rel="noopener noreferrer"> </a>
					</div>
				</div>
		)
	}
}
NormalLoginForm.propTypes = {
	form:PropTypes.any,
}
const Login = Form.create()(NormalLoginForm)
export default Login