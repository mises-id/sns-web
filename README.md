```bash
├── README.md
├── appspec.yml
├── babel.config.js
├── config-overrides.js
├── jsconfig.json
├── package.json
├── public
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── scripts
│   ├── check.sh
│   ├── start_running.sh
│   └── stop_running.sh
└── src
    ├── App.js
    ├── App.test1.js
    ├── actions
    │   └── user.js
    ├── api
    │   ├── comment.js
    │   ├── fans.js
    │   ├── status.js
    │   ├── updata.js
    │   └── user.js
    ├── components
    │   ├── Cell
    │   │   ├── index.js
    │   │   ├── index.scss
    │   │   └── index.test.js
    │   ├── Empty
    │   │   ├── index.js
    │   │   ├── index.scss
    │   │   └── index.test.js
    │   ├── Image
    │   │   ├── index.js
    │   │   └── index.test.js
    │   ├── NavBar
    │   │   ├── index.js
    │   │   └── index.test.js
    │   ├── PostItem
    │   │   ├── index.js
    │   │   └── index.test.js
    │   ├── PostsIcons
    │   │   ├── common.js
    │   │   ├── index.js
    │   │   ├── index.scss
    │   │   └── index.test.js
    │   └── PullList
    │       ├── index.js
    │       └── index.test.js
    ├── index.js
    ├── locales
    │   ├── enUS.js
    │   └── index.js
    ├── logo.svg
    ├── reducers
    │   ├── index.js
    │   └── user.js
    ├── reportWebVitals.js
    ├── router
    │   └── index.js
    ├── setupTests.js
    ├── stores
    │   ├── index.js
    │   └── migrations.js
    ├── styles
    │   ├── App.css
    │   ├── common.scss
    │   ├── followPage.scss
    │   └── index.css
    ├── test
    │   └── testSetup.js
    ├── utils
    │   ├── Logger.js
    │   ├── index.js
    │   ├── postMessage.js
    │   ├── reactUtil.js
    │   └── request.js
    └── view
        ├── Comment
        │   ├── index.js
        │   ├── index.scss
        │   └── index.test.js
        ├── CreateMisesId
        │   ├── index.js
        │   ├── index.scss
        │   └── index.test.js
        ├── Discover
        │   ├── index.js
        │   └── index.test.js
        ├── Empty
        │   └── index.js
        ├── Following
        │   ├── index.js
        │   ├── index.scss
        │   └── index.test.js
        ├── Follows
        │   ├── Link
        │   │   ├── index.js
        │   │   ├── index.scss
        │   │   └── index.test.js
        │   ├── UserHeader
        │   │   ├── index.js
        │   │   └── index.test.js
        │   ├── index.js
        │   ├── index.scss
        │   └── index.test.js
        ├── Forward
        │   ├── index.js
        │   └── index.test.js
        ├── GreatePosts
        │   ├── index.js
        │   ├── index.scss
        │   └── index.test.js
        ├── Home
        │   ├── index.js
        │   ├── index.scss
        │   └── index.test.js
        ├── Me
        │   ├── index.js
        │   ├── index.scss
        │   └── index.test.js
        ├── MyPosts
        │   ├── index.js
        │   ├── index.scss
        │   └── index.test.js
        ├── Post
        │   ├── index.js
        │   ├── index.scss
        │   └── index.test.js
        └── UserInfo
            ├── index.js
            ├── index.scss
            └── index.test.js

36 directories, 102 files
```
### Mises Discover

- [x] `发布动态`：已实现发布纯文字效果
  - 待实现：
    - [ ] 上传图片
    - [ ] 裁剪图片
    - [ ] 图片添加文字
    - [ ] 选择是否私密、过期时间
- [x] `首页`：已实现三个tab的数据展示 点赞 评论 详情页等功能
  - 待实现：
    - [ ] 点击用户头像进入用户主页
    - [ ] 可查看Ta的粉丝列表
    - [ ] Ta已关注列表
    - [ ] 点赞记录列表
    - [ ] 图片预览
    - [ ] following增加关注用户更新提醒，点击头像进入用户主页
    - [ ] following增加动态提醒Notification 点击可查看互动记录
    - [ ] 动态详情展示的评论数据 最多展示三条二级评论 其余的点击按钮进入三级页面展示更多数据
    - [ ] Discover顶部增加用户推荐功能
    - [ ] 图片展示根据图片数量展示不同规格尺寸   **图片数量为1时，宽高比例为图片原始比例，图片数量>1 且图片数量<5 图片排版为2\*2 ，图片数量>5 图片排版为3*3**
- [x] `个人中心`：已完成我关注的、关注我的、已发布的动态列表、个人信息修改、未登录状态
  - 待实现：
    - [ ] 我的点赞记录列表
    - [ ] 我的通知提醒
- [ ] `其他功能待实现`：
  - [ ] 1.和浏览器端通过jsbirage调用sdk或函数等操作
  - [ ] 2.通过浏览器拿到misesid后与后台的操作

