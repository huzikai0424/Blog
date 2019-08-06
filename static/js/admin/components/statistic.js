import React, { Component } from 'react'
import {Statistic,Row,Col} from 'antd'
import axios from 'axios'
import dayjs from 'dayjs'
class StatisticShow extends Component {
	constructor(props) {
		super(props)
		this.state = {
			data:{},
			now: dayjs(),
			options: {}
		}
	}
	componentDidMount(){
		//侧边栏数据信息
		axios.get('/api/getSidebarInfo').then(res => {
			this.setState({
				data:res.data
			})
		}).catch(err=>{
			console.error(err)
		})
		axios.get('/api/getOptions').then(res => {
			this.setState({
				options:res.data
			})
		})
	}
	render() {
		const {totalArticle,totalComment} = this.state.data
		const {now,options} = this.state
		const timeDiff = now.diff(dayjs(options.personalOptions && options.personalOptions.blogAge),'day')
		return (
			<Row gutter={16}>
				<Col span={3}>
					<Statistic title="文章数" value={totalArticle} className='statisticBox'/>
				</Col>
				<Col span={3}>
					<Statistic title="评论数" value={totalComment} className='statisticBox'/>
				</Col>
				<Col span={3}>
					<Statistic title="稳定运行" value={`${timeDiff}天`} className='statisticBox'/>
				</Col>
			</Row>
		)
	}
}

export default StatisticShow