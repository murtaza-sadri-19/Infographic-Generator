type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogOptions {
  context?: string;
  data?: unknown;
}

class Logger {
  private isDev = true;

  private formatMessage(level: LogLevel, message: string, context?: string): string {
    const timestamp = new Date().toISOString();
    const tag = context ? `[Infographik:${context}]` : '[Infographik]';
    return `${timestamp} ${tag} [${level.toUpperCase()}]: ${message}`;
  }

  debug(message: string, options?: LogOptions): void {
    if (this.isDev) {
      const msg = this.formatMessage('debug', message, options?.context);
      if (options?.data !== undefined) {
        console.debug(msg, options.data);
      } else {
        console.debug(msg);
      }
    }
  }

  info(message: string, options?: LogOptions): void {
    const msg = this.formatMessage('info', message, options?.context);
    if (options?.data !== undefined) {
      console.info(msg, options.data);
    } else {
      console.info(msg);
    }
  }

  warn(message: string, options?: LogOptions): void {
    const msg = this.formatMessage('warn', message, options?.context);
    if (options?.data !== undefined) {
      console.warn(msg, options.data);
    } else {
      console.warn(msg);
    }
  }

  error(message: string, error?: unknown, options?: LogOptions): void {
    const msg = this.formatMessage('error', message, options?.context);
    if (error !== undefined) {
      console.error(msg, error, options?.data ?? '');
    } else {
      console.error(msg);
    }
  }
}

export const logger = new Logger();
