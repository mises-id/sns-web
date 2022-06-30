/*
 * @Author: lmk
 * @Date: 2021-07-08 14:52:19
 * @LastEditTime: 2022-06-29 10:31:39
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
import Download from '@/view/Download'
import NFTPage from '@/view/NFT'
import NFTDetail from '@/view/NFTDetail'
import AirdropResult from '@/view/AirdropResult'
import MyInvitation from '@/view/MyInvitation'
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
				path: '/recent',
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
		path: '/airdropResult',
		component: AirdropResult,
	},
	{
		path: '/error',
		component: Error,
	},
	{
		path: '/download',
		component: Download,
	},
	{
		path: '/NFT',
		component: NFTPage,
	},
	{
		path: '/NFTDetail',
		component: NFTDetail,
	},
	{
		path: '/myInvitation',
		component: MyInvitation,
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
},
{
	path: '/NFTDetail',
	component: NFTDetail,
},
{
	path: '/myInvitation',
	component: MyInvitation,
}]