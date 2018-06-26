import React, { Component } from 'react';
import { Tabs,Form, Icon, Input, Button, DatePicker } from 'antd';
import options from "../../../theme.config"
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const { TextArea } = Input
class Options extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reload: false
        }
    }
    componentDidMount() {
        this.props.form.setFieldsValue({
            title: options.seo.title,
            subtitle: options.seo.subtitle,
            keywords: options.seo.keywords,
            description: options.seo.description,
            icon:options.seo.icon,
            avatar:options.themeOptions.avatar,
            nickname:options.themeOptions.nickname,
            description:options.themeOptions.description,
            ICP:options.themeOptions.ICP,
            coptright:options.themeOptions.copyright
            
        })
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
                    <TabPane tab="基本设置" key="1">
                    <Form layout="vertical" >
                        <FormItem 
                            label="网站标题"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('title', {
                                rules: [{ required: true }],
                            })(
                                <Input placeholder="文章标题" />
                            )}
                        </FormItem>
                        <FormItem 
                            label="副标题"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('subtitle')(
                                <Input placeholder="分类" />
                            )}
                        </FormItem>
                        <FormItem 
                            label="网站关键词"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('keywords')(
                                <Input placeholder="标签" />
                            )}
                        </FormItem>
                        <FormItem 
                            label="网站描述"
                             {...formItemLayout}
                        >
                            {getFieldDecorator('description')(
                                <Input  placeholder="浏览量" />
                            )}
                        </FormItem>

                        <FormItem
                            label="站点icon"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('icon')(
                                <Input placeholder="站点icon" />
                            )}
                        </FormItem>
                        <FormItem
                            label="个人头像"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('avatar')(
                                <Input placeholder="个人头像" />
                            )}
                        </FormItem>
                        <FormItem
                            label="博主昵称"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('nickname')(
                                <Input placeholder="博主昵称" />
                            )}
                        </FormItem>
                        <FormItem
                            label="博主描述"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('description')(
                                <Input placeholder="博主描述" />
                            )}
                        </FormItem>
                        <FormItem
                            label="ICP备案号"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('ICP')(
                                <Input placeholder="标签" />
                            )}
                        </FormItem>
                        <FormItem
                            label="页脚信息"
                            {...formItemLayout}
                            >
                            {getFieldDecorator('copyright')(
                                <TextArea placeholder="页脚说明文字。自动保留空格和换行，支持HTML代码，不支持js代码。" autosize />
                            )}
                            
                        </FormItem>
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
                    <TabPane tab="社交" key="2">Content of Tab Pane 2</TabPane>
                    <TabPane tab="系统" key="3">Content of Tab Pane 3</TabPane>
                </Tabs>
            </div>
        )
    }
}
const OptionsFrom = Form.create()(Options);
export default OptionsFrom