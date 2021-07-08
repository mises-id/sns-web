import { getAsyncComponent } from '@/utils/reactUtil'

const Home = getAsyncComponent(() => import(/* webpackChunkName: 'pageHome' */ '@/view/Home'))
const Found = getAsyncComponent(() => import(/* webpackChunkName: 'pageFound' */ '@/view/Found'))
const Follows = getAsyncComponent(() => import(/* webpackChunkName: 'pageFollow' */ '@/view/Follows'))
const Myself = getAsyncComponent(() => import(/* webpackChunkName: 'pageRadio' */ '@/view/Myself'))

const routeConfig = [
	{
		path: '/home',
		component: Home,
		routes: [
			{
				path: '/',
				component: Follows,
				exact: true
			},
			{
				path: '/found',
				component: Found
			},
			{
				path: '/myself',
				component: Myself
			}
		]
	}
]

export default routeConfig