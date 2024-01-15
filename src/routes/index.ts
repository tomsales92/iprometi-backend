import Routes from 'express';
import recordDaysRouter from './recordDays';

const routes = Routes();

routes.use('/records', recordDaysRouter);

export default routes;