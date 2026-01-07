export const SystemConfigKey = {
    LISTING_FEE_PERCENT: 'LISTING_FEE_PERCENT',
    INVOICE_PAYMENT_DUE_DAYS: 'INVOICE_PAYMENT_DUE_DAYS',
    INVOICE_AUTO_COMPLETED_DAYS: 'INVOICE_AUTO_COMPLETED_DAYS',
} as const;

export type SystemConfigKeyType = typeof SystemConfigKey[keyof typeof SystemConfigKey];

export interface SystemParameter {
    id: number;
    paramKey: string;
    paramValue: string;
    description?: string;
}

export interface UpdateSettingRequest {
    value: string;
}
