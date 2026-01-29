import { AtpSessionData } from "@atproto/api";

export interface Credential {
    identifier?: string;
    password?: string;
    service: string;
    session?: AtpSessionData;
}

export interface DiscordCredentialResolverProps {
    discordIdentifier: string;
    atprotoService: string;
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

    public async getCredentials(props: DiscordCredentialResolverProps): Promise<Credential> {
        // TODO: Account saving based on discord identifier

        return {
            identifier: props.atprotoIdentifier,
            password: props.atprotoPassword,
            service: props.atprotoService,
        };
    }
}

export const credentialManager = CredentialManager.getCredentialManager();
