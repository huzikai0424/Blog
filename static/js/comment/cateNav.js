import React, { Component } from 'react'
class CateNav extends Component {
	constructor(props) {
		super(props)
		this.state = {
			cateList:[],
			navIndex:-1
		}
	}
	componentDidMount(){
		const markdownBody = document.getElementsByClassName('markdown-body')[0].innerHTML
		const navDom = document.querySelectorAll('.markdown-body h2,.markdown-body h3')
		const cateList = markdownBody.match(/(<h[2-3][^>]*>.*?<\/h[2-3]>)/ig)
		let domHeightList = []
		navDom.forEach((item)=>{
			domHeightList.push(item.offsetTop + 5)
		})
		this.setState({
			cateList,domHeightList
		})
		window.addEventListener('scroll',this.throttle(()=>this.calcHeight()))
	}
	calcHeight(){
		const {domHeightList} = this.state
		const scrollY = window.scrollY + 15
		let navIndex = -1
		for (let i = 0;i < domHeightList.length;i++){
			if (scrollY >= domHeightList[i] && scrollY < domHeightList[i + 1]) {
				navIndex = i
				break
			} else if (scrollY < domHeightList[0]) {
				navIndex = 0
			} else if (scrollY >= domHeightList[domHeightList.length - 1]) {
				navIndex = domHeightList.length - 1
			} else {
				navIndex = -1
			}
		}
		this.setState({
			navIndex
		})
	}
	throttle(fn,delay){
		let isReady = true
		return function(){
			if (isReady){
				isReady = false
				setTimeout(function(){
					fn()
					isReady = true
				},delay || 150)
			}
		}
	}
	scrollToDom(index){
		const {domHeightList} = this.state
		window.scrollTo({
			left:0,
			top:domHeightList[index] - 10,
			behavior: 'smooth'
		})
	}
	render() {
		const {cateList,navIndex} = this.state
		const list = cateList.map((item,index)=>{
			let mainParagraph = 0	//主段落
			let subParagraph = 0	//副段落
			const result = item.replace(/<[^>].*?>/g,'')
			const isH2 = /(<h2[^>]*>.*?<\/h2>)/ig.test(item)
			if (isH2){
				mainParagraph += 1
				subParagraph = 0
				return (
					<dd className={`cate-item1${navIndex == index ? ' active' : ''}`}
						key={index}
						onClick={()=>this.scrollToDom(index)}
					>
						<a href={`#${mainParagraph}`}>{result}</a>
					</dd>
				)
			} else {
				subParagraph += 1
				return (
					<dd className={`cate-item2${navIndex == index ? ' active' : ''}`}
						key={index}
						onClick={()=>this.scrollToDom(index)}
					>
						<a href={`#${mainParagraph}-${subParagraph}`}>{result}</a>
					</dd>
				)
			}

		})
		return (
			<dl>{list}</dl>
		)
	}
}

export default CateNav