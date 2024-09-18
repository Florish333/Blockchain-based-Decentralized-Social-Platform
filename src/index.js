import dva from 'dva'
import Router from './router'
//import '@ant-design/icons'

const app = dva()
app.router(Router)
app.start('#root')

