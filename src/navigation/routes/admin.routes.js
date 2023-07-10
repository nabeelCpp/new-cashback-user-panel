if (typeof window !== 'undefined') {
let user = JSON.parse(localStorage.getItem("userData"))
if(user?.co_founder == 1){
  var routes = [
    {
      icon: 'ri:dashboard-fill',
      title: 'Dashboard',
      path: '/dashboard'
    },
  
    {
      icon: 'mdi:graph-line',
      title: 'Upgrade Package',
      children: [
        {
          title: 'Plan',
          path: '/upgrade-pakages/plan'
        },
        {
          title: 'Plan History',
          path: '/upgrade-pakages/plan-history'
        }
      ]
    },
  
    {
      icon: 'ic:sharp-account-balance-wallet',
      title: 'Wallet Management',
      children: [
        {
          title: 'Transaction History',
          path: '/wallet-management/transaction-history'
        },
        {
          title: 'Wallet Balance',
          path: '/wallet-management/wallet-balance'
        },
        {
          title: 'Income Wallet Withdrawal',
          path: '/wallet-management/income-withdrawal'
        },
        {
          title: 'My Withdrawal Request',
          path: '/wallet-management/withdrawal-requests'
        }
      ]
    },
    
    {
      icon: 'mdi:people-group',
      title: 'Our Vendors',
      path: '/our-vendors/our-vendor'
    },
    
    {
      icon: 'iconamoon:profile-fill',
      title: 'Genealogy',
      children: [
        {
          title: 'Tree View',
          path: '/genealogy/tree-view'
        },
        {
          title: 'Downline Members',
          path: '/genealogy/downline-members'
        },
        {
          title: 'Direct Members',
          path: '/genealogy/direct-members'
        }
      ]
    },
   
    {
      icon: 'mdi:report-bell-curve',
      title: 'Earning Reports',
       children: [
        {
          title: 'Level Income Report',
          path: '/earning-reports/level-income',
         
        },
        {
          title: 'Co Founder Income Report',
          path: '/earning-reports/cofounder-income-report',
         
        }
      ]
    },
    
    {
      icon: 'iconamoon:invoice-fill',
      title: 'Invoice Section',
      children: [
        {
          title: 'My Package Purchase',
          path: '/invoice-section/package-purchase'
        },
        {
          title: 'My shopping Invoices',
          path: '/invoice-section/shopping-invoices'
        },
      ]
    },
    
    {
      icon: 'material-symbols:lock-person',
      title: 'Security Settings',
      children: [
        {
          title: 'Manage Profile',
          path: '/security-settings/manage-profile'
        },
        {
          title: 'Update Bank Details',
          path: '/security-settings/update-bank-details'
        },
        {
          title: 'Change Password',
          path: '/security-settings/change-password'
        }
      ]
    },
  
    {
      icon: 'mdi:comment-help',
      title: 'Help Desk System',
      children: [
        {
          title: 'Open A Ticket',
          path: '/help-desk-system/open-ticket'
        },
        {
          title: 'View Ticket Response',
          path: '/help-desk-system/ticket-response'
        }
      ]
    },
    
    {
      icon: 'mdi:invoice-check',
      title: 'Official Announcement',
      path: '/official-announcements'
    },
    {
      icon: 'ic:baseline-business-center',
      title: 'Business',
      children: [
        {
          title: 'Referral Link',
          path: '/business/reffer-links'
        }
      ]
    },
    
    {
      icon: 'material-symbols:add-circle',
      title: 'Register New Member',
      path: '/register?referral='+((typeof window !== 'undefined')?localStorage.referral:''),
      target: '_blank'
    }
  ]
}else{
  var routes = [
    {
      icon: 'ri:dashboard-fill',
      title: 'Dashboard',
      path: '/dashboard'
    },
  
    {
      icon: 'mdi:graph-line',
      title: 'Upgrade Package',
      children: [
        {
          title: 'Plan',
          path: '/upgrade-pakages/plan'
        },
        {
          title: 'Plan History',
          path: '/upgrade-pakages/plan-history'
        }
      ]
    },
  
    {
      icon: 'ic:sharp-account-balance-wallet',
      title: 'Wallet Management',
      children: [
        {
          title: 'Transaction History',
          path: '/wallet-management/transaction-history'
        },
        {
          title: 'Wallet Balance',
          path: '/wallet-management/wallet-balance'
        },
        {
          title: 'Income Wallet Withdrawal',
          path: '/wallet-management/income-withdrawal'
        },
        {
          title: 'My Withdrawal Request',
          path: '/wallet-management/withdrawal-requests'
        }
      ]
    },
    
    {
      icon: 'mdi:people-group',
      title: 'Our Vendors',
      path: '/our-vendors/our-vendor'
    },
    
    {
      icon: 'iconamoon:profile-fill',
      title: 'Genealogy',
      children: [
        {
          title: 'Tree View',
          path: '/genealogy/tree-view'
        },
        {
          title: 'Downline Members',
          path: '/genealogy/downline-members'
        },
        {
          title: 'Direct Members',
          path: '/genealogy/direct-members'
        }
      ]
    },
   
    {
      icon: 'mdi:report-bell-curve',
      title: 'Earning Reports',
       children: [
        {
          title: 'Level Income Report',
          path: '/earning-reports/level-income',
         
        }
      ]
    },
    
    {
      icon: 'iconamoon:invoice-fill',
      title: 'Invoice Section',
      children: [
        {
          title: 'My Package Purchase',
          path: '/invoice-section/package-purchase'
        },
        {
          title: 'My shopping Invoices',
          path: '/invoice-section/shopping-invoices'
        },
      ]
    },
    
    {
      icon: 'material-symbols:lock-person',
      title: 'Security Settings',
      children: [
        {
          title: 'Manage Profile',
          path: '/security-settings/manage-profile'
        },
        {
          title: 'Update Bank Details',
          path: '/security-settings/update-bank-details'
        },
        {
          title: 'Change Password',
          path: '/security-settings/change-password'
        }
      ]
    },
  
    {
      icon: 'mdi:comment-help',
      title: 'Help Desk System',
      children: [
        {
          title: 'Open A Ticket',
          path: '/help-desk-system/open-ticket'
        },
        {
          title: 'View Ticket Response',
          path: '/help-desk-system/ticket-response'
        }
      ]
    },
    
    {
      icon: 'mdi:invoice-check',
      title: 'Official Announcement',
      path: '/official-announcements'
    },
    {
      icon: 'ic:baseline-business-center',
      title: 'Business',
      children: [
        {
          title: 'Referral Link',
          path: '/business/reffer-links'
        }
      ]
    },
    
    {
      icon: 'material-symbols:add-circle',
      title: 'Register New Member',
      path: '/register?referral='+((typeof window !== 'undefined')?localStorage.referral:''),
      target: '_blank'
    }
  ]
}
}

export default routes
