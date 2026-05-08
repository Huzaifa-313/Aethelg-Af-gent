/**
 * Error types for cross-language compatibility.
 */

export class PikoError extends Error {
  constructor(message: string, public readonly type: PikoErrorType) {
    super(message);
    this.name = type;
  }

  static api(message: string): PikoError {
    return new PikoError(message, 'Api');
  }

  static tool(message: string): PikoError {
    return new PikoError(message, 'Tool');
  }

  static permissionDenied(message: string): PikoError {
    return new PikoError(message, 'PermissionDenied');
  }

  static session(message: string): PikoError {
    return new PikoError(message, 'Session');
  }

  static config(message: string): PikoError {
    return new PikoError(message, 'Config');
  }

  static io(error: Error): PikoError {
    return new PikoError(error.message, 'Io');
  }

  static json(error: Error): PikoError {
    return new PikoError(error.message, 'Json');
  }

  static other(message: string): PikoError {
    return new PikoError(message, 'Other');
  }
}

export type PikoErrorType =
  | 'Api'
  | 'Tool'
  | 'PermissionDenied'
  | 'Session'
  | 'Config'
  | 'Io'
  | 'Json'
  | 'Other';