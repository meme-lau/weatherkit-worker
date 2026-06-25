export async function fetch(resource, options = {}) {
    if (typeof resource === "string") {
        resource = { url: resource, ...options };
    } else {
        resource = { ...options, ...resource };
    }
    if (!resource.method) {
        resource.method = "GET";
        if (resource.body || resource.bodyBytes) {
            resource.method = "POST";
        }
    }
    const { url, headers, method, body, bodyBytes, timeout } = resource;
    const fetchOptions = {
        method,
        headers: headers ? { ...headers } : {},
    };
    const methodUpper = (method || "GET").toUpperCase();
    if (methodUpper !== "GET" && methodUpper !== "HEAD") {
        if (bodyBytes) {
            fetchOptions.body = bodyBytes;
        } else if (body) {
            fetchOptions.body = body;
        }
    }
    // 移除不必要的 header
    delete fetchOptions.headers?.Host;
    delete fetchOptions.headers?.[":authority"];
    delete fetchOptions.headers?.["Content-Length"];
    delete fetchOptions.headers?.["content-length"];

    let timeoutId;
    if (timeout) {
        const controller = new AbortController();
        fetchOptions.signal = controller.signal;
        const ms = timeout > 500 ? timeout : timeout * 1000;
        timeoutId = setTimeout(() => controller.abort(), ms);
    }

    try {
        const response = await globalThis.fetch(url, fetchOptions);
        const arrayBuffer = await response.arrayBuffer();
        const responseHeaders = {};
        response.headers.forEach((value, key) => {
            responseHeaders[key] = value;
        });

        return {
            ok: response.ok,
            status: response.status,
            statusCode: response.status,
            statusText: response.statusText,
            body: new TextDecoder("utf-8").decode(arrayBuffer),
            bodyBytes: arrayBuffer,
            headers: responseHeaders,
        };
    } finally {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    }
}
