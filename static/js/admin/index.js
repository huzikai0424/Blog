import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { ConfigProvider} from 'antd'
import Login from './login/Login'
import zh_CN from 'antd/es/locale/zh_CN'
import App from './app'
class MRoute extends React.Component{
	render(){
		return (
			<BrowserRouter>
				<Switch>
					<Route path="/admin" component={App}>

					</Route>
					<Route path="/login" component={Login}>

					</Route>
				</Switch>
			</BrowserRouter>

		)
	}
}

ReactDOM.render(
	<ConfigProvider locale={zh_CN}><MRoute /></ConfigProvider>,
	document.getElementById('root')
)