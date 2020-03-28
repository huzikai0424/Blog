import ReactDOM from 'react-dom'
import React from 'react'
import Comment from '../comment/index'
import BackTop from '../comment/control'
import CateNav from '../comment/cateNav'
ReactDOM.render(
	<Comment data={window.result}/>,
	document.getElementById('comment')
)
ReactDOM.render(
	<BackTop/>,
	document.getElementById('backTop')
)

ReactDOM.render(
	<CateNav />,
	document.getElementById('article-nav')
)