/**
 * Logs a message to the console with an ISO timestamp prefix.
 *
 * Depending on the provided type, it delegates to the corresponding
 * console method (`log`, `warn`, or `error`).
 *
 * @param {"log" | "warn" | "error"} [type="log"] - The type of console output to use.
 * @param {string} message - The message to be logged.
 * @param {boolean} [hour12=true] - The time format in 12 (true) or 24 (false) hours. Default "true"
 * @param {string} [lang="en-US"] - The lang of the time format. Default "en-US"
 *
 * @example
 * consolePrintWithTimedate("log", "Application started", false, "es-AR");
 * consolePrintWithTimedate("warn", "Low disk space", true, "en-US");
 * consolePrintWithTimedate("error", "Unhandled exception");
 */
const consolePrintWithTimedate = (type = "log", message, hour12 = true, lang = "en-US") => {
    const formatter = new Intl.DateTimeFormat(lang, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12
    });

    const logMsg = `[${formatter.format(new Date())}] - ${message}`;

    switch (type) {
        case "log":
            console.log(logMsg);
            break;

        case "warn":
            console.warn(logMsg);
            break;

        case "error":
            console.error(logMsg);
            break;

        default:
            break;
    }
}

export default consolePrintWithTimedate;