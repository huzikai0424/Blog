import ReactDOM from 'react-dom'
import React, { Component } from 'react';

const Comment = require('./comment/index')
// const Header = require('./header/index')


ReactDOM.render(
    <Comment />,
    document.getElementById('comment')
)

// ReactDOM.render(
//     <Header />,
//     document.getElementById('header')
// )