import ReactDOM from 'react-dom'
import React, { Component } from 'react';
import Comment from './comment/index'
//const Comment = require('./comment/index')
// const Header = require('./header/index')


ReactDOM.render(
    <Comment data={result}/>,
    document.getElementById('comment')
)

// ReactDOM.render(
//     <Header />,
//     document.getElementById('header')
// )