import { AppBskyRichtextFacet } from "@atproto/api";
import { locError } from "./locError";

type AppPassword = string;
const appPasswordRegex = /^[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}$/;

export default class Utils {
    public static verifyAppPassword(password: string): AppPassword {
        if (appPasswordRegex.test(password)) {
            return password;
        } else {
            throw new locError("command.error.post.account.failedAppPasswordCheck");
        }
    }

    static atUriToBskyUrl(atUri: string, site: string = "https://bsky.app"): string {
        const withoutProtocol = atUri.replace(/^at:\/\//, "");

        const parts = withoutProtocol.split("/");

        if (parts.length == 1) {
            // user profile

            const did = parts[0];
            
            return `${site}/profile/${did}`;
        } else if (parts.length == 3) {
            // user record (e.g. post)

            const [did, collection, rkey] = parts;

            // record type
            const recordType = collection.split(".").pop();

            return `${site}/profile/${did}/${recordType}/${rkey}`;
        }

        throw new locError("command.error.utils.unknownAtUriFormat");
    }
}
