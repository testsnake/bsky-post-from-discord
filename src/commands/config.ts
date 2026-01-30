import { ApplicationCommandOptionType, EmbedBuilder, MessageFlags, type CommandInteraction } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import { credentialManager } from "../credentialManager";
import { AtprotoAgent } from "../atprotoAgent";
import { LocStr } from "../locStr";
import Utils from "../utils";

const defaultService = "https://bsky.social";

@Discord()
@SlashGroup({ name: "config", description: "Configure your settings" })
@SlashGroup("config")
export class Config {
    @Slash({ name: "lang", description: "set the default language for new posts" })
    async lang() {}
}

@SlashGroup({
    name: "account",
    description: "user account",
    root: "config",
})
@SlashGroup("account", "config")
export class ConfigAccount {
    @Slash({ name: "set", description: "Set account settings" })
    async set(
        @SlashOption({
            name: "text",
            description: "Text to post",
            required: true,
            type: ApplicationCommandOptionType.String,
        })
        text: string,
        // TODO: Add autocomplete for previously used PDS URLs
        @SlashOption({
            name: "service",
            description: "PDS that hosts the account (usually bsky.social)",
            required: true,
            type: ApplicationCommandOptionType.String,
        })
        service: string | undefined,
        @SlashOption({
            name: "username",
            description: "Handle or email address of your account",
            required: true,
            type: ApplicationCommandOptionType.String,
        })
        username: string | undefined,
        @SlashOption({
            name: "password",
            description: "App password of your account (DO NOT USE YOUR ACTUAL PASSWORD)",
            required: true,
            type: ApplicationCommandOptionType.String,
        })
        password: string,
        interaction: CommandInteraction,
    ) {
        const agent = await credentialManager.getAgent({
            discordIdentifier: interaction.user.id,
            atprotoService: service || defaultService,
            atprotoIdentifier: username,
            atprotoPassword: password,
        });

        
    }

    @Slash({ name: "remove", description: "Remove your account" })
    async remove(interation: CommandInteraction) {
        const removal = await credentialManager.removeCredentials(interation.user.id);
    }

    @Slash({ name: "view", description: "View your account" })
    async view(interation: CommandInteraction) {
        try {
            const agent = await credentialManager.getAgent({ discordIdentifier: interation.user.id });

            const userIdentifier = agent.getAccountUri();

            console.log(`userDid = ${userIdentifier}`);

            const profileUrl = Utils.atUriToBskyUrl(userIdentifier);
        } catch (error) {
            // user not authenticated correctly
        }
    }
}
