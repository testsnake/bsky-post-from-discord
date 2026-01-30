import { AtpSessionData } from "@atproto/api";
import { AtprotoAgent } from "./atprotoAgent";

export interface Credential {
    identifier?: string;
    password?: string;
    service: string;
    session?: AtpSessionData;
}

export interface DiscordCredentialResolverProps {
    discordIdentifier: string;
    atprotoService?: string;
    atprotoIdentifier?: string;
    atprotoPassword?: string;
}

class CredentialManager {
    private static credentialManager: CredentialManager;

    private constructor() {}

    public static getCredentialManager(): CredentialManager {
        if (!this.credentialManager) {
            this.credentialManager = new CredentialManager();
        }
        return this.credentialManager;
    }

    private async getCredentials(props: DiscordCredentialResolverProps): Promise<Credential> {
        // TODO: Account saving based on discord identifier

        // TODO: remove this after account saving completed
        const service = props.atprotoService || "https://bsky.social"

        return {
            identifier: props.atprotoIdentifier,
            password: props.atprotoPassword,
            service: service,
        };
    }

    public async getAgent(props: DiscordCredentialResolverProps): Promise<AtprotoAgent> {
        const credentials = await this.getCredentials(props);
        const agent = AtprotoAgent.createAgent(credentials);

        // TODO: Save session

        return agent;
    }

    public async removeCredentials(discordIdentifier: string): Promise<void> {

    }
}

export const credentialManager = CredentialManager.getCredentialManager();
