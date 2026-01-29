# bsky-post-from-discord

Allows posting to bluesky directly with discord commands

> [!CAUTION]
> This bot currently stores passwords in plain text, and may contain major security flaws. Use with EXTREME caution and always use app passwords.

Uses [create-discordx](https://github.com/discordx-ts/discordx/tree/main/packages/create-discordx#readme) as a base and uses the bluesky [typescript api](https://github.com/bluesky-social/atproto/tree/main/packages/api)

### TODO
- [X] Post using text and credentials in a single command without storing credentials
- [X] Login to account in a PDS agnostic way
- [ ] Store credentials in a not terrible way
- [ ] Account whitelisting for private bot instances
- [X] Language settings -> user changable
- [ ] 2fa support
#### Stretch Goals
- [ ] Image/Video uploads
  - may require some annoying server side compression(?)
  - image labeling
- [ ] Oauth support
  - may require a website to handle it(?)
- [ ] Session saving
- [ ] Good README.me file with instructions and whatnot

### How to use (WIP)

This is currently incomplete, but to test it, run `pnpm i`, add your `BOT_TOKEN` in a `.env` file, and then use `/post` with the bot. Sessions and credentials are not yet saved so you will need to input them every time.