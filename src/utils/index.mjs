export * from "./Console.mjs";
export * from "./fetch.mjs";
export * from "./Lodash.mjs";
export * from "./Storage.mjs";
export * from "./time.mjs";

export const $argument = globalThis.$argument ?? {};
export const argument = $argument;
