import React, { Component } from 'react';
import SimpleMDE from 'simplemde'
import 'simplemde/dist/simplemde.min.css'
import axios from 'axios'
import locale from 'moment/src/locale/zh-cn'
import { Form, Icon, Input, Button, DatePicker, InputNumber, message, Upload} from 'antd'
import moment from "moment"
import { debug } from 'util';
const FormItem = Form.Item
class Editor extends Component {
    constructor(props) {
        super(props);
        this.state={
            reload:false
        }
    }
    componentDidMount() {
        const id = this.props.match.params.id
        if(id){
            this.setState({ id })
            axios.get(`/getArticle/${id}`)
                .then((res) => {
                    this.smde = new SimpleMDE({
                        element: document.getElementById("editor"),
                        spellChecker: false,
                        autofocus: true,
                        promptURLs: true,
                        status: ["autosave", "lines", "words", "cursor"],
                        styleSelectedText: false,
                        initialValue: res.data.posts,
                    })
                    const data = res.data
                   
                    this.props.form.setFieldsValue({
                        title:data.title,
                        type: data.type ? data.type:"",
                        tags:data.tags,
                        views:data.views,
                        postTime:moment(data.postTime)
                    })
                })
                .catch((error) => {
                    this.props.history.push('/admin/article')
                    console.log(error);
                });
        }else{
            this.smde = new SimpleMDE({
                element: document.getElementById("editor"),
                spellChecker: false,
                autofocus: true,
                promptURLs: true,
                status: ["autosave", "lines", "words", "cursor"],
                styleSelectedText: false,
            })
        }
    }
    transform=(value)=>{
        return value?Number(value):null
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({
                    reload:true
                })
                let markdown = this.smde.value()
                let data={
                    id:Number(this.state.id),
                    title: values.title,
                    type: values.type,
                    views: values.views,
                    posts: markdown,
                    tags: values.tags,
                    postTime: moment(values.postTime).unix()*1000,
                    updateTime:moment().unix()*1000
                }
                
                axios.post('/updateArticleById', {data})
                .then((res) =>{
                    setTimeout(() => {
                        this.setState({
                            reload: false
                        })
                        message.success('更新成功',1);
                    }, 500);
                    
                    setTimeout(() => {
                        this.props.history.push('/admin/article')
                    }, 1500);
                    console.log(res);
                })
                .catch((err) =>{
                    this.setState({
                        reload:false
                    })
                    message.error(err)
                    console.log(err);
                });
            }
        });
    }
    disabledDate=(current) =>{
       return  current > moment().endOf('day');
    }
    beforeUpload = (file, fileList)=>{
        console.log(file.type)
        const fileSize = file.size/1024/1024
        const suffix = file.name.split(".")
        if (suffix[suffix.length - 1] != "md"){
            message.error('只能上传.md后缀的文件');
            fileList.splice(0, fileList.length)   //清空文件列表
            return false;
        }
        if(fileSize>1){
            message.error('Markdown must smaller than 1MB!');
            return false;
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
                        that.props.form.setFieldsValue({
                            title: res.data.title,
                            type: res.data.type ? res.data.type : "",
                            tags: res.data.tags ? res.data.tags : "",
                            views: res.data.views ? res.data.views:0,
                            postTime: moment(res.data.postTime)
                        })
                        that.smde.value(res.md);
                    }else{
                        message.error(`上传失败 ${info.file.response.msg}`);
                    }
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },
        };


        const { reload } = this.state
        const { getFieldDecorator, getFieldError, isFieldTouched } = this.props.form;

        // Only show error after a field is touched.
        // const userNameError = isFieldTouched('userName') && getFieldError('userName');
        // const passwordError = isFieldTouched('password') && getFieldError('password');
        return (
            <div>
                <Upload {...props}>
                    <Button> <Icon type="upload" />导入markdown</Button>
                </Upload>
                <br /><br />
                <Form layout="vertical" onSubmit={this.handleSubmit}>
                    <FormItem >
                        {getFieldDecorator('title', {
                            rules: [{ required: true }],
                        })(
                            <Input prefix={<Icon type="file-markdown" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="文章标题" />
                        )}
                    </FormItem>
                    <FormItem >
                        {getFieldDecorator('type')(
                            <Input prefix={<Icon type="profile" style={{ color: 'rgba(0,0,0,.25)' }} />}  placeholder="分类" />
                        )}
                    </FormItem>
                    <FormItem >
                        {getFieldDecorator('tags', {
                            rules: [{ required: true }],
                        })(
                            <Input prefix={<Icon type="tag-o" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="标签" />
                        )}
                    </FormItem>
                    <FormItem >
                        {getFieldDecorator('views', {
                            rules: [{ required: true, type: "integer", transform: this.transform, message: '这里需要一个正整数 ~w(゜Д゜)w'}],
                    })(
                            <Input prefix={<Icon type="eye-o" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="浏览量" />
                        )}
                    </FormItem>
                    
                    <FormItem>
                        {getFieldDecorator('postTime', {
                            rules: [{ type: 'object', required: true, message: '文章发布时间发不能为空' }],
                        })(
                            <DatePicker 
                            locale={locale}
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
            </div>
        )
    }
}
const WrappedNormalLoginForm = Form.create()(Editor);
export default WrappedNormalLoginForm