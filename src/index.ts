import express, { Request, Response, Express } from 'express'
import rateLimitMiddleware from './rateLimitMiddleware'

const app: Express = express();

app.use(rateLimitMiddleware({ maxRequests: 100, interval: 60 }));

app.get('/api/resource', (req: Request, res: Response) => {
  res.send('Resource data');
});

app.get('/api/endpoint', (req: Request, res: Response) => {
  res.send('Endpoint data')
})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
