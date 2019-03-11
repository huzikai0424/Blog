import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch} from 'react-router-dom'
import Login from './login/Login'
import { LocaleProvider } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import 'moment/src/locale/zh-cn'
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
	<LocaleProvider locale={zh_CN}><MRoute /></LocaleProvider>,
	document.getElementById('root')
)