import { LocStr } from "./locStr";

const internalLocale = "en-US";

export class locError extends Error {
    public tag;

    constructor(tag: string) {
        super(LocStr.resolve(tag, internalLocale));
        this.tag = tag;

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, locError.prototype);
    }

    public resolveTag(locale: string): string {
        return LocStr.resolve(this.tag, locale);
    }
}
