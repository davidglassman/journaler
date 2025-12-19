export type Result<T> = { success: true; data: T } | { success: false; error: string };

export type VoidResult = { success: true } | { success: false; error: string };
