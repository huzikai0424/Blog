import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Login from "./Login";
import App from "./app";

class MRoute extends React.Component{
    render(){
        return(
            <BrowserRouter>
                <Switch>
                    <Route path="/" component={Login} />
                    <Route path="/index" component={App} />
                </Switch>
            </BrowserRouter>
            
        )
    }
}

ReactDOM.render(
    <MRoute />,
    document.getElementById('root')
)