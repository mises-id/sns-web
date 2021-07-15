/*
 * @Author: lmk
 * @Date: 2021-07-08 14:52:19
 * @LastEditTime: 2021-07-15 16:15:21
 * @LastEditors: lmk
 * @Description: routerConfig
 */
import { getAsyncComponent } from '@/utils/reactUtil'

const Home = getAsyncComponent(() => import(/* webpackChunkName: 'pageHome' */ '@/view/Home'))
const Follows = getAsyncComponent(() => import(/* webpackChunkName: 'pageFollow' */ '@/view/Follows'))
const Me = getAsyncComponent(() => import(/* webpackChunkName: 'pageRadio' */ '@/view/Me'))
const UserInfo = getAsyncComponent(() => import(/* webpackChunkName: 'pageRadio' */ '@/view/UserInfo'))
const CreateMisesId = getAsyncComponent(() => import(/* webpackChunkName: 'CreateMisesId' */ '@/view/CreateMisesId'))
const Following = getAsyncComponent(() => import(/* webpackChunkName: 'Following' */ '@/view/Following'))
const Post = getAsyncComponent(() => import(/* webpackChunkName: 'Post' */ '@/view/Post'))
const Comment = getAsyncComponent(() => import(/* webpackChunkName: 'Comment' */ '@/view/Comment'))

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
				path: '/discover',
				component: Follows
			},
			{
				path: '/me',
				component: Me
			},
			{
				path: '/createMisesId',
				component: CreateMisesId
			}
		]
	},
	{
		path: '/userInfo',
		component: UserInfo,
	},
	{
		path: '/follow',
		component: Following,
	},
	{
		path: '/post',
		component: Post,
	},
	{
		path: '/comment',
		component: Comment,
	}
]

export default routeConfig