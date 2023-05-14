import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
      children: [
        {
          path: '/employee',
          name: "Employee",
          component: ()=>import("../views/Employee/Employee.vue"),
          beforeEnter: (to, from, next) => {
            if (localStorage.getItem('role') !== 'SUPERADMIN') {
                next({name: "error"});
            } else {
                next();
            }
        }
        },
        {
          path: '/types',
          name: "Product-types",
          component: ()=>import("../views/Product/ProductType.vue")
        },
        {
          path: '/product',
          name: "Product",
          component: ()=>import("../views/Product/Product.vue")
        },
        {
          path: '/order',
          name: "Order",
          component: ()=>import("../views/Order/Order.vue")
        },
        {
          path: '/contact',
          name: "Contact",
          component: ()=>import("../views/Contact/Contact.vue")
        },
        {
          path: '/region',
          name: "Region",
          component: ()=>import("../views/Region/Region.vue")
        },
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: ()=>import("../views/Login/Login.vue")
    },
    {
      path: '/:pathMatch(.*)*',
      name: "Error",
      component: ()=>import("../views/Error/Error.vue")
    }

  ]
})

router.beforeEach((to, from, next)=>{
  let token = localStorage.getItem('token');
  if(to.name !== "login" && !token){
    next({name: 'login'})
  }else{
    next()
  }
})


export default router
