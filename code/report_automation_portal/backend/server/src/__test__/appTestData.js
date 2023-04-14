const corrUsers = [
  {
    username: 'test2',
    password: 'HelloWorld@2',
    usertype: 'Regular',
    userrole: 'Employee',
  },
  {
    username: 'test4',
    password: 'Applebear$6',
    usertype: 'Admin',
    userrole: 'Employee',
  },
  {
    username: 'test7',
    password: 'GreatPerson*9',
    usertype: 'Admin',
    userrole: 'Employee',
  },
  {
    username: 'test5',
    password: 'HappyMoon#6S',
    usertype: 'Admin',
    userrole: 'Employee',
  },
];

const insuffUserPass = [
  {
    username: 'test2',
    password: 'test',
    usertype: 'Regular',
    userrole: 'Employee',
  },
  {
    username: 'test4',
    password: 'test*2',
    usertype: 'Admin',
    userrole: 'Employee',
  },
  {
    username: 'test7',
    password: 'Test',
    usertype: 'Admin',
    userrole: 'Employee',
  },
  {
    username: 'test5',
    password: 'Test6S',
    usertype: 'Admin',
    userrole: 'Employee',
  },
];

const missUserParams = [
  {
    username: '',
    password: 'HelloWorld@2',
    usertype: 'Regular',
    userrole: 'Employee',
  },
  {
    username: 'test4',
    password: 'Applebear$6',
    usertype: '',
    userrole: 'Employee',
  },
  {
    username: 'test7',
    password: 'GreatPerson9',
    usertype: 'Admin',
    userrole: '',
  },
];

const corrAdminUsers = [
  {
    username: 'test4',
    password: 'Applebear$6',
    usertype: 'Admin',
    userrole: 'Employee',
  },
  {
    username: 'test7',
    password: 'GreatPerson9',
    usertype: 'Admin',
    userrole: 'Employee',
  },
  {
    username: 'test5',
    password: 'HappyMoon@6S',
    usertype: 'Admin',
    userrole: 'Employee',
  },
];

const corrPassArr = [
  {
    corrPass: 'HelloWorld@2',
    corrHash: '$2b$12$v83jedjCtVtxNnCGh0TeEebj.2BeTAcuDwIIZP79ScjdffFp58MKa',
  },
  {
    corrPass: 'Applebear$6',
    corrHash: '$2b$12$nIK8BXJRGidwVH9YgoIBuOmM3lzcGtCuGmRxHGSLcFkIvSvii.ChO',
  },
  {
    corrPass: 'GreatPerson*9',
    corrHash: '$2b$12$M5eq9EWK4gm8c7k08nEvcORtYYni.N5KyPJQ32HXcXCpuX5sbpvBC',
  },
  {
    corrPass: 'HappyMoon#6S',
    corrHash: '$2b$12$KTjf3e53pmmMD5Us4N5KXu9RPkVNFtUH4pHqzwB/cMoNCxuHbpcEa',
  },
];

export default {
  corrUsers,
  insuffUserPass,
  missUserParams,
  corrAdminUsers,
  corrPassArr,
};
