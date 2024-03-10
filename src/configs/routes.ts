import { lazy } from 'react'
import ConfigPage from '~/pages/dashboard/config/ConfigPage'
// import AccountCreationPage from '~/pages/dashboard/config/account/AccountCreationPage'
// import AccountPage from '~/pages/dashboard/config/account/AccountPage'
import CourseCreationPage from '~/pages/dashboard/config/course/CourseCreationPage'
import CoursePage from '~/pages/dashboard/config/course/CoursePage'
import StudentCreationPage from '~/pages/dashboard/student/information/StudentCreationPage'
import StudentEditPage from '~/pages/dashboard/student/information/StudentEditPage'
import { StudentListPage } from '~/pages/dashboard/student/information/StudentListPage'
import TeacherCreationPage from '~/pages/dashboard/teacher/information/TeacherCreationPage'
import { TeacherListPage } from '~/pages/dashboard/teacher/information/TeacherListPage'
// Dashboard
const DashboardMainLayout = lazy(() => import('~/layouts/dashboard/main/MainLayout'))
const DashboardAuthLayout = lazy(() => import('~/layouts/dashboard/auth/AuthLayout'))

const DashboardStatisticPage = lazy(() => import('~/pages/dashboard/statistic/StatisticPage'))
const DashboardLoginPage = lazy(() => import('~/pages/dashboard/login/LoginPage'))
const DashboardFooterPage = lazy(() => import('~/pages/dashboard/footer/FooterPage'))

const DashboardHomePage = lazy(() => import('~/pages/dashboard/home/HomePage'))
const DashboardCoursePage = lazy(() => import('~/pages/dashboard/course/CoursePage'))
const DashboardPostPage = lazy(() => import('~/pages/dashboard/post/PostPage'))
const DashboardPostCreationPage = lazy(() => import('~/pages/dashboard/post/PostCreationPage'))



const routes = [
  // Dashboard pages
  {
    path: '',
    layout: DashboardMainLayout,
    component: DashboardStatisticPage,
    public: false
  },
  {
    path: '/login',
    layout: DashboardAuthLayout,
    component: DashboardLoginPage,
    public: true
  },
  {
    path: '/footer',
    layout: DashboardMainLayout,
    component: DashboardFooterPage,
    public: false
  },
  {
    path: '/home',
    layout: DashboardMainLayout,
    component: DashboardHomePage,
    public: false
  },
  {
    path: '/course',
    layout: DashboardMainLayout,
    component: DashboardCoursePage,
    public: false
  },
  {
    path: '/dashboard/post',
    layout: DashboardMainLayout,
    component: DashboardPostPage,
    public: false
  },
  {
    path: '/dashboard/post/creation',
    layout: DashboardMainLayout,
    component: DashboardPostCreationPage,
    public: false
  },
  {
    path: '/dashboard/post/update/:id',
    layout: DashboardMainLayout,
    component: DashboardPostCreationPage,
    public: false
  },
  {
    path: '/config',
    layout: DashboardMainLayout,
    component: ConfigPage,
    public: false
  },
  // {
  //   path: '/config/account',
  //   layout: DashboardMainLayout,
  //   component: AccountPage,
  //   public: false
  // },
  // {
  //   path: '/config/account/update/:id',
  //   layout: DashboardMainLayout,
  //   component: AccountCreationPage,
  //   public: false
  // },
  // {
  //   path: '/config/account/creation',
  //   layout: DashboardMainLayout,
  //   component: AccountCreationPage,
  //   public: false
  // },
  {
    path: 'config/course',
    layout: DashboardMainLayout,
    component: CoursePage,
    public: false
  },
  {
    path: 'config/course/update/:id',
    layout: DashboardMainLayout,
    component: CourseCreationPage,
    public: false
  },
  {
    path: 'config/course/creation',
    layout: DashboardMainLayout,
    component: CourseCreationPage,
    public: false
  },
  { 
    path: '/student',
    layout: DashboardMainLayout,
    component: StudentListPage,
    public: false
  },
  {
    path: '/student/creation',
    layout: DashboardMainLayout,
    component: StudentCreationPage,
    public: false
  },
  {
    path: '/student/:id',
    layout: DashboardMainLayout,
    component: StudentEditPage,
    public: false
  },
  {
    path: '/teacher',
    layout: DashboardMainLayout,
    component: TeacherListPage,
    public: false
  },
  {
    path: '/teacher/creation',
    layout: DashboardMainLayout,
    component: TeacherCreationPage,
    public: false
  },
  {
    path: '/teacher/:id',
    layout: DashboardMainLayout,
    component: StudentEditPage,
    public: false
  }

]

export default routes
