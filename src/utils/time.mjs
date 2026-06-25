export function time(format, ts) {
    const date = ts ? new Date(ts) : new Date();
    const Time = {
        YY: date.getFullYear().toString().substring(3),
        yyyy: date.getFullYear().toString(),
        MM: (date.getMonth() + 1).toString().padStart(2, "0"),
        dd: date.getDate().toString().padStart(2, "0"),
        HH: date.getHours().toString().padStart(2, "0"),
        mm: date.getMinutes().toString().padStart(2, "0"),
        sss: date.getMilliseconds().toString().padStart(3, "0"),
        ss: date.getSeconds().toString().padStart(2, "0"),
        S: `${Math.floor(date.getMonth() / 3) + 1}`,
    };
    for (const [key, value] of Object.entries(Time)) {
        format = format.replace(key, value);
    }
    return format;
}
