import { Router } from "express";
import { app } from "./app.js";
import { userRoutes } from "./users/users.routes.js";
import { adminRoutes } from "./users/admin/admin.routes.js";
import { productRoutes } from "./products/products.routes.js";
import orderRoutes from "./orders/orders.route.js";
import paymentRoutes from "./payments/payments.routes.js";

export const routes = [
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/admin",
    route: adminRoutes,
  },
  {
    path: "/products",
    route: productRoutes,
  },
  {
    path: "/orders",
    route: orderRoutes,
  },
  {
    path: "/payments",
    route: paymentRoutes,
  },
];

const router = Router();
routes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
