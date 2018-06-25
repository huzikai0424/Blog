import React, { Component } from 'react';
import { Tabs,Form, Icon, Input, Button, DatePicker } from 'antd';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
class Options extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reload: false
        }
    }
    render(){
        const { reload } = this.state
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        return (
            <div>
                <Tabs defaultActiveKey = "1">
                    <TabPane tab="Tab 1" key="1">
                    <Form layout="vertical" >
                        <FormItem 
                            label="网站标题"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('title', {
                                rules: [{ required: true }],
                            })(
                                <Input prefix={<Icon type="file-markdown" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="文章标题" />
                            )}
                        </FormItem>
                        <FormItem 
                            label="副标题"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('subtitle')(
                                <Input prefix={<Icon type="profile" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="分类" />
                            )}
                        </FormItem>
                        <FormItem 
                            label="网站关键词"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('keywords', {
                                rules: [{ required: true }],
                            })(
                                <Input prefix={<Icon type="tag-o" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="标签" />
                            )}
                        </FormItem>
                        <FormItem 
                            label="网站描述"
                             {...formItemLayout}
                        >
                            {getFieldDecorator('description', {
                                rules: [{ required: true, type: "integer", message: '这里需要一个正整数 ~w(゜Д゜)w' }],
                            })(
                                <Input prefix={<Icon type="eye-o" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="浏览量" />
                            )}
                        </FormItem>

                        <FormItem>
                            {getFieldDecorator('postTime', {
                                rules: [{ type: 'object', required: true, message: '文章发布时间发不能为空' }],
                            })(
                                <DatePicker
                                   
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
                                submit
                         </Button>
                        </FormItem>
                    </Form >
                    
                    </TabPane>
                    <TabPane tab="Tab 2" key="2">Content of Tab Pane 2</TabPane>
                    <TabPane tab="Tab 3" key="3">Content of Tab Pane 3</TabPane>
                </Tabs>
            </div>
        )
    }
}
const OptionsFrom = Form.create()(Options);
export default OptionsFrom