export const LogAction = {
    UPDATE_SYSTEM_CONFIG: 'UPDATE_SYSTEM_CONFIG',
    RESOLVE_DISPUTE: 'RESOLVE_DISPUTE',
    LOCK_USER: 'LOCK_USER',
    UNLOCK_USER: 'UNLOCK_USER',
    VERIFY_PRODUCT: 'VERIFY_PRODUCT',
    REJECT_PRODUCT: 'REJECT_PRODUCT',
    DISABLE_PRODUCT: 'DISABLE_PRODUCT',
    ENABLE_PRODUCT: 'ENABLE_PRODUCT',
} as const;

export type LogActionType = typeof LogAction[keyof typeof LogAction];

export interface AuditLog {
    id: number;
    adminUsername: string;
    action: LogActionType;
    targetId?: string;
    content?: string;
    createdAt: string;
}
