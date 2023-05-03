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

const wrongPassArr = [
  {
    wrongPass: 'HelloWorld@2',
    wrongHash: '$2b$12$tpGjLmJCPnYVt4U3rhfndOWVfSGRyGiXhuEetmtzEmDIcF9S6YxuK',
  },
  {
    wrongPass: 'Applebear$6',
    wrongHash: '$2b$12$v83jedjCtVtxNnCGh0TeEebj.2BeTAcuDwIIZP79ScjdffFp58MKa',
  },
  {
    wrongPass: 'GreatPerson*9',
    wrongHash: '$2b$12$zy.Wxa575u2nhIlKXnCexOT0Ghphr4v3weCrsgCZ0US4LhzPEjLo6',
  },
  {
    wrongPass: 'HappyMoon#6S',
    wrongHash: '$2b$12$nIK8BXJRGidwVH9YgoIBuOmM3lzcGtCuGmRxHGSLcFkIvSvii.ChO',
  },
];

export default { corrPassArr, wrongPassArr };
