# DaoDao — WeChat Mini Program Marketplace

A WeChat Mini Program for a lightweight marketplace with item listings, search, chat, and a user center. Built with WeChat Cloud (CloudBase) and TDesign for WeChat Mini Programs.

## Features
- Browse goods: list, short list, and card views
- Item search and details pages
- Publish and manage your goods
- In-app chat with unread notification badge
- User center: profile (avatar, nickname), favorites and following
- Custom tab bar UI

## Tech Stack
- WeChat Mini Program (微信小程序)
- WeChat Cloud (CloudBase): database, storage, and cloud functions
- TDesign for WeChat Mini Program UI (`miniprogram_npm/tdesign-miniprogram`)

## Project Structure
```
 daodao/
  ├─ app.js               # App bootstrap, cloud init, user state
  ├─ app.json / app.wxss  # Global config and styles
  ├─ cloud/
  │   └─ getOpenId/       # Cloud function to fetch OPENID
  ├─ common/
  │   └─ updateManager.js # In-app update manager
  ├─ components/          # UI components (goods list/card, price, etc.)
  ├─ config/
  │   └─ constant.js      # Default avatar/name
  ├─ custom-tab-bar/      # Custom tab bar implementation
  ├─ goods_package/       # Goods: create, list, details, search pages
  ├─ pages/
  │   ├─ home/            # Home feed
  │   ├─ message/         # Chat list and chat page
  │   ├─ selling/         # Selling dashboard and my goods
  │   └─ usercenter/      # User center (profile, favorites, following)
  ├─ miniprogram_npm/     # Built npm deps (TDesign etc.)
  ├─ style/               # Global theme and iconfont
  └─ utils/               # Helpers
```

## Prerequisites
- WeChat DevTools (Latest)
- A CloudBase environment bound to your Mini Program (小程序已开通云开发)

## Quick Start
1. Clone and open in WeChat DevTools
   - Project directory: the `daodao` folder
   - Use your own Mini Program AppID
   - Check "Use CloudBase" (使用云开发)

2. Configure CloudBase env ID
   - In `app.js`, update `wx.cloud.init({ env: 'your-env-id' })` to your environment ID.
   - File reference: `app.js` lines near cloud init.

3. Deploy cloud function: getOpenId
   - In DevTools: Cloud > Functions > Create function named `getOpenId`
   - Replace its code with `cloud/getOpenId` and upload/deploy (一键上传并部署)
   - The function returns `openid`, `appid`, `unionid` via `cloud.getWXContext()`

4. Create CloudBase collections (数据库)
   - `users`: stores `userInfo` (avatar, nickname, cloudAvatarUrl, auth, etc.)
   - `chat-notify`: stores unread counters (`notifyNum`, `newChat`)
   - Suggested permissions during development: “仅创建者可读写”；adjust for production as needed.

5. NPM dependencies
   - `miniprogram_npm` is checked in. If DevTools prompts, run: Tools > Build NPM (构建 NPM)

6. Run
   - Click "Compile" (编译) in DevTools
   - Use the simulator to navigate tabs, create a profile, publish items, and test chat

## Environment & Data Flow
- App boot (in `app.js`):
  - Initializes CloudBase
  - Fetches `openid` via `getOpenId` cloud function and caches it in `Storage`
  - Loads `userInfo` from local cache or Cloud DB (`users` collection)
  - Ensures a `chat-notify` document exists for the current user
- User profile
  - Avatars are uploaded to Cloud Storage and the file ID is saved to `users.userInfo.cloudAvatarUrl`
  - A local saved file path is cached for performance

## Development Notes
- UI library: TDesign components are used from `miniprogram_npm/tdesign-miniprogram`
- Custom tab bar lives in `custom-tab-bar/`
- Global defaults (avatar/name) in `config/constant.js`
- Utilities in `utils/utils.js` (e.g., time formatting)

## Roadmap Ideas
- More robust goods schema and moderation tools
- Real-time chat message syncing and typing indicators
- Enhanced search and filters

## Contributing
- Fork, create a feature branch, and open a PR
- Keep edits focused and documented

## License
PolyForm Noncommercial 1.0.0 — noncommercial use only. See the `LICENSE` file. If you need a commercial license, please contact the author.

Note: Third-party libraries in `miniprogram_npm/` remain under their own licenses.

## Acknowledgements
- Tencent CloudBase
- TDesign for WeChat Mini Program
