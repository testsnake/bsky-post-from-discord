import strings from "./strings.json";

// this is probably overkill for this project, but i'd
// hate myself if this was designed without i18n in mind

export class LocStr {
    private static fallbackLocale: string = "en-US";

    static r(path: string, locale: string): string {
        return this.resolve(path, locale);
    }

    static resolve(path: string, locale: string): string {
        const keys = path.split(".");

        let result = this.getNestedValue(keys, locale);

        if (result === null && locale !== this.fallbackLocale) {
            result = this.getNestedValue(keys, this.fallbackLocale);
        }

        return result ?? path;
    }

    private static getNestedValue(keys: string[], locale: string): string | null {
        let current: any = strings;

        for (const key of keys) {
            if (current && typeof current === "object" && key in current) {
                current = current[key];
            } else {
                return null;
            }
        }

        if (current && typeof current === "object" && locale in current) {
            return current[locale];
        }

        return null;
    }
}
