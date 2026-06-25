export class Storage {
    static data = {};
    static #nameRegex = /^@(?<key>[^.]+)(?:\.(?<path>.*))?$/;

    static getItem(keyName, defaultValue = null) {
        let keyValue = defaultValue;
        switch (keyName.startsWith("@")) {
            case true: {
                const { key, path } = keyName.match(Storage.#nameRegex)?.groups || {};
                keyName = key;
                let value = Storage.getItem(keyName, {});
                if (typeof value !== "object") value = {};
                keyValue = path.split(".").reduce((acc, curr) => Object(acc)[curr], value);
                try {
                    keyValue = JSON.parse(keyValue);
                } catch {}
                break;
            }
            default:
                keyValue = Storage.data[keyName];
                try {
                    keyValue = JSON.parse(keyValue);
                } catch {}
                break;
        }
        return keyValue ?? defaultValue;
    }

    static setItem(keyName, keyValue) {
        switch (typeof keyValue) {
            case "object":
                keyValue = JSON.stringify(keyValue);
                break;
            default:
                keyValue = String(keyValue);
                break;
        }
        switch (keyName.startsWith("@")) {
            case true: {
                const { key, path } = keyName.match(Storage.#nameRegex)?.groups || {};
                keyName = key;
                let value = Storage.getItem(keyName, {});
                if (typeof value !== "object") value = {};

                const paths = path.split(".");
                paths.slice(0, -1).reduce((acc, curr, idx) => {
                    if (Object(acc[curr]) !== acc[curr]) {
                        acc[curr] = /^\d+$/.test(paths[idx + 1]) ? [] : {};
                    }
                    return acc[curr];
                }, value)[paths[paths.length - 1]] = keyValue;

                Storage.setItem(keyName, value);
                break;
            }
            default:
                Storage.data[keyName] = keyValue;
                break;
        }
        return true;
    }

    static removeItem(keyName) {
        switch (keyName.startsWith("@")) {
            case true: {
                const { key, path } = keyName.match(Storage.#nameRegex)?.groups || {};
                keyName = key;
                let value = Storage.getItem(keyName);
                if (typeof value !== "object") value = {};

                const paths = path.split(".");
                paths.reduce((acc, curr, idx) => {
                    if (idx === paths.length - 1) {
                        delete acc[curr];
                        return true;
                    }
                    return Object(acc)[curr];
                }, value);

                Storage.setItem(keyName, value);
                break;
            }
            default:
                delete Storage.data[keyName];
                break;
        }
        return true;
    }

    static clear() {
        Storage.data = {};
        return true;
    }
}
