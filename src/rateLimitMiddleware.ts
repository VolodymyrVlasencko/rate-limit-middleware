import type { Response, Request, NextFunction } from "express";
import type { RequestPerIpRecord, RaleLimitMiddlewareConfig } from './interfaces'

const requestsPerIpStore: Record<string, RequestPerIpRecord> = {}

const isMoreThenIntervalAgo = (interval: number, requestedAt: number): boolean => {
  if (!interval || !requestedAt) return false
  return (Date.now() - requestedAt) > interval * 1000
}

const requestsPerIpRecord = (record: RequestPerIpRecord, interval: number): RequestPerIpRecord => ({
  count: record ? record.count + 1 : 1,
  requestedAt: Date.now() + interval * 1000,
})

const isRequestLimitExceed = (count: number, maxCount: number): boolean => count > maxCount

const errorResponse = (res: Response, statusCode: number, message: string) => res.status(statusCode).send(message)

const rateLimitMiddleware = ({ maxRequests, interval }: RaleLimitMiddlewareConfig) => (req: Request, res: Response, next: NextFunction) => {
  const { ip } = req

  if (isMoreThenIntervalAgo(interval, requestsPerIpStore[ip]?.requestedAt)) {
    delete requestsPerIpStore[ip]
  }

  requestsPerIpStore[ip] = requestsPerIpRecord(requestsPerIpStore[ip], interval)

  if (isRequestLimitExceed(requestsPerIpStore[ip].count, maxRequests)) {
    return errorResponse(res, 429, 'Too many requests. Please try again in a minute')
  }

  next()
}

export default rateLimitMiddleware