import chalk from "chalk";
export const logSuccess = (message) => {
    console.log(formatSuccess(message));
};
export const logError = (message) => {
    console.log(formatError(message));
};
export const logWarning = (message) => {
    console.log(formatWarning(message));
};
export const formatError = (message) => {
    return chalk.red.bold.inverse(message);
};
export const formatWarning = (message) => {
    return chalk.yellow.bold.inverse(message);
};
export const formatSuccess = (message) => {
    return chalk.green.bold.inverse(message);
};
//# sourceMappingURL=log.js.map