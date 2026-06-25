export class Lodash {
    static escape(string) {
        const map = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
        };
        return string.replace(/[&<>"']/g, m => map[m]);
    }

    static get(object = {}, path = "", defaultValue = undefined) {
        if (!Array.isArray(path)) path = Lodash.toPath(path);

        const result = path.reduce((previousValue, currentValue) => {
            return Object(previousValue)[currentValue];
        }, object);
        return result === undefined ? defaultValue : result;
    }

    static merge(object, ...sources) {
        if (object === null || object === undefined) return object;

        for (const source of sources) {
            if (source === null || source === undefined) continue;

            for (const key of Object.keys(source)) {
                const sourceValue = source[key];
                const targetValue = object[key];

                switch (true) {
                    case Lodash.#isPlainObject(sourceValue) && Lodash.#isPlainObject(targetValue):
                        object[key] = Lodash.merge(targetValue, sourceValue);
                        break;
                    case sourceValue instanceof Map && targetValue instanceof Map:
                        if (sourceValue.size > 0) {
                            for (const [k, v] of sourceValue) {
                                targetValue.set(k, v);
                            }
                        }
                        break;
                    case sourceValue instanceof Set && targetValue instanceof Set:
                        if (sourceValue.size > 0) {
                            for (const v of sourceValue) {
                                targetValue.add(v);
                            }
                        }
                        break;
                    case Array.isArray(sourceValue) && sourceValue.length === 0 && targetValue !== undefined:
                        break;
                    case sourceValue instanceof Map && sourceValue.size === 0 && targetValue !== undefined:
                    case sourceValue instanceof Set && sourceValue.size === 0 && targetValue !== undefined:
                        break;
                    case sourceValue !== undefined:
                        object[key] = sourceValue;
                        break;
                }
            }
        }

        return object;
    }

    static #isPlainObject(value) {
        if (value === null || typeof value !== "object") return false;
        const proto = Object.getPrototypeOf(value);
        return proto === null || proto === Object.prototype;
    }

    static omit(object = {}, paths = []) {
        if (!Array.isArray(paths)) paths = [paths.toString()];
        paths.forEach(path => Lodash.unset(object, path));
        return object;
    }

    static pick(object = {}, paths = []) {
        if (!Array.isArray(paths)) paths = [paths.toString()];
        const filteredEntries = Object.entries(object).filter(([key, _value]) => paths.includes(key));
        return Object.fromEntries(filteredEntries);
    }

    static set(object, path, value) {
        if (!Array.isArray(path)) path = Lodash.toPath(path);
        path.slice(0, -1).reduce((previousValue, currentValue, currentIndex) => (Object(previousValue[currentValue]) === previousValue[currentValue] ? previousValue[currentValue] : (previousValue[currentValue] = /^\d+$/.test(path[currentIndex + 1]) ? [] : {})), object)[path[path.length - 1]] = value;
        return object;
    }

    static toPath(value) {
        return value
            .replace(/\[(\d+)\]/g, ".$1")
            .split(".")
            .filter(Boolean);
    }

    static unescape(string) {
        const map = {
            "&amp;": "&",
            "&lt;": "<",
            "&gt;": ">",
            "&quot;": '"',
            "&#39;": "'",
        };
        return string.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, m => map[m]);
    }

    static unset(object = {}, path = "") {
        if (!Array.isArray(path)) path = Lodash.toPath(path);
        const result = path.reduce((previousValue, currentValue, currentIndex) => {
            if (currentIndex === path.length - 1) {
                delete previousValue[currentValue];
                return true;
            }

            return Object(previousValue)[currentValue];
        }, object);
        return result;
    }
}
