import { AtpAgent, AtpSessionEvent, AtpSessionData, RichText } from "@atproto/api";

import utils from "./utils";
import { Credential } from "./credentialManager";

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
                if (res.success) {
                    console.log(`Resumed session for ${agent.assertDid}`);
                    return new AtprotoAgent(agent);
                }
            } catch (error) {
                console.warn("Failed to resume session, falling back to credentials");
            }
        }

        if (credentials.identifier && credentials.password) {
            // Hardcoded to require app passwords for "security" reasons
            let userPassword = utils.verifyAppPassword(credentials.password);

            try {
                const res = await agent.login({
                    identifier: credentials.identifier,
                    password: userPassword,
                });

                if (res.success) {
                    console.log(`Logged into user ${agent.assertDid}`);
                    return new AtprotoAgent(agent);
                }
            } catch (error) {
                console.warn("Failed to login");
            }
        }

        throw new Error("No valid authentication method provided");
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
}
