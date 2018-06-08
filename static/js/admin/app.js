import React from 'react';
import ReactDOM from 'react-dom';
import "./index.css";
import { Layout, Menu, Breadcrumb, Icon, Table, Divider } from 'antd';
import 'antd/dist/antd.css'
import comments from "./comments.json";
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
                            <Icon type="pie-chart" />
                            <span>Option 1</span>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Icon type="desktop" />
                            <span>Option 2</span>
                        </Menu.Item>
                        <SubMenu
                            key="sub1"
                            title={<span><Icon type="user" /><span>User</span></span>}
                        >
                            <Menu.Item key="3">Tom</Menu.Item>
                            <Menu.Item key="4">Bill</Menu.Item>
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
                        <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                            <Table
                                dataSource={comments.data}
                                columns={columns}
                                bordered={true}
                                rowKey="id"
                            />




                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        Ant Design ©2016 Created by Ant UED
          </Footer>
                </Layout>
            </Layout>
        );
    }
}


const columns = [{
    title: '姓名',
    dataIndex: 'nickname',
    key: 'nickname',
}, {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
}, {
    title: '网站',
    dataIndex: 'website',
    key: 'website',
}, {
    title: '评论时间',
    dataIndex: 'timestamp',
    key: 'timestamp',
}, {
    title: '详情',
    dataIndex: 'detail',
    key: 'detail',
}];
export default App;
//ReactDOM.render(<App />, document.getElementById('root'));