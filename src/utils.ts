import { AppBskyRichtextFacet } from "@atproto/api";

type AppPassword = string;
const appPasswordRegex = /^[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}$/;

export default class Utils {
    public static verifyAppPassword(password: string): AppPassword {
        if (appPasswordRegex.test(password)) {
            return password;
        } else {
            throw new Error("Password is not a valid app password");
        }
    }

    static atUriToBskyUrl(atUri: string, site: string = "https://bsky.app"): string {
        const withoutProtocol = atUri.replace(/^at:\/\//, "");

        const parts = withoutProtocol.split("/");

        if (parts.length < 3) {
            throw new Error("Invalid AT URI format");
        }

        const [did, collection, rkey] = parts;

        // record type
        const recordType = collection.split(".").pop();

        
        return `${site}/profile/${did}/${recordType}/${rkey}`;
    }
}
