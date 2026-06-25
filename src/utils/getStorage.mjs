import { Console } from "./Console.mjs";
import { Lodash as _ } from "./Lodash.mjs";
import { Storage } from "./Storage.mjs";

const parseQs = arg => {
    if (typeof arg === "string") {
        try {
            const params = new URLSearchParams(arg);
            const obj = {};
            for (const [key, value] of params.entries()) {
                obj[key] = value;
            }
            return obj;
        } catch {
            return {};
        }
    }
    return arg ?? {};
};

globalThis.$argument = parseQs(globalThis.$argument);
if (globalThis.$argument.LogLevel) Console.logLevel = globalThis.$argument.LogLevel;

export default function getStorage(key, names, database) {
    if (database?.Default?.Settings?.LogLevel) Console.logLevel = database.Default.Settings.LogLevel;
    Console.debug("☑️ getStorage");
    names = [names].flat(Number.POSITIVE_INFINITY);

    const Root = { Settings: database?.Default?.Settings || {}, Configs: database?.Default?.Configs || {}, Caches: {} };

    const PersistentStore = Storage.getItem(key, {});
    if (PersistentStore) {
        names.forEach(name => {
            if (typeof PersistentStore?.[name]?.Settings === "string") {
                PersistentStore[name].Settings = JSON.parse(PersistentStore[name].Settings || "{}");
            }
            if (typeof PersistentStore?.[name]?.Caches === "string") {
                PersistentStore[name].Caches = JSON.parse(PersistentStore[name].Caches || "{}");
            }
        });
        if (PersistentStore.LogLevel) Console.logLevel = PersistentStore.LogLevel;
    }

    names.forEach(name => {
        _.merge(Root.Configs, database?.[name]?.Configs);
        _.merge(Root.Caches, PersistentStore?.[name]?.Caches);
    });

    const $argument = globalThis.$argument;

    names.forEach(name => {
        _.merge(Root.Settings, database?.[name]?.Settings);
    });
    _.merge(Root.Settings, $argument);
    names.forEach(name => {
        _.merge(Root.Settings, PersistentStore?.[name]?.Settings);
    });

    if (Root.Settings.LogLevel) Console.logLevel = Root.Settings.LogLevel;

    traverseObject(Root.Settings, (_key, value) => {
        switch (typeof value) {
            case "string":
                switch (value) {
                    case "true":
                    case "false":
                    case "[]":
                        value = JSON.parse(value);
                        break;
                    default:
                        if (value.includes(",")) value = value2array(value).map(item => string2number(item));
                        else value = string2number(value);
                }
                break;
        }
        return value;
    });

    return Root;
}

export function traverseObject(o, c) {
    for (const t in o) {
        const n = o[t];
        o[t] = "object" === typeof n && null !== n ? traverseObject(n, c) : c(t, n);
    }
    return o;
}

export function string2number(string) {
    if (/^\d+$/.test(string)) string = Number.parseInt(string, 10);
    return string;
}

export function value2array(value) {
    switch (typeof value) {
        case "string":
            return value.split(",");
        case "number":
        case "boolean":
            return [value];
        default:
            return value || [];
    }
}
