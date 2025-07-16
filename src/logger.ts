import pino from 'pino';

const isDev = process.env.NODE_ENV !== 'production';

const baseLogger = pino({
  level: isDev ? 'debug' : 'info',
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
  base: undefined,
});

export const logger = {
  info: (...args: Parameters<typeof baseLogger.info>) =>
    baseLogger.info(...args),
  warn: (...args: Parameters<typeof baseLogger.warn>) =>
    baseLogger.warn(...args),
  error: (...args: Parameters<typeof baseLogger.error>) =>
    baseLogger.error(...args),
  debug: (...args: Parameters<typeof baseLogger.debug>) =>
    baseLogger.debug(...args),
  child: (bindings: Record<string, unknown>) => baseLogger.child(bindings),
};
