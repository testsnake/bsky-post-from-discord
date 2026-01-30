import { AtpAgent, AtpSessionEvent, AtpSessionData, RichText } from "@atproto/api";

import utils from "./utils";
import { Credential } from "./credentialManager";
import { locError } from "./locError";

export interface PostProps {
    text: string;
    langs?: string[];
}

export class AtprotoAgent {
    agent: AtpAgent;

    private constructor(agent: AtpAgent) {
        this.agent = agent;
    }

    public static async createAgent(credentials: Credential): Promise<AtprotoAgent> {
        const agent = new AtpAgent({
            service: credentials.service,
        });

        if (credentials.session) {
            try {
                const res = await agent.resumeSession(credentials.session);
                if (res.success && agent.assertDid) {
                    console.log(`Resumed session for ${agent.assertDid}`);
                    return new AtprotoAgent(agent);
                }
            } catch (error) {
                if (!credentials.identifier || !credentials.password) {
                    throw new locError("command.error.account.sessionExpired");
                }
                console.warn("Failed to resume session, falling back to credentials");
            }
        }

        if (credentials.identifier && credentials.password) {
            // Hardcoded to require app passwords for "security" reasons
            let userPassword = utils.verifyAppPassword(credentials.password);

            let res;

            try {
                res = await agent.login({
                    identifier: credentials.identifier,
                    password: userPassword,
                });

                if (res.success && agent.assertDid) {
                    console.log(`Logged into user ${agent.assertDid}`);
                    return new AtprotoAgent(agent);
                }
            } catch (error) {
                console.warn("Failed to login");
                throw new locError("command.error.account.failedToAuthenticate");
            }
        }

        throw new locError("command.error.account.credentialsNotProvided");
    }

    public async post(props: PostProps) {
        const richText = new RichText({ text: props.text });
        await richText.detectFacets(this.agent);

        const post = await this.agent.post({
            text: props.text,
            facets: richText.facets,
            langs: props.langs,
        });

        return post;
    }

    public getAccountUri(): string {
        return this.agent.assertDid;
    }
}
