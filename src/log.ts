import chalk from "chalk";

export const logSuccess = (message: string) => {
  console.log(formatSuccess(message));
};

export const logError = (message: string) => {
  console.log(formatError(message));
};

export const logWarning = (message: string) => {
  console.log(formatWarning(message));
};

export const formatError = (message: string): string => {
  return chalk.red.bold.inverse(message);
};

export const formatWarning = (message: string): string => {
  return chalk.yellow.bold.inverse(message);
};

export const formatSuccess = (message: string): string => {
  return chalk.green.bold.inverse(message);
};
