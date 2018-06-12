import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, HashRouter} from 'react-router-dom'
import Login from "./Login";
import App from "./app";

class MRoute extends React.Component{
    render(){
        return(
            <BrowserRouter>
                <Switch>
                    <Route path="/admin" component={App}>
                       
                    </Route>
                </Switch>
            </BrowserRouter>
            
        )
    }
}

ReactDOM.render(
    <MRoute />,
    document.getElementById('root')
)