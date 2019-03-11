import React from 'react'
import './index.css'
import { Layout, Menu, Breadcrumb, Icon,  Popconfirm } from 'antd'
import { Route, Switch, Link } from 'react-router-dom'
import 'antd/dist/antd.css'

import comment from './components/comment'
import article from './components/article'
import editor from './components/editor'
import options from './components/options'
import account from './components/account'
import statistic from './components/statistic'
const { Header, Content, Sider, Footer } = Layout

const { SubMenu } = Menu

class App extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			collapsed: false
		}
	}
	toggle = () => {
		this.setState({
			collapsed: !this.state.collapsed
		})
	}
	confirm=()=>{
		window.location.href = '/logout'
	}
	render() {
		return (
			<Layout style={{ minHeight: '100vh' }}>
				<Sider
					collapsible
					collapsed={this.state.collapsed}
					trigger={null}
				>
					<div className="logo" />
					<Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
						<Menu.Item key="1">
							<Link to="/admin">
								<Icon type="file"/>
								<span>首页</span>
							</Link>
						</Menu.Item>
						<Menu.Item key="2">
							<Link to="/admin/comment"><Icon type="pie-chart" /><span>评论</span></Link>
						</Menu.Item>
						<SubMenu
							key="sub1"
							title={<span><Icon type="file-markdown" /><span>文章</span></span>}
						>
							<Menu.Item key="3">
								<Link to="/admin/editor"><Icon type="form" /><span>文章发布</span></Link>
							</Menu.Item>
							<Menu.Item key="4">
								<Link to="/admin/article"><Icon type="profile" /><span>文章管理</span></Link>
							</Menu.Item>
						</SubMenu>
						<SubMenu
							key="sub2"
							title={<span><Icon type="tool" /><span>设置</span></span>}
						>
							<Menu.Item key="5"><Link to="/admin/options">博客设置</Link></Menu.Item>
							<Menu.Item key="6">系统设置</Menu.Item>
							<Menu.Item key="7"><Link to="/admin/account">账户设置</Link></Menu.Item>

						</SubMenu>
						<Menu.Item key="8">
							<Popconfirm
								placement="topLeft"
								title="确定要注销吗"
								onConfirm={this.confirm}
								okText="Yes"
								cancelText="No">
								<div>
									<Icon type="logout" /><span>注销</span>
								</div>
							</Popconfirm>
						</Menu.Item>

					</Menu>
				</Sider>
				<Layout>
					<Header style={{ background: '#fff', padding: 0 }} >
						<Icon
							className="trigger"
							type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
							onClick={this.toggle}
						/>
					</Header>
					<Content style={{ margin: '0 16px' }}>
						<Breadcrumb style={{ margin: '16px 0' }}>
							<Breadcrumb.Item>User</Breadcrumb.Item>
							<Breadcrumb.Item>default</Breadcrumb.Item>
						</Breadcrumb>
						<Switch>
							<Route path="/admin" exact component={statistic}></Route>
							<Route path="/admin/comment" component={comment} />
							<Route path="/admin/article" component={article} />
							<Route path="/admin/editor/:id" component={editor} />
							<Route path="/admin/editor" component={editor} />
							<Route path="/admin/options" component={options} />
							<Route paht="/admin/account" component={account} />
						</Switch>
					</Content>
					<Footer style={{ textAlign: 'center' }}>
						Ant Design ©2016 Created by Ant UED
					</Footer>
				</Layout>
			</Layout>
		)
	}
}



export default App
//ReactDOM.render(<App />, document.getElementById('root'));