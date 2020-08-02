import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [{
  path: '/login',
  name: 'login',
  meta: {
    title: 'Login - 登录',
    hideInMenu: true
  },
  component: () => import('@/view/login/login.vue')
},
{
  path: '/',
  name: '_home',
  redirect: '/home',
  component: Main,
  meta: {
    hideInMenu: true,
    notCache: true
  },
  children: [{
    path: '/home',
    name: 'home',
    meta: {
      hideInMenu: true,
      title: '首页',
      notCache: true,
      icon: 'md-home'
    },
    component: () => import('@/view/home-page')
  }]
},
// {
//   path: '/qsz',
//   name: '轻松装',
//   meta: {
//     icon: 'ios-construct',
//     title: '轻松装'
//   },
//   component: Main,
//   children: [{
//     path: 'qsz_order_list',
//     name: 'qsz_order_list',
//     meta: {
//       icon: 'md-list-box',
//       title: '订单列表'
//     },
//     component: () => import('@/view/qsz/order_list.vue')
//   }, {
//     path: 'qsz_user_list',
//     name: 'qsz_user_list',
//     meta: {
//       icon: 'md-contacts',
//       title: '用户管理'
//     },
//     component: () => import('@/view/qsz/user_list.vue')
//   }]
// },
{
  path: '/qsz_pf',
  name: '轻松装平台',
  meta: {
    icon: 'ios-construct',
    title: '轻松装'
  },
  component: Main,
  children: [{
    path: '/qsz_em',
    name: '师傅端',
    meta: {
      icon: 'ios-man',
      title: '师傅端'
    },
    component: parentView,
    children: [{
      path: 'jw_list',
      name: 'qsz_pf_jw_list',
      meta: {
        icon: 'md-cube',
        title: '旧物回收列表'
      },
      component: () => import('@/view/qsz_pf/jw_list.vue')
    }, {
      path: 'msg_list',
      name: 'qsz_pf_msg_list',
      meta: {
        icon: 'md-megaphone',
        title: '信息列表'
      },
      component: () => import('@/view/qsz_pf/msg_list.vue')
    }, {
      path: 'em_list',
      name: 'qsz_pf_em_list',
      meta: {
        icon: 'md-person',
        title: '员工列表'
      },
      component: () => import('@/view/qsz_pf/employee_list.vue')
    }, {
      path: 'tx_list',
      name: 'qsz_pf_tx_list',
      meta: {
        icon: 'logo-yen',
        title: '提现列表'
      },
      component: () => import('@/view/qsz_pf/withdrawal_list.vue')
    }]
  }, {
    path: 'sq_list',
    name: 'qsz_pf_sq_list',
    meta: {
      icon: 'ios-list',
      title: '社区列表'
    },
    component: () => import('@/view/qsz_pf/sq_list.vue')
  }, {
    path: 'fw_list',
    name: 'qsz_pf_fw_list',
    meta: {
      icon: 'md-pricetag',
      title: '服务项目'
    },
    component: () => import('@/view/qsz_pf/fw_list.vue')
  }, {
    path: 'order_list',
    name: 'qsz_pf_order_list',
    meta: {
      icon: 'md-list-box',
      title: '订单列表'
    },
    component: () => import('@/view/qsz_pf/order_list.vue')
  }, {
    path: 'user_list',
    name: 'qsz_pf_user_list',
    meta: {
      icon: 'md-contacts',
      title: '用户管理'
    },
    component: () => import('@/view/qsz_pf/user_list.vue')
  }, {
    path: 'sign_list',
    name: 'qsz_pf_sign_list',
    meta: {
      icon: 'md-log-in',
      title: '用户签到'
    },
    component: () => import('@/view/qsz_pf/sign_list.vue')
  }, {
    path: 'setting_list',
    name: 'qsz_pf_setting_list',
    meta: {
      icon: 'md-settings',
      title: '系统设置'
    },
    component: () => import('@/view/qsz_pf/setting_list.vue')
  }, {
    path: 'data_list',
    name: 'qsz_pf_data_list',
    meta: {
      icon: 'md-analytics',
      title: '数据统计'
    },
    component: () => import('@/view/qsz_pf/data_list.vue')
  }]
},
{
  path: '/platform',
  name: '市井服务信息平台',
  meta: {
    icon: 'ios-apps',
    title: '市井服务信息平台'
  },
  component: Main,
  children: [{
    path: '/qssh',
    name: '轻松生活',
    meta: {
      icon: 'md-beer',
      title: '轻松生活'
    },
    component: parentView,
    children: [{
      path: 'qssh_sq_list',
      name: 'qssh_sq_list',
      meta: {
        icon: 'ios-list',
        title: '社区列表'
      },
      component: () => import('@/view/qssh/sq_list.vue')
    }, {
      path: 'qssh_kw_list',
      name: 'qssh_kw_list',
      meta: {
        icon: 'ios-list',
        title: '关键词列表'
      },
      component: () => import('@/view/qssh/kw_list.vue')
    }, {
      path: 'qssh_order_list',
      name: 'qssh_order_list',
      meta: {
        icon: 'md-list-box',
        title: '需求列表'
      },
      component: () => import('@/view/qssh/order_list.vue')
    }]
  }, {
    path: 'platform_order_list',
    name: 'platform_order_list',
    meta: {
      icon: 'md-list-box',
      title: '订单列表'
    },
    component: () => import('@/view/platform/order_list.vue')
  }, {
    path: 'platform_user_list',
    name: 'platform_user_list',
    meta: {
      icon: 'md-contacts',
      title: '用户管理'
    },
    component: () => import('@/view/platform/user_list.vue')
  }]
},
{
  path: '/admin',
  name: 'admin',
  component: Main,
  children: [{
    path: 'manage_admin',
    name: 'manage_admin',
    meta: {
      icon: 'ios-person',
      title: '管理员管理'
    },
    component: () => import('@/view/manage/manage_admin.vue')
  }]
},
{
  path: '/argu',
  name: 'argu',
  meta: {
    hideInMenu: true
  },
  component: Main,
  children: [{
    path: 'params/:id',
    name: 'params',
    meta: {
      icon: 'md-flower',
      title: route => `{{ params }}-${route.params.id}`,
      notCache: true,
      beforeCloseName: 'before_close_normal'
    },
    component: () => import('@/view/argu-page/params.vue')
  },
  {
    path: 'query',
    name: 'query',
    meta: {
      icon: 'md-flower',
      title: route => `{{ query }}-${route.query.id}`,
      notCache: true
    },
    component: () => import('@/view/argu-page/query.vue')
  }
  ]
},
{
  path: '/401',
  name: 'error_401',
  meta: {
    hideInMenu: true
  },
  component: () => import('@/view/error-page/401.vue')
},
{
  path: '/500',
  name: 'error_500',
  meta: {
    hideInMenu: true
  },
  component: () => import('@/view/error-page/500.vue')
},
{
  path: '*',
  name: 'error_404',
  meta: {
    hideInMenu: true
  },
  component: () => import('@/view/error-page/404.vue')
}
]
