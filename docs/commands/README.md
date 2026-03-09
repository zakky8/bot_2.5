# Bot Commands Documentation — Super Bot v3.0

## Discord Bot Commands (55 Total)

### AI (1)
- `/chat message:<text>` — Ask Claude AI (FAQ knowledge-base constrained answer)
- `/chat clear:true` — Reset your conversation history

> When Claude cannot answer from the FAQ it replies with an escalation message and notifies the moderator channel (HUMAN_MODERATOR_CHANNEL).

### Moderation (16)
- `/ban` — Permanently ban a member
- `/unban` — Remove a ban
- `/kick` — Kick a member
- `/mute` — Restrict a member from sending messages
- `/unmute` — Restore messaging permissions
- `/timeout` — Apply a Discord native timeout
- `/warn` — Issue an official warning
- `/warnings` — View a member's warning history
- `/clearwarnings` — Clear all warnings for a member
- `/purge` — Bulk-delete messages in a channel
- `/clear` — Delete a specific number of messages
- `/slowmode` — Set channel slow mode
- `/lockdown` — Lock a channel
- `/unlock` — Unlock a channel
- `/modlogs` — View moderation action log for a member
- `/reason` — Add/update reason for a mod action

### Leveling (12)
- `/rank` — Show your current XP rank card
- `/leaderboard` — Server XP leaderboard
- `/addxp` — Add XP to a member (admin)
- `/removexp` — Remove XP from a member (admin)
- `/setxp` — Set exact XP for a member (admin)
- `/setlevel` — Set a member's level directly (admin)
- `/resetlevels` — Reset all server levels (admin)
- `/xpmultiplier` — Set an XP multiplier for a role
- `/levelroles` — Configure roles awarded at each level
- `/levelconfig` — Configure XP gain settings
- `/levelmessage` — Set the level-up notification message
- `/levelchannel` — Set the channel for level-up messages

### Custom Commands (5)
- `/addcommand` — Create a custom slash command
- `/editcommand` — Edit an existing custom command
- `/removecommand` — Delete a custom command
- `/listcommands` — Show all custom commands
- `/customcommand` — Execute a custom command

### Reaction Roles (4)
- `/reactionrole` — Create a reaction role message
- `/addrr` — Add a reaction-role pair
- `/removerr` — Remove a reaction-role pair
- `/listrr` — List all reaction roles

### Engagement (7)
- `/poll` — Create a poll with up to 4 options
- `/giveaway` — Start a giveaway
- `/endgiveaway` — End a giveaway early
- `/reroll` — Re-roll a giveaway winner
- `/reminder` — Set a personal reminder
- `/timer` — Start a public countdown timer
- `/birthday` — Register a birthday

### Social Alerts (4)
- `/twitch` — Subscribe to Twitch live alerts
- `/youtube` — Subscribe to YouTube upload alerts
- `/twitter` — Subscribe to Twitter/X post alerts
- `/reddit` — Subscribe to subreddit new post alerts

### Utility (7)
- `/help` — Show all available commands
- `/ping` — Check bot latency
- `/serverinfo` — Display server details
- `/userinfo` — Display info about a member
- `/avatar` — Show a member's avatar
- `/roleinfo` — Display role permissions
- `/membercount` — Show current member count

---

## Telegram Bot Commands (104 Total)

### AI (3 + aisetup)
- `/chat <message>` — Ask Claude AI (FAQ-constrained)
- `/ask <question>` — Alias for /chat
- `/support <issue>` — Escalate directly to human moderator
- `/aisetup key|model|status|test|faq` — Configure AI at runtime (admin only)

> Escalation notifies HUMAN_MODERATOR_CHAT_ID automatically.

### Moderation (22)
- `/ban` `/unban` `/kick` `/mute` `/unmute`
- `/warn` `/unwarn` `/warns` `/resetwarns` `/setwarnlimit` `/setwarnmode`
- `/purge` `/spurge` `/purgefrom`
- `/pin` `/unpin` `/unpinall` `/pinned`
- `/report` `/adminlist` `/slowmode` `/zombies`

### Admin (11)
- `/promote` `/demote` `/title`
- `/setgtitle` `/setgpic` `/setdesc`
- `/setsticker` `/delsticker` `/invitelink`
- `/setlog` `/unsetlog`

### Anti-Spam (17)
- `/lock` `/unlock` `/locks` `/locktypes`
- `/flood` `/setflood` `/setfloodmode`
- `/blacklist` `/addblacklist` `/unblacklist` `/blacklistmode`
- `/captchamode` `/setcaptcha` `/captchatext` `/captchakick`
- `/antiraid` `/setantiraid`

### Greetings (10)
- `/welcome` `/setwelcome` `/resetwelcome`
- `/goodbye` `/setgoodbye` `/resetgoodbye`
- `/cleanwelcome` `/cleanservice`
- `/welcomemute` `/welcomemutehelp`

### Content (13)
- `/save` `/get` `/notes` `/clear` `/clearall`
- `/filter` `/stop` `/stopall` `/filters`
- `/rules` `/setrules` `/clearrules` `/privaterules`

### Federation (15)
- `/newfed` `/delfed` `/joinfed` `/leavefed` `/chatfed`
- `/fedinfo` `/fedpromote` `/feddemote` `/fedadmins`
- `/fban` `/unfban` `/fedbanlist` `/myfeds` `/frename` `/fednotif`

### Utility (11)
- `/start` `/help` `/info` `/id` `/ping` `/stats` `/settings`
- `/connect` `/disconnect` `/connection` `/allowconnect`

### Fun (5)
- `/hug` `/pat` `/slap` `/roll` `/runs`
