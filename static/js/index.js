import ReactDOM from 'react-dom'
import React from 'react';
import Comment from './comment/index'
import BackTop from './comment/control'



ReactDOM.render(
    <Comment data={result}/>,
    document.getElementById('comment')
)
ReactDOM.render(
    <BackTop/>,
    document.getElementById('backTop')
)

// ReactDOM.render(
//     <Header />,
//     document.getElementById('header')
// )