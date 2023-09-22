export interface RequestPerIpRecord {
    count: number;
    requestedAt: number;
}

export interface RaleLimitMiddlewareConfig {
    maxRequests: number;
    interval: number;
}