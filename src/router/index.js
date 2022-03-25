/*
 * @Author: lmk
 * @Date: 2021-07-08 14:52:19
 * @LastEditTime: 2022-03-25 16:58:20
 * @LastEditors: lmk
 * @Description: routerConfig
 */
// import { getAsyncComponent } from '@/utils/reactUtil'
import BlackList from '@/view/BlackList'
import UserFollowPage from '@/view/UserDetail/UserFollowPage'
import UserDetail from '@/view/UserDetail'
import Home from '@/view/Home'
import MyLikes from '@/view/MyLikes'
import Follows from '@/view/Follows'
import Post from '@/view/Post'
import Comment from '@/view/Comment'
import MyPosts from '@/view/MyPosts'
import GreatePosts from '@/view/GreatePosts'
import Forward from '@/view/Forward'
import Notifications from '@/view/Notifications'
import ShareWith from '@/view/ShareWith'
import Airdrop from '@/view/Airdrop'
import AirdropSuccess from '@/view/AirdropSuccess'
import Error from '@/view/Error'
import Me from '@/view/Me'
import UserInfo from '@/view/UserInfo'
import Following from '@/view/Following'
// const BlackList = getAsyncComponent(() => import(/* webpackChunkName: 'pageHome' */ '@/view/BlackList'))
// const UserFollowPage = getAsyncComponent(() => import(/* webpackChunkName: 'pageHome' */ '@/view/UserDetail/UserFollowPage'))
// const UserDetail = getAsyncComponent(() => import(/* webpackChunkName: 'pageHome' */ '@/view/UserDetail'))
// const Home = getAsyncComponent(() => import(/* webpackChunkName: 'pageHome' */ '@/view/Home'))
// const MyLikes = getAsyncComponent(() => import(/* webpackChunkName: 'pageHome' */ '@/view/MyLikes'))
// const Follows = getAsyncComponent(() => import(/* webpackChunkName: 'pageFollow' */ '@/view/Follows'))
// const Me = getAsyncComponent(() => import(/* webpackChunkName: 'pageRadio' */ '@/view/Me'))
// const UserInfo = getAsyncComponent(() => import(/* webpackChunkName: 'pageRadio' */ '@/view/UserInfo'))
// const Following = getAsyncComponent(() => import(/* webpackChunkName: 'Following' */ '@/view/Following'))
// const Post = getAsyncComponent(() => import(/* webpackChunkName: 'Post' */ '@/view/Post'))
// const Comment = getAsyncComponent(() => import(/* webpackChunkName: 'Comment' */ '@/view/Comment'))
// const MyPosts = getAsyncComponent(() => import(/* webpackChunkName: 'MyPost' */ '@/view/MyPosts'))
// const GreatePosts = getAsyncComponent(() => import(/* webpackChunkName: 'GreatePosts' */ '@/view/GreatePosts'))
// const Forward = getAsyncComponent(() => import(/* webpackChunkName: 'Forward' */ '@/view/Forward'))
// const Notifications = getAsyncComponent(() => import(/* webpackChunkName: 'Empty' */ '@/view/Notifications'))
// const ShareWith = getAsyncComponent(() => import(/* webpackChunkName: 'Empty' */ '@/view/ShareWith'))
// const Airdrop = getAsyncComponent(() => import(/* webpackChunkName: 'Empty' */ '@/view/Airdrop'))
// const AirdropSuccess = getAsyncComponent(() => import(/* webpackChunkName: 'Empty' */ '@/view/AirdropSuccess'))
// const Error = getAsyncComponent(() => import(/* webpackChunkName: 'Empty' */ '@/view/Error'))
const routeConfig = [
	{
		path: '/home',
		component: Home,
		routes: [
			{
				path: '/following',
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
			}
		]
	},
	{
		path: '/post',
		component: Post,
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
		path: '/comment',
		component: Comment,
	},
	{
		path: '/myPosts',
		component: MyPosts,
	},
	{
		path: '/myLikes',
		component: MyLikes,
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
		path: '/notifications',
		component: Notifications,
	},
	{
		path: '/shareWith',
		component: ShareWith,
	},
	{
		path: '/blackList',
		component: BlackList,
	},
	{
		path: '/userDetail',
		component: UserDetail,
	},
	{
		path: '/userFollowPage',
		component: UserFollowPage,
	},
	{
		path: '/airdrop',
		component: Airdrop,
	},
	{
		path: '/airdropSuccess',
		component: AirdropSuccess,
	},
	{
		path: '/error',
		component: Error,
	}
]

export default routeConfig
//  If the user is not logged in
export const unAuthRoute = [{
	path: '/home',
	component: Home,
	routes: [
		{
			path: '/following',
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
		}
	]
},
{
	path: '/userDetail',
	component: UserDetail,
},
{
	path: '/userFollowPage',
	component: UserFollowPage,
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
	path: '/error',
	component: Error,
}]