import { ApplicationCommandOptionType, EmbedBuilder, MessageFlags, type CommandInteraction } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { credentialManager } from "../credentialManager";
import { AtprotoAgent } from "../atprotoAgent";
import { LocStr } from "../locStr";
import Utils from "../utils";

// TODO: Maybe put this in a better place?
const defaultService = "https://bsky.social";

// TODO: allow this to be edited by the user in the future
const defaultClientLink = "https://bsky.app";

@Discord()
export class Post {
    @Slash({ name: "post", description: "post to your profile" })
    async post(
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
            required: false,
            type: ApplicationCommandOptionType.String,
        })
        service: string | undefined,
        @SlashOption({
            name: "username",
            description: "Handle or email address of your account",
            required: false,
            type: ApplicationCommandOptionType.String,
        })
        username: string | undefined,
        @SlashOption({
            name: "password",
            description: "App password of your account (DO NOT USE YOUR ACTUAL PASSWORD)",
            required: false,
            type: ApplicationCommandOptionType.String,
        })
        password: string | undefined,
        @SlashOption({
            name: "language",
            description: "Two letter language code, uses your clients language by default",
            required: false,
            type: ApplicationCommandOptionType.String,
        })
        language: string | undefined,
        interaction: CommandInteraction,
    ): Promise<void> {
        try {

            const userId = interaction.user.id;
            const credentials = await credentialManager.getCredentials({
                discordIdentifier: userId,
                atprotoService: service || defaultService,
                atprotoIdentifier: username,
                atprotoPassword: password,
            });
            const agent = await AtprotoAgent.createAgent(credentials);

            const lang = (language || interaction.locale.split("-")[0]).split(",");

            const post = await agent.post({
                text: text,
                langs: lang,
            });

            await interaction.reply({
                content: Utils.atUriToBskyUrl(post.uri, defaultClientLink),
                flags: !!password ? MessageFlags.Ephemeral : undefined,
            });
        } catch (error) {
            console.error(error);

            const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle(LocStr.r("command.error.post.failedToCreatePostTitle", interaction.locale))
                .setFooter({ text: "Bsky Bridge" })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        }
    }
}
