const corrUsers = [
    {
        username: "test2",
        password: "testPass#4",
        usertype: "Regular",
        userrole: "Employee"
    },
    {
        username: "test4",
        password: "testPass*2",
        usertype: "Admin",
        userrole: "Employee"   
    },
    {
        username: "test7",
        password: "Testpass$8",
        usertype: "Admin",
        userrole: "Employee"
    },
    {
        username: "test5",
        password: "TestpasS@6S",
        usertype: "Admin",
        userrole: "Employee"
    }
  ]

const insuffUserPass = [
    {
        username: "test2",
        password: "test",
        usertype: "Regular",
        userrole: "Employee"
    },
    {
        username: "test4",
        password: "test*2",
        usertype: "Admin",
        userrole: "Employee"   
    },
    {
        username: "test7",
        password: "Test",
        usertype: "Admin",
        userrole: "Employee"
    },
    {
        username: "test5",
        password: "Test6S",
        usertype: "Admin",
        userrole: "Employee"
    }
]

const missUserParams = [
    {
        username: "",
        password: "testPass#4",
        usertype: "Regular",
        userrole: "Employee"
    },
    {
        username: "test4",
        password: "testPass*2",
        usertype: "",
        userrole: "Employee"   
    },
    {
        username: "test7",
        password: "Testpass$8",
        usertype: "Admin",
        userrole: ""
    }
]

const corrAdminUsers = [
    {
        username: "test4",
        password: "testPass*2",
        usertype: "Admin",
        userrole: "Employee"   
    },
    {
        username: "test7",
        password: "Testpass$8",
        usertype: "Admin",
        userrole: "Employee"
    },
    {
        username: "test5",
        password: "TestpasS@6S",
        usertype: "Admin",
        userrole: "Employee"
    }
]

export default {corrUsers, insuffUserPass, missUserParams, corrAdminUsers}