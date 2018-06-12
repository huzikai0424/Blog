import React from 'react';
import ReactDOM from 'react-dom';
import "./index.css";
import { Layout, Menu, Breadcrumb, Icon, Table, Divider } from 'antd';
import { Route, Switch, Link } from 'react-router-dom';
import 'antd/dist/antd.css'

import comment from "./comment";
import article from "./article";
const { Header, Content, Sider, Footer } = Layout;

const { SubMenu } = Menu;

class App extends React.Component {
    state = {
        collapsed: false
    };
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed
        })
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
                            <Link to="/admin/comment"><Icon type="pie-chart" /><span>评论</span></Link>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Link to="/admin/article"><Icon type="desktop" /><span>文章</span></Link>
                        </Menu.Item>
                        <SubMenu
                            key="sub1"
                            title={<span><Icon type="user" /><span>User</span></span>}
                        >
                            <Menu.Item key="3">评论</Menu.Item>
                            <Menu.Item key="4">文章</Menu.Item>
                            <Menu.Item key="5">Alex</Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub2"
                            title={<span><Icon type="team" /><span>Team</span></span>}
                        >
                            <Menu.Item key="6">Team 1</Menu.Item>
                            <Menu.Item key="8">Team 2</Menu.Item>
                        </SubMenu>
                        <Menu.Item key="9">
                            <Icon type="file" />
                            <span>File</span>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{ background: '#fff', padding: 0 }} >
                        <Icon
                            className="trigger"
                            type={this.state.collapsed ? "menu-unfold" : "menu-fold"}
                            onClick={this.toggle}
                        />
                    </Header>
                    <Content style={{ margin: '0 16px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item>User</Breadcrumb.Item>
                            <Breadcrumb.Item>Bill</Breadcrumb.Item>
                        </Breadcrumb>
                        <Switch>
                            
                            <Route path="/admin/comment" component={comment} />
                            <Route path="/admin/article" component={article} />
                            
                        </Switch>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        Ant Design ©2016 Created by Ant UED
          </Footer>
                </Layout>
            </Layout>
        );
    }
}



export default App;
//ReactDOM.render(<App />, document.getElementById('root'));