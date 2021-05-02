export function userModulesPermission(userType) {
    switch(userType.toUpperCase()) {
        case "STUDENT":
            return {
                modules: [                    
                    { name: "Dashboard", icon: "fas fa-tachometer-alt", route: "/dashboard", slug: "dashboard" }, 
                    { name: "Notifications", icon: "fas fa-bell", route: "/notifications", slug: "notifications" },  
                    { name: "Enrollment", icon: "fas fa-edit", route: "", slug: "enrollment" },  
                    { name: "Request Subject", icon: "fas fa-cash-register", route: "/requestsubject", slug: "request" }, 
                    { name: "Assessment", icon: "fas fa-cash-register", route: "/assessment", slug: "assessment" },  
                    { name: "Study Load", icon: "fas fa-book-reader", route: "/studentstudyload", slug: "studyload" },  
                    { name: "E Grade", icon: "fas fa-table", route: "/egrade", slug: "egrade" },
                    { 
                        name: "Curriculum", icon: "fas fa-file", route: "", slug: "curriculum", 
                        submodules: [
                            {name: "Prospectus", icon: "fas fa-minus", route: "/prospectus", slug: "curriculum.prospectus" },
                            /* {name: "Behind", icon: "fas fa-minus", route: "/behind", slug: "curriculum.behind" },
                            {name: "Suggestion", icon: "fas fa-minus", route: "/suggestion", slug: "curriculum.suggestion" }, */
                            
                        ], 
                    }, 
                    { name: "Profile", icon: "fas fa-user", route: "/profile", slug: "profile" }                    
                ],
                permissions: [
                    { module: "Profile", view: true, create: false, update: true, delete: false },
                    { module: "Dashboard", view: true, create: false, update: false, delete: false },
                    { module: "Notifications", view: true, create: false, update: false, delete: false },
                    { module: "Enrollment", view: true, create: true, update: true, delete: false },
                    { module: "Assessment", view: true, create: false, update: false, delete: false },
                    { module: "Study Load", view: true, create: false, update: false, delete: false },
                    { module: "E Grade", view: true, create: false, update: false, delete: false }
                ]            
            };        

        case "DEAN":
            return {
                modules: [
                    { name: "Dashboard", icon: "fas fa-tachometer-alt", route: "/dashboard", slug: "dashboard" }, 
                    { name: "Notifications", icon: "fas fa-bell", route: "/notifications", slug: "notifications" },  
                    { 
                        name: "Enrollment", icon: "fas fa-edit", route: "", slug: "enrollment", 
                        submodules: [
                            {name: "Evaluation", icon: "fas fa-minus", route: "/enrollment/dean/evaluation", slug: "enrollment.evaluation" },
                            {name: "Registration", icon: "fas fa-minus", route: "/enrollment/dean/registration", slug: "enrollment.registration" },
                            {name: "Enrolled Subjects", icon: "fas fa-minus", route: "/enrollment/dean/subjects", slug: "enrollment.subjects" },
                            {name: "Promissory", icon: "fas fa-minus", route: "/enrollment/dean/promissory", slug: "enrollment.promissory" },
                            {name: "Adjustments", icon: "fas fa-minus", route: "/enrollment/dean/adjustments", slug: "enrollment.adjustments" },
                            {name: "Tracker", icon: "fas fa-minus", route: "/enrollment/dean/tracker", slug: "enrollment.tracker" },
                        ], 
                    }, 
                    { 
                        name: "Schedules", icon: "far fa-calendar-alt", route: "", slug: "schedules",
                        submodules: [
                            {name: "Department", icon: "fas fa-minus", route: "/schedules/department", slug: "schedules.department" },
                            {name: "View All", icon: "fas fa-minus", route: "/schedules/viewall", slug: "schedules.viewall" }
                        ], 
                    },
                    { 
                        name: "Assessment", icon: "fas fa-cash-register", route: "", slug: "assessment",
                        submodules: [
                            {name: "Assessment", icon: "fas fa-minus", route: "/assessment", slug: "assessment.assessment" },
                            {name: "Promissory", icon: "fas fa-minus", route: "/assessment/promissory", slug: "assessment.promissory" },
                        ], 
                    },    
                    { name: "Study Load", icon: "fas fa-book-reader", route: "/staffstudyload", slug: "studyload" },
                    { name: "Curriculum", icon: "fas fa-book", route: "/curriculum", slug: "curriculum" },  
                    { name: "E Grade", icon: "fas fa-table", route: "/egrade", slug: "egrade" }, 
                    { name: "Class List", icon: "fas fa-clipboard-list", route: "/classlist", slug: "classlist" },  
                    { name: "Teacher's Load", icon: "fas fa-chalkboard-teacher", route: "/teachersload", slug: "teachersload" }, 
                    { name: "Reports", icon: "fas fa-chart-bar", route: "/reports", slug: "reports" },
                    { name: "Profile", icon: "fas fa-user", route: "/profile", slug: "profile" }
                ],
                permissions: [
                    { module: "Profile", view: true, create: false, update: true, delete: false },
                    { module: "Dashboard", view: true, create: false, update: false, delete: false },
                    { module: "Notifications", view: true, create: true, update: false, delete: false },
                    { module: "Enrollment", view: true, create: true, update: true, delete: false },
                    { module: "Assessment", view: true, create: false, update: false, delete: false },
                    { module: "Study Load", view: true, create: false, update: false, delete: false },
                    { module: "E Grade", view: true, create: false, update: false, delete: false },
                    { module: "Class List", view: true, create: false, update: false, delete: false },
                    { module: "Teacher's Load", view: true, create: false, update: false, delete: false },
                    { module: "Reports", view: true, create: false, update: false, delete: false }
                ]            
            }; 
        
        case "CHAIRPERSON":
        return {
            modules: [
                { name: "Dashboard", icon: "fas fa-tachometer-alt", route: "/dashboard", slug: "dashboard" }, 
                { name: "Notifications", icon: "fas fa-bell", route: "/notifications", slug: "notifications" },  
                { 
                    name: "Enrollment", icon: "fas fa-edit", route: "", slug: "enrollment", 
                    submodules: [
                        {name: "Registration", icon: "fas fa-minus", route: "/enrollment/dean/registration", slug: "enrollment.registration" },
                        {name: "Enrolled Subjects", icon: "fas fa-minus", route: "/enrollment/dean/subjects", slug: "enrollment.subjects" },
                        {name: "Adjustments", icon: "fas fa-minus", route: "/enrollment/dean/adjustments", slug: "enrollment.adjustments" },
                        {name: "Tracker", icon: "fas fa-minus", route: "/enrollment/dean/tracker", slug: "enrollment.tracker" },
                    ], 
                }, 
                { 
                    name: "Schedules", icon: "far fa-calendar-alt", route: "", slug: "schedules",
                    submodules: [
                        {name: "Department", icon: "fas fa-minus", route: "/schedules/department", slug: "department" },
                        {name: "View All", icon: "fas fa-minus", route: "/schedules/viewall", slug: "viewall" }
                    ], 
                },
                { 
                    name: "Assessment", icon: "fas fa-cash-register", route: "", slug: "assessment",
                    submodules: [
                        {name: "Assessment", icon: "fas fa-minus", route: "/assessment", slug: "assessment.assessment" },
                        {name: "Promissory", icon: "fas fa-minus", route: "/assessment/promissory", slug: "assessment.promissory" },
                    ], 
                },
                { name: "Study Load", icon: "fas fa-book-reader", route: "/staffstudyload", slug: "studyload" },  
                { name: "E Grade", icon: "fas fa-table", route: "/egrade", slug: "egrade" }, 
                { name: "Class List", icon: "fas fa-clipboard-list", route: "/classlist", slug: "classlist" },  
                { name: "Teacher's Load", icon: "fas fa-chalkboard-teacher", route: "/teachersload", slug: "teachersload" }, 
                { name: "Reports", icon: "fas fa-chart-bar", route: "/reports", slug: "reports" },
                { name: "Profile", icon: "fas fa-user", route: "/profile", slug: "profile" }
            ],
            permissions: [
                { module: "Profile", view: true, create: false, update: true, delete: false },
                { module: "Dashboard", view: true, create: false, update: false, delete: false },
                { module: "Notifications", view: true, create: true, update: false, delete: false },
                { module: "Enrollment", view: true, create: true, update: true, delete: false },
                { module: "Assessment", view: true, create: false, update: false, delete: false },
                { module: "Study Load", view: true, create: false, update: false, delete: false },
                { module: "E Grade", view: true, create: false, update: false, delete: false },
                { module: "Class List", view: true, create: false, update: false, delete: false },
                { module: "Teacher's Load", view: true, create: false, update: false, delete: false },
                { module: "Reports", view: true, create: false, update: false, delete: false }
            ]            
        };

        case "COOR":
            return {
                modules: [
                    { name: "Dashboard", icon: "fas fa-tachometer-alt", route: "/dashboard", slug: "dashboard" }, 
                    { name: "Notifications", icon: "fas fa-bell", route: "/notifications", slug: "notifications" },  
                    { 
                        name: "Enrollment", icon: "fas fa-edit", route: "", slug: "enrollment", 
                        submodules: [
                            {name: "Registration", icon: "fas fa-minus", route: "/enrollment/dean/registration", slug: "enrollment.registration" },
                            {name: "Enrolled Subjects", icon: "fas fa-minus", route: "/enrollment/dean/subjects", slug: "enrollment.subjects" },
                            {name: "Tracker", icon: "fas fa-minus", route: "/enrollment/dean/tracker", slug: "enrollment.tracker" }
                        ], 
                    }, 
                    { 
                        name: "Schedules", icon: "far fa-calendar-alt", route: "", slug: "schedules",
                        submodules: [
                            {name: "Department", icon: "fas fa-minus", route: "/schedules/department", slug: "schedules.department" },
                            {name: "View All", icon: "fas fa-minus", route: "/schedules/viewall", slug: "schedules.viewall" }
                        ], 
                    },
                    //{ name: "Assessment", icon: "fas fa-cash-register", route: "/assessment" },  
                    { name: "Study Load", icon: "fas fa-book-reader", route: "/staffstudyload", slug: "studyload" },  
                    { name: "E Grade", icon: "fas fa-table", route: "/egrade", slug: "egrade" },  
                    { name: "Class List", icon: "fas fa-clipboard-list", route: "/classlist", slug: "classlist" }, 
                    { name: "Teacher's Load", icon: "fas fa-chalkboard-teacher", route: "/teachersload", slug: "teachersload" },  
                    { name: "Reports", icon: "fas fa-chart-bar", route: "/reports", slug: "reports" },
                    { name: "Profile", icon: "fas fa-user", route: "/profile", slug: "profile" }
                ],
                permissions: [
                    { module: "Profile", view: true, create: false, update: true, delete: false },
                    { module: "Dashboard", view: true, create: false, update: false, delete: false },
                    { module: "Notifications", view: true, create: true, update: false, delete: false },
                    { module: "Enrollment", view: true, create: true, update: true, delete: false },
                    { module: "Assessment", view: true, create: false, update: false, delete: false },
                    { module: "Study Load", view: true, create: false, update: false, delete: false },
                    { module: "E Grade", view: true, create: false, update: false, delete: false },
                    { module: "Class List", view: true, create: false, update: false, delete: false },
                    { module: "Teacher's Load", view: true, create: false, update: false, delete: false },
                    { module: "Reports", view: true, create: false, update: false, delete: false }
                ]            
            };  

        case "ACAD":
            return {
                modules: [
                    { name: "Dashboard", icon: "fas fa-tachometer-alt", route: "/dashboard", slug: "dashboard" }, 
                    { name: "Notifications", icon: "fas fa-bell", route: "/notifications", slug: "notifications" },  
                    { 
                        name: "Enrollment", icon: "fas fa-edit", route: "", slug: "enrollment", 
                        submodules: [
                            //{name: "Registration", icon: "fas fa-minus", route: "/enrollment/dean/registration" },
                            //{name: "Enrolled Subjects", icon: "fas fa-minus", route: "/enrollment/dean/subjects" },
                            {name: "Promissory", icon: "fas fa-minus", route: "/enrollment/dean/promissory", slug: "enrollment.promissory" },
                            {name: "Tracker", icon: "fas fa-minus", route: "/enrollment/dean/tracker", slug: "enrollment.tracker" }
                        ], 
                    }, 
                    { 
                        name: "Schedules", icon: "far fa-calendar-alt", route: "", slug: "schedules",
                        submodules: [
                            {name: "View All", icon: "fas fa-minus", route: "/schedules/viewall", slug: "schedules.viewall" }
                        ], 
                    },
                    { 
                        name: "Assessment", icon: "fas fa-cash-register", route: "", slug: "assessment",
                        submodules: [
                            {name: "Assessment", icon: "fas fa-minus", route: "/assessment", slug: "assessment.assessment" },
                            {name: "Promissory", icon: "fas fa-minus", route: "/assessment/promissory", slug: "assessment.promissory" },
                        ],                
                    }, 
                    { name: "Study Load", icon: "fas fa-book-reader", route: "/staffstudyload", slug: "studyload" },  
                    { name: "E Grade", icon: "fas fa-table", route: "/egrade", slug: "egrade" }, 
                    { name: "Class List", icon: "fas fa-clipboard-list", route: "/classlist", slug: "classlist" },  
                    { name: "Teacher's Load", icon: "fas fa-chalkboard-teacher", route: "/teachersload", slug: "teachersload" }, 
                    { name: "Reports", icon: "fas fa-chart-bar", route: "/reports", slug: "reports" },
                    { name: "Profile", icon: "fas fa-user", route: "/profile", slug: "profile" }
                ],
                permissions: [
                    { module: "Profile", view: true, create: false, update: true, delete: false },
                    { module: "Dashboard", view: true, create: false, update: false, delete: false },
                    { module: "Notifications", view: true, create: true, update: false, delete: false },
                    { module: "Enrollment", view: true, create: true, update: true, delete: false },
                    { module: "Assessment", view: true, create: false, update: false, delete: false },
                    { module: "Study Load", view: true, create: false, update: false, delete: false },
                    { module: "E Grade", view: true, create: false, update: false, delete: false },
                    { module: "Class List", view: true, create: false, update: false, delete: false },
                    { module: "Teacher's Load", view: true, create: false, update: false, delete: false },
                    { module: "Reports", view: true, create: false, update: false, delete: false }
                ]            
            };  
        
        case "LINKAGE":
            return {
                modules: [
                    { name: "Dashboard", icon: "fas fa-tachometer-alt", route: "/dashboard", slug: "dashboard" }, 
                    { name: "Notifications", icon: "fas fa-bell", route: "/notifications", slug: "notifications" },  
                    { 
                        name: "Enrollment", icon: "fas fa-edit", route: "", slug: "enrollment", 
                        submodules: [
                            //{name: "Registration", icon: "fas fa-minus", route: "/enrollment/dean/registration" },
                            //{name: "Enrolled Subjects", icon: "fas fa-minus", route: "/enrollment/dean/subjects" },
                            {name: "Tracker", icon: "fas fa-minus", route: "/enrollment/edp/tracker", slug: "enrollment.tracker" }
                        ], 
                    }, 
                    //{ name: "Schedules", icon: "far fa-calendar-alt", route: "/schedules"}, 
                    //{ name: "Assessment", icon: "fas fa-cash-register", route: "/assessment" },  
                    { name: "Study Load", icon: "fas fa-book-reader", route: "/staffstudyload", slug: "studyload" },  
                    { name: "E Grade", icon: "fas fa-table", route: "/egrade", slug: "egrade" }, 
                    { name: "Class List", icon: "fas fa-clipboard-list", route: "/classlist", slug: "classlist"}, 
                    { name: "Teacher's Load", icon: "fas fa-chalkboard-teacher", route: "/teachersload", slug: "teachersload" },  
                    { name: "Reports", icon: "fas fa-chart-bar", route: "/reports", slug: "reports" },
                    { name: "Profile", icon: "fas fa-user", route: "/profile", slug: "profile" }
                ],
                permissions: [
                    { module: "Profile", view: true, create: false, update: true, delete: false },
                    { module: "Dashboard", view: true, create: false, update: false, delete: false },
                    { module: "Notifications", view: true, create: true, update: false, delete: false },
                    { module: "Enrollment", view: true, create: true, update: true, delete: false },
                    { module: "Assessment", view: true, create: false, update: false, delete: false },
                    { module: "Study Load", view: true, create: false, update: false, delete: false },
                    { module: "E Grade", view: true, create: false, update: false, delete: false },
                    { module: "Class List", view: true, create: false, update: false, delete: false },
                    { module: "Teacher's Load", view: true, create: false, update: false, delete: false },
                    { module: "Reports", view: true, create: false, update: false, delete: false }
                ]            
            }; 

        case "ACCOUNTING":
            return {
                modules: [
                    { name: "Dashboard", icon: "fas fa-tachometer-alt", route: "/dashboard", slug: "dashboard" }, 
                    { name: "Notifications", icon: "fas fa-bell", route: "/notifications", slug: "notifications" },  
                    { 
                        name: "Enrollment", icon: "fas fa-edit", route: "", slug: "enrollment", 
                        submodules: [
                            {name: "Set Balance", icon: "fas fa-minus", route: "/enrollment/accounting/setbalance", slug: "enrollment.setbalance" },
                            {name: "Tracker", icon: "fas fa-minus", route: "/enrollment/accounting/tracker", slug: "enrollment.tracker" },
                        ],
                    },   
                    { name: "Assessment", icon: "fas fa-cash-register", route: "/assessment", slug: "assessment" },  
                    { name: "Study Load", icon: "fas fa-book-reader", route: "/staffstudyload", slug: "studyload" }, 
                    { name: "E Grade", icon: "fas fa-table", route: "/egrade", slug: "egrade" },     
                    { name: "Teacher's Load", icon: "fas fa-chalkboard-teacher", route: "/teachersload", slug: "teachersload" },                
                    { name: "Reports", icon: "fas fa-chart-bar", route: "/reports", slug: "reports" },
                    { name: "Profile", icon: "fas fa-user", route: "/profile", slug: "profile" }
                ],
                permissions: [
                    { module: "Profile", view: true, create: false, update: true, delete: false },
                    { module: "Dashboard", view: true, create: false, update: false, delete: false },
                    { module: "Notifications", view: true, create: true, update: false, delete: false },
                    { module: "Enrollment", view: true, create: true, update: true, delete: false },
                    { module: "Assessment", view: true, create: false, update: false, delete: false },
                    { module: "Reports", view: true, create: false, update: false, delete: false }
                ]            
            }; 
        
        case "CASHIER":
            return {
                modules: [
                    { name: "Dashboard", icon: "fas fa-tachometer-alt", route: "/dashboard", slug: "dashboard" }, 
                    { name: "Notifications", icon: "fas fa-bell", route: "/notifications", slug: "notifications" },  
                    { 
                        name: "Enrollment", icon: "fas fa-edit", route: "", slug: "enrollment", 
                        submodules: [
                            {name: "Payment", icon: "fas fa-minus", route: "/enrollment/cashier/payment", slug: "enrollment.payment" },
                            {name: "Tracker", icon: "fas fa-minus", route: "/enrollment/cashier/tracker", slug: "enrollment.tracker" },
                        ],
                    },  
                    { 
                        name: "Assessment", icon: "fas fa-cash-register", route: "", slug: "assessment",
                        submodules: [
                            {name: "Assessment", icon: "fas fa-minus", route: "/assessment", slug: "assessment.assessment" },
                            {name: "Payment", icon: "fas fa-minus", route: "/assessment/payment", slug: "assessment.payment" },
                        ],                
                    }, 
                    { name: "E Grade", icon: "fas fa-table", route: "/egrade", slug: "egrade" }, 
                    { name: "Teacher's Load", icon: "fas fa-chalkboard-teacher", route: "/teachersload", slug: "teachersload" }, 
                    { name: "Reports", icon: "fas fa-chart-bar", route: "/reports", slug: "reports" },
                    { name: "Profile", icon: "fas fa-user", route: "/profile", slug: "profile" }
                ],
                permissions: [
                    { module: "Profile", view: true, create: false, update: true, delete: false },
                    { module: "Dashboard", view: true, create: false, update: false, delete: false },
                    { module: "Notifications", view: true, create: true, update: false, delete: false },
                    { module: "Enrollment", view: true, create: true, update: true, delete: false },
                    { module: "Assessment", view: true, create: false, update: false, delete: false },
                    { module: "Reports", view: true, create: false, update: false, delete: false }
                ]            
            };   
        
        case "FACULTY":
            return {
                modules: [
                    { name: "Dashboard", icon: "fas fa-tachometer-alt", route: "/dashboard", slug: "dashboard" }, 
                    { name: "Notifications", icon: "fas fa-bell", route: "/notifications", slug: "notifications" },    
                    //{ name: "Study Load", icon: "fas fa-book-reader", route: "/studyload" },  
                    { name: "E Grade", icon: "fas fa-table", route: "/egrade", slug: "egrade" }, 
                    //{ name: "Class List", icon: "fas fa-clipboard-list", route: "/classlist" },  
                    { name: "Teacher's Load", icon: "fas fa-chalkboard-teacher", route: "/teachersload", slug: "teachersload" },
                    { name: "Profile", icon: "fas fa-user", route: "/profile", slug: "profile" }
                
                ],
                permissions: [
                    { module: "Profile", view: true, create: false, update: true, delete: false },
                    { module: "Dashboard", view: true, create: false, update: false, delete: false },
                    { module: "Notifications", view: true, create: true, update: false, delete: false },                  
                    { module: "Study Load", view: true, create: false, update: false, delete: false },
                    { module: "E Grade", view: true, create: false, update: false, delete: false },
                    { module: "Class List", view: true, create: false, update: false, delete: false },
                    { module: "Teacher's Load", view: true, create: false, update: false, delete: false }
                ]            
            }; 
        
        case "REGISTRAR": 
            return {
                modules: [
                    { name: "Dashboard", icon: "fas fa-tachometer-alt", route: "/dashboard", slug: "dashboard" }, 
                    { name: "Notifications", icon: "fas fa-bell", route: "/notifications", slug: "notifications" },  
                    { 
                        name: "Enrollment", icon: "fas fa-edit", route: "", slug: "enrollment", 
                        submodules: [
                            {name: "Registration", icon: "fas fa-minus", route: "/enrollment/registrar/registration", slug: "enrollment.registration" },
                            {name: "Tracker", icon: "fas fa-minus", route: "/enrollment/registrar/tracker", slug: "enrollment.tracker" },
                        ], 
                    },
                    { name: "E Grade", icon: "fas fa-table", route: "/egrade", slug: "egrade" },     
                    { name: "Teacher's Load", icon: "fas fa-chalkboard-teacher", route: "/teachersload", slug: "teachersload" },                
                    { name: "Reports", icon: "fas fa-chart-bar", route: "/reports", slug: "reports" },
                    { name: "Profile", icon: "fas fa-user", route: "/profile", slug: "profile" }
                ],
                permissions: [
                    { module: "Profile", view: true, create: false, update: true, delete: false },
                    { module: "Dashboard", view: true, create: false, update: false, delete: false },
                    { module: "Notifications", view: true, create: true, update: false, delete: false },
                    { module: "Enrollment", view: true, create: true, update: true, delete: false },                   
                    { module: "Reports", view: true, create: false, update: false, delete: false }
                ]            
            }; 
        
        case "EDP":
            return {
                modules: [
                    { name: "Dashboard", icon: "fas fa-tachometer-alt", route: "/dashboard", slug: "dashboard" }, 
                    { name: "Notifications", icon: "fas fa-bell", route: "/notifications", slug: "notifications" },  
                    { 
                        name: "Enrollment", icon: "fas fa-edit", route: "", slug: "enrollment", 
                        submodules: [
                            {name: "Tracker", icon: "fas fa-minus", route: "/enrollment/edp/tracker", slug: "enrollment.tracker" },
                        ],
                    },    
                    { name: "Study Load", icon: "fas fa-book-reader", route: "/staffstudyload", slug: "studyload" },  
                    { name: "E Grade", icon: "fas fa-table", route: "/egrade", slug: "egrade" }, 
                    { name: "Class List", icon: "fas fa-clipboard-list", route: "/classlist", slug: "classlist" }, 
                    { name: "Teacher's Load", icon: "fas fa-chalkboard-teacher", route: "/teachersload", slug: "teachersload" }, 
                    { name: "Reports", icon: "fas fa-chart-bar", route: "/reports", slug: "reports" },                   
                    { name: "Profile", icon: "fas fa-user", route: "/profile", slug: "profile" },  
                    { name: "Admin Tools", icon: "fas fa-cogs", route: "/admintools", slug: "admintools" }, 
                ],
                permissions: [
                    { module: "Profile", view: true, create: false, update: true, delete: false },
                    { module: "Dashboard", view: true, create: false, update: false, delete: false },
                    { module: "Notifications", view: true, create: true, update: false, delete: false },
                    { module: "Enrollment", view: true, create: true, update: true, delete: false },                   
                    { module: "Study Load", view: true, create: false, update: false, delete: false },
                    { module: "E Grade", view: true, create: false, update: false, delete: false },
                    { module: "Admin Tools", view: true, create: true, update: true, delete: true },
                    { module: "Class List", view: true, create: false, update: false, delete: false },
                ]            
            };     
        
        case "ADMIN":
            return {
                modules: [
                    { name: "Dashboard", icon: "fas fa-tachometer-alt", route: "/dashboard", slug: "dashboard" }, 
                    { name: "Notifications", icon: "fas fa-bell", route: "/notifications", slug: "notifications" },  
                    { name: "Enrollment", icon: "fas fa-edit", route: "/enrollment", slug: "enrollment" },  
                    { name: "Assessment", icon: "fas fa-cash-register", route: "/assessment", slug: "assessment" },  
                    { name: "Study Load", icon: "fas fa-book-reader", route: "/studyload", slug: "studyload" },  
                    { name: "E Grade", icon: "fas fa-table", route: "/egrade", slug: "egrade" }, 
                    { name: "Class List", icon: "fas fa-clipboard-list", route: "/classlist", slug: "classlist" },  
                    { name: "Teacher's Load", icon: "fas fa-chalkboard-teacher", route: "/teachersload", slug: "teachersload" }, 
                    { name: "Reports", icon: "fas fa-chart-bar", route: "/reports", slug: "reports" },
                    { name: "Profile", icon: "fas fa-user", route: "/profile", slug: "profile" },
                    { name: "Admin Tools", icon: "fas fa-cogs", route: "/admintools", slug: "admintools" }, 
                ],
                permissions: [
                    { module: "Profile", view: true, create: true, update: true, delete: true },
                    { module: "Dashboard", view: true, create: true, update: true, delete: true },
                    { module: "Notifications", view: true, create: true, update: true, delete: true },
                    { module: "Enrollment", view: true, create: true, update: true, delete: true },
                    { module: "Assessment", view: true, create: true, update: true, delete: true },
                    { module: "Study Load", view: true, create: true, update: true, delete: true },
                    { module: "E Grade", view: true, create: true, update: true, delete: true },
                    { module: "Class List", view: true, create: true, update: true, delete: true },
                    { module: "Teacher's Load", view: true, create: true, update: true, delete: true },
                    { module: "Reports", view: true, create: true, update: true, delete: true },
                    { module: "Admin Tools", view: true, create: true, update: true, delete: true }
                ]            
            };  

        case "MANAGEMENT":
            return {
                modules: [
                    { name: "Dashboard", icon: "fas fa-tachometer-alt", route: "/dashboard", slug: "dashboard" }, 
                    { name: "Notifications", icon: "fas fa-bell", route: "/notifications", slug: "notifications" },  
                    { name: "Reports", icon: "fas fa-chart-bar", route: "/reports", slug: "reports" },
                    { name: "Profile", icon: "fas fa-user", route: "/profile", slug: "profile" },
                ],
                permissions: [
                    { module: "Profile", view: true, create: true, update: true, delete: true },
                    { module: "Dashboard", view: true, create: true, update: true, delete: true },
                    { module: "Notifications", view: true, create: true, update: true, delete: true },
                    { module: "Reports", view: true, create: true, update: true, delete: true },
                ]            
            };  

        default:
            return {
                modules: [],
                permissions: []            
            };  
    }
}

export function enrollmentApprovalStatus() {
    /*
    0 - REGISTERED,
    1 - APPROVED_REGISTRATION_REGISTRAR,
    2 - DISAPPROVED_REGISTRATION_REGISTRAR,
    3 - APPROVED_REGISTRATION_DEAN,
    4 - DISAPPROVED_REGISTRATION_DEAN,
    5 - SELECTING_SUBJECTS,
    6 - APPROVED_BY_DEAN,
    7 - DISAPPROVED_BY_DEAN,
    8 - APPROVED_BY_ACCOUNTING,
    9 - APPROVED_BY_CASHIER,
    10 - OFFICIALLY_ENROLLED,
    11 - WITHDRAWN_ENROLLMENT_BEFORE_START_OF_CLASS,
    12 - WITHDRAWN_ENROLLMENT_START_OF_CLASS,
    13 - CANCELLED
    */
}

export const errToasterOptions = {
    duration: 6000,
    type: 'is-danger',
    position: 'bottom-right',
    dismissible: true,
    closeOnClick: true,
    animate: { in: 'slideInRight', out: 'slideOutRight' }
}

export function requiredEnrollmentCredentials(educLevel) {
    if(educLevel === "col") {
        return [
            { slug_id: "idpic", name: "2x2 ID Picture", required: true, fileformat: ["jpg","png"] },
            { slug_id: "certgmc", name: "Certificate of Good Moral Character", required: false, fileformat: ["pdf"] },
            { slug_id: "lcr", name: "Local Civil Registrar", required: false, fileformat: ["pdf"]  },
            { slug_id: "birthcert", name: "NSO / PSA Birth Certificate", required: false, fileformat: ["pdf"]  },
            { slug_id: "f138", name: "Form 138 / Report Card", required: false, fileformat: ["pdf"]  },
            { slug_id: "tor", name: "Transcript of Records", required: false, fileformat: ["pdf"]  },
            { slug_id: "certtrans", name: "Certificate of Transfer Credential", required: false, fileformat: ["pdf"]  },
            { slug_id: "hondis", name: "Honorable Dismissal Certificate", required: false, fileformat: ["pdf"]  }
        ];
    }
    else if(educLevel === "shs") {
        return [
            { slug_id: "idpic", name: "2x2 ID Picture", required: true, fileformat: ["jpg","png"]  },
            { slug_id: "certgmc", name: "Certificate of Good Moral Character", required: false, fileformat: ["pdf"]  },
            { slug_id: "lcr", name: "Local Civil Registrar", required: false, fileformat: ["pdf"]  },
            { slug_id: "birthcert", name: "NSO / PSA Birth Certificate", required: false, fileformat: ["pdf"]  },
            { slug_id: "f138", name: "Form 138 / Report Card", required: false, fileformat: ["pdf"]  },
            { slug_id: "esc", name: "ESC Grantee Certificate", required: false, fileformat: ["pdf"]  },
            { slug_id: "tor", name: "Transcript of Records", required: false, fileformat: ["pdf"]  },
            { slug_id: "certtrans", name: "Certificate of Transfer Credential", required: false, fileformat: ["pdf"]  },
            { slug_id: "hondis", name: "Honorable Dismissal Certificate", required: false, fileformat: ["pdf"]  }
        ];
    }
    else if(educLevel === "jhs") {
        return [
            { slug_id: "idpic", name: "2x2 ID Picture", required: true, fileformat: ["jpg","png"]  },
            { slug_id: "certgmc", name: "Certificate of Good Moral Character", required: false, fileformat: ["pdf"]  },
            { slug_id: "lcr", name: "Local Civil Registrar", required: false, fileformat: ["pdf"]  },
            { slug_id: "birthcert", name: "NSO / PSA Birth Certificate", required: false, fileformat: ["pdf"]  },
            { slug_id: "f138", name: "Form 138 / Report Card", required: false, fileformat: ["pdf"]  },
            { slug_id: "esc", name: "ESC Grantee Certificate", required: false, fileformat: ["pdf"]  },
            { slug_id: "tor", name: "Transcript of Records", required: false, fileformat: ["pdf"]  },
            { slug_id: "certtrans", name: "Certificate of Transfer Credential", required: false, fileformat: ["pdf"]  },
            { slug_id: "hondis", name: "Honorable Dismissal Certificate", required: false, fileformat: ["pdf"]  }
        ];
    }
    else if(educLevel === "bed") {
        return [
            { slug_id: "idpic", name: "2x2 ID Picture", required: true, fileformat: ["jpg","png"]  },
            { slug_id: "certgmc", name: "Certificate of Good Moral Character", required: false, fileformat: ["pdf"]  },
            { slug_id: "lcr", name: "Local Civil Registrar", required: false, fileformat: ["pdf"]  },
            { slug_id: "birthcert", name: "NSO / PSA Birth Certificate", required: false, fileformat: ["pdf"]  },
            { slug_id: "f138", name: "Form 138 / Report Card", required: false, fileformat: ["pdf"]  },
            { slug_id: "esc", name: "ESC Grantee Certificate", required: false, fileformat: ["pdf"]  },
            { slug_id: "tor", name: "Transcript of Records", required: false, fileformat: ["pdf"]  },
            { slug_id: "certtrans", name: "Certificate of Transfer Credential", required: false, fileformat: ["pdf"]  },
            { slug_id: "hondis", name: "Honorable Dismissal Certificate", required: false, fileformat: ["pdf"]  }
        ];
    }
    else if(educLevel === "law") {
        return [
            { slug_id: "idpic", name: "2x2 ID Picture", required: false, fileformat: ["jpg","png"]  },
            { slug_id: "certgmc", name: "Certificate of Good Moral Character", required: false, fileformat: ["pdf"]  },
            { slug_id: "lcr", name: "Local Civil Registrar", required: false, fileformat: ["pdf"]  },
            { slug_id: "birthcert", name: "NSO / PSA Birth Certificate", required: false, fileformat: ["pdf"]  },
            { slug_id: "admisdoc", name: "Admission Documents", required: true, fileformat: ["pdf"]  },
            { slug_id: "perstate", name: "Personal Statement", required: true, fileformat: ["pdf"]  },
            { slug_id: "apprapp", name: "Approved Application Form", required: true, fileformat: ["pdf"]  },
            { slug_id: "lttracc", name: "Letter of Acceptance", required: true, fileformat: ["pdf"]  },
        ];
    }
    else {
        return null;   
    }
}

export function optionExamsSetting() {
    return {
        CL: {
            grade1: { enable: true, label: "Midterm" },
            grade2: { enable: true, label: "Final" }
        },
        SH: {
            grade1: { enable: true, label: "1st QTR" },
            grade2: { enable: true, label: "2nd QTR" }
        },
        BE: {
            grade1: { enable: true, label: "1st Grading" },
            grade2: { enable: true, label: "2nd Grading" },
            grade3: { enable: true, label: "3rd Grading" },
            grade4: { enable: true, label: "4th Grading" }
        },
        JH: {
            grade1: { enable: true, label: "1st Grading" },
            grade2: { enable: true, label: "2nd Grading" },
            grade3: { enable: true, label: "3rd Grading" },
            grade4: { enable: true, label: "4th Grading" }
        }
    } 
}