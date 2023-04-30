const corrUsers = [
  {
    username: 'test2',
    password: 'HelloWorld@2',
    user_type: 'Regular',
    user_role: 'Employee',
  },
  {
    username: 'test4',
    password: 'Applebear$6',
    user_type: 'Admin',
    user_role: 'Employee',
  },
  {
    username: 'test7',
    password: 'GreatPerson*9',
    user_type: 'Admin',
    user_role: 'Employee',
  },
  {
    username: 'test5',
    password: 'HappyMoon#6S',
    user_type: 'Admin',
    user_role: 'Employee',
  },
];

const insuffUserPass = [
  {
    username: 'test2',
    password: 'test',
    user_type: 'Regular',
    user_role: 'Employee',
  },
  {
    username: 'test4',
    password: 'test*2',
    user_type: 'Admin',
    user_role: 'Employee',
  },
  {
    username: 'test7',
    password: 'Test',
    user_type: 'Admin',
    user_role: 'Employee',
  },
  {
    username: 'test5',
    password: 'Test6S',
    user_type: 'Admin',
    user_role: 'Employee',
  },
];

const missUserParams = [
  {
    username: '',
    password: 'HelloWorld@2',
    user_type: 'Regular',
    user_role: 'Employee',
  },
  {
    username: 'test4',
    password: 'Applebear$6',
    user_type: '',
    user_role: 'Employee',
  },
  {
    username: 'test7',
    password: 'GreatPerson9',
    user_type: 'Admin',
    user_role: '',
  },
  {
    username: 'test5',
    password: '',
    user_type: 'Admin',
    user_role: 'Employee',
  },
];

const corrAdminUsers = [
  {
    username: 'test4',
    password: 'Applebear$6',
    user_type: 'Admin',
    user_role: 'Employee',
  },
  {
    username: 'test7',
    password: 'GreatPerson*9',
    user_type: 'Admin',
    user_role: 'Employee',
  },
  {
    username: 'test5',
    password: 'HappyMoon#6S',
    user_type: 'Admin',
    user_role: 'Employee',
  },
];

const corrPassArr = [
  {
    username: 'test2',
    corrPass: 'HelloWorld@2',
    corrHash: '$2b$12$v83jedjCtVtxNnCGh0TeEebj.2BeTAcuDwIIZP79ScjdffFp58MKa',
  },
  {
    username: 'test4',
    corrPass: 'Applebear$6',
    corrHash: '$2b$12$nIK8BXJRGidwVH9YgoIBuOmM3lzcGtCuGmRxHGSLcFkIvSvii.ChO',
  },
  {
    username: 'test7',
    corrPass: 'GreatPerson*9',
    corrHash: '$2b$12$M5eq9EWK4gm8c7k08nEvcORtYYni.N5KyPJQ32HXcXCpuX5sbpvBC',
  },
  {
    username: 'test5',
    corrPass: 'HappyMoon#6S',
    corrHash: '$2b$12$KTjf3e53pmmMD5Us4N5KXu9RPkVNFtUH4pHqzwB/cMoNCxuHbpcEa',
  },
];

const nonExistUser = [
  {
    username: 'Neo',
    password: 'SuperComp&4',
    user_type: 'Regular',
    user_role: 'Employee',
    corrHash: '$2b$12$qTT2U8EknUnqukpHRN0Jo.AaQkqncQoZ1nvmzP5MQugQKMfcbEovS',
  },
  {
    username: 'Smith',
    password: 'NovaBlack!2',
    user_type: 'Admin',
    user_role: 'Employee',
    corrHash: '$2b$12$MTMh8l8y5VEHLo72M604ZOLqTrGqxjO1XES/tIsflVmJW08E2eMOO',
  },
  {
    username: 'John',
    password: 'AntWasp%8',
    user_type: 'Regular',
    user_role: 'Employee',
    corrHash: '$2b$12$t6SPNsXPmcmn4XxYbMp4M.iGrot/qmAsN7NcqDMez0faOmnkMzI6C',
  },
  {
    username: 'Mike',
    password: 'BrightSun(0',
    user_type: 'Admin',
    user_role: 'Employee',
    corrHash: '$2b$12$YT20QAbZgeoyjLbIcTccXeimL.q8BwPFN7R7XdXSCVIZpgP2IH4ne',
  },
];

const regularUsers = [
  {
    username: 'test2',
    password: 'HelloWorld@2',
    user_type: 'Regular',
    user_role: 'Employee',
  },
  {
    username: 'test4',
    password: 'Applebear$6',
    user_type: 'Regular',
    user_role: 'Employee',
  },
  {
    username: 'test7',
    password: 'GreatPerson*9',
    user_type: 'Regular',
    user_role: 'Employee',
  },
  {
    username: 'test5',
    password: 'HappyMoon#6S',
    user_type: 'Regular',
    user_role: 'Employee',
  },
];

export default {
  corrUsers,
  insuffUserPass,
  missUserParams,
  corrAdminUsers,
  corrPassArr,
  nonExistUser,
  regularUsers,
};
