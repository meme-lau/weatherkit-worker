export class Console {
    static #level = 3;

    static #formatMsg = msg => {
        return msg.map(item => {
            if (typeof item === "object" && item !== null) {
                try {
                    return JSON.stringify(item, null, 2);
                } catch {
                    return item;
                }
            }
            return item;
        });
    };

    static debug = (...msg) => {
        if (Console.#level < 4) return;
        console.debug(...Console.#formatMsg(msg));
    };

    static info = (...msg) => {
        if (Console.#level < 3) return;
        console.info(...Console.#formatMsg(msg));
    };

    static warn = (...msg) => {
        if (Console.#level < 2) return;
        console.warn(...Console.#formatMsg(msg));
    };

    static error = (...msg) => {
        if (Console.#level < 1) return;
        const formatted = msg.map(item => (item instanceof Error ? (item.stack ?? item.message) : item));
        console.error(...Console.#formatMsg(formatted));
    };

    static exception = (...msg) => Console.error(...msg);

    static log = (...msg) => {
        if (Console.#level === 0) return;
        console.log(...Console.#formatMsg(msg));
    };

    static get logLevel() {
        switch (Console.#level) {
            case 0:
                return "OFF";
            case 1:
                return "ERROR";
            case 2:
                return "WARN";
            case 3:
            default:
                return "INFO";
            case 4:
                return "DEBUG";
            case 5:
                return "ALL";
        }
    }

    static set logLevel(level) {
        if (typeof level === "string") {
            level = level.toLowerCase();
        }
        switch (level) {
            case 0:
            case "off":
                Console.#level = 0;
                break;
            case 1:
            case "error":
                Console.#level = 1;
                break;
            case 2:
            case "warn":
            case "warning":
            default:
                Console.#level = 2;
                break;
            case 3:
            case "info":
                Console.#level = 3;
                break;
            case 4:
            case "debug":
                Console.#level = 4;
                break;
            case 5:
            case "all":
                Console.#level = 5;
                break;
        }
    }

    static clear = () => console.clear();
    static count = label => console.count(label);
    static countReset = label => console.countReset(label);
    static time = label => console.time(label);
    static timeEnd = label => console.timeEnd(label);
    static timeLog = (label, ...args) => console.timeLog(label, ...args);
}
