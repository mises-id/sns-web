## Building locally

- Install [Node.js](https://nodejs.org) version 14
    - If you are using [nvm](https://github.com/creationix/nvm#installation) (recommended) running `nvm use` will automatically choose the right node version for you.
- Install [Yarn](https://yarnpkg.com/en/docs/install)
- Install dependencies: `yarn` (not the usual install command)
- Build the project to the `./build/` folder with `yarn build`.

### Running Unit Tests

Run unit tests  with  `yarn test  -u`.

# Setting server URL

file `src/utils/request.js` setting value `baseURL`.

# Project Structure

```
├── README.md
├── appspec.yml
├── babel.config.js
├── public
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── manifest.json
│   ├── misesTwitter.jpg
│   ├── robots.txt
│   └── static
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
    │   ├── notifications.js
    │   ├── status.js
    │   ├── updata.js
    │   └── user.js
    ├── components
    │   ├── Cell
    │   │   ├── index.js
    │   │   ├── index.scss
    │   │   └── index.test.js
    │   ├── EditImage
    │   │   ├── index.js
    │   │   ├── index.test.js
    │   │   └── styles.scss
    │   ├── Empty
    │   │   ├── index.js
    │   │   ├── index.scss
    │   │   └── index.test.js
    │   ├── Image
    │   │   ├── index.js
    │   │   └── index.test.js
    │   ├── ImageList
    │   │   ├── index.js
    │   │   ├── index.test.js
    │   │   └── style.scss
    │   ├── MButton
    │   │   ├── index.js
    │   │   └── index.scss
    │   ├── NavBar
    │   │   ├── index.js
    │   │   └── index.test.js
    │   ├── NavbarRightButton
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
    │   ├── PullList
    │   │   ├── index.js
    │   │   └── index.test.js
    │   ├── ReplyInput
    │   │   ├── index.js
    │   │   ├── index.test.js
    │   │   └── style.scss
    │   ├── TouchImage
    │   │   ├── index.js
    │   │   ├── index.test.js
    │   │   └── style.scss
    │   └── UpLoad
    │       ├── index.js
    │       ├── index.test.js
    │       └── style.scss
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
    │   ├── index.css
    │   └── setZarmTheme.js
    ├── test
    │   └── testSetup.js
    ├── utils
    │   ├── Logger.js
    │   ├── index.js
    │   ├── postMessage.js
    │   ├── reactUtil.js
    │   └── request.js
    └── view
        ├── Airdrop
        │   ├── index.js
        │   ├── index.scss
        │   └── index.test.js
        ├── AirdropSuccess
        │   ├── index.js
        │   ├── index.scss
        │   └── index.test.js
        ├── BlackList
        │   ├── index.js
        │   ├── index.scss
        │   └── index.test.js
        ├── Comment
        │   ├── commentPop.js
        │   ├── index.js
        │   ├── index.scss
        │   └── index.test.js
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
        ├── MyLikes
        │   ├── index.js
        │   ├── index.scss
        │   └── index.test.js
        ├── MyPosts
        │   ├── index.js
        │   ├── index.scss
        │   └── index.test.js
        ├── Notifications
        │   ├── index.js
        │   ├── index.scss
        │   └── index.test.js
        ├── Post
        │   ├── index.js
        │   ├── index.scss
        │   └── index.test.js
        ├── ShareWith
        │   ├── index.js
        │   ├── index.scss
        │   └── index.test.js
        ├── UserDetail
        │   ├── UserFollowPage.js
        │   ├── UserLike.js
        │   ├── UserPost.js
        │   ├── index.js
        │   ├── index.scss
        │   └── index.test.js
        └── UserInfo
            ├── index.js
            ├── index.scss
            └── index.test.js
```
