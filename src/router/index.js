/*
 * @Author: lmk
 * @Date: 2021-07-08 14:52:19
 * @LastEditTime: 2021-08-18 22:37:02
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
const MyPosts = getAsyncComponent(() => import(/* webpackChunkName: 'MyPost' */ '@/view/MyPosts'))
const GreatePosts = getAsyncComponent(() => import(/* webpackChunkName: 'GreatePosts' */ '@/view/GreatePosts'))
const Forward = getAsyncComponent(() => import(/* webpackChunkName: 'Forward' */ '@/view/Forward'))
const Empty = getAsyncComponent(() => import(/* webpackChunkName: 'Empty' */ '@/view/Empty'))

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
	},
	{
		path: '/myPosts',
		component: MyPosts,
	},
	{
		path: '/createPosts',
		component: GreatePosts,
	},
	{
		path: '/forward',
		component: Forward,
	},
	{
		path: '/empty',
		component: Empty,
	}
]

export default routeConfig