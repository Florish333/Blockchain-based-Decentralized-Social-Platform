import {Router,Route,Switch} from 'dva/router'
import Layout from './layout/layout'

//总路由配置
export default function RouterConfig({history}){
    return(
        <Router history={history}>
            <Switch>
                 <Route path="/" ><Layout></Layout>
                </Route>
            </Switch>
          
        </Router>
    )
}

