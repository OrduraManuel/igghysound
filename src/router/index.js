import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import About from "@/views/About.vue";
import Services from "@/views/Services.vue";
import Contact from "@/views/Contact.vue";
import Selections from "@/views/Selections.vue";

// auth
import FirstLog from "@/views/auth/FirstLog.vue";
import Dashboard from "@/views/auth/Dashboard.vue";

//Tracks
//import CreateTrack from "@/views/auth/Tracks/CreateTrack.vue";
import EditTrack from "@/views/auth/Tracks/EditTrack.vue";

import CreateStepper from "@/views/auth/CreateStepper.vue";

//Authors
import CreateAuthor from "@/views/auth/Authors/CreateAuthor.vue";
import EditAuthor from "@/views/auth/Authors/EditAuthor.vue";


// dashboard
import TracksDashboard from "@/views/auth/Tracks/Table.vue";
import AuthorsDashboard from "@/views/auth/Authors/Table.vue";


import NotFound from "@/views/404.vue";
import NetworkError from '@/views/NetworkError.vue'

// firebase imports
import { auth } from '@/api/config'

const redirectToLogin = (next) => {
  next({
    name: 'firstLog',
    query: { redirect: next.fullPath }
  });
};

const requireAuth = async (to, from, next) => {
  const user = auth.currentUser;

  if (!user) {
    redirectToLogin(next);
  } else {
    try {
      next();
    } catch (error) {
      console.error('Error while checking user authentication:', error);
      redirectToLogin(next);
    }
  }
};

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/about',
    name: 'about',
    component: About,
  },
  {
    path: '/services',
    name: 'services',
    component: Services,
  },
  {
    path: '/contact',
    name: 'contact',
    component: Contact,
  },
  {
    path: '/selections',
    name: 'selections',
    component: Selections,
  },
  {
    path: '/firstLog',
    name: 'firstLog',
    component: FirstLog,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    beforeEnter: requireAuth,
    children: [
      { path: 'tracks', name: 'trackTable', component: TracksDashboard},
      { path: 'authors', name: 'authorTable',component: AuthorsDashboard},
    
    ]
  },

  {
    path: '/dashboard/author/create',
    name: 'createAuthor',
    component: CreateAuthor,
  },
  {
    path: '/dashboard/tracks/edit:id',
    name: 'editTrack',
    component: EditTrack,
    props: true,
  },
  {
    path: '/dashboard/authors/edit:id',
    name: 'editAuthor',
    component: EditAuthor,
    props: true,
  },
  {
    path: '/:catchAll(.*)',
    name: 'notFound',
    component: NotFound,
  },
  {
    path: '/404/:resource',
    name: '404Resource',
    component: NotFound,
    props: true
  },
  {
    path: '/networkError',
    name: 'networkError',
    component: NetworkError,
  },
  {
    path: '/dashboard/stepperz/createStepper',
    name: 'createStepper',
    component: CreateStepper,
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router
