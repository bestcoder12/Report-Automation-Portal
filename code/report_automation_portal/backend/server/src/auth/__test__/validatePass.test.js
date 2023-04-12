import validatePass from '../validatePass.js';

describe('Password check returns either true or false correctly', () => { 

    test('should return true for match of hash and plaintext', async () => {  

        const corrArr = [
            {
                corrPass: 'HelloWorld@2',
                corrHash: '$2b$12$v83jedjCtVtxNnCGh0TeEebj.2BeTAcuDwIIZP79ScjdffFp58MKa'
            },
            {
                corrPass: 'Applebear$6',
                corrHash: '$2b$12$nIK8BXJRGidwVH9YgoIBuOmM3lzcGtCuGmRxHGSLcFkIvSvii.ChO'
            },
            {
                corrPass: 'GreatPerson9',
                corrHash: '$2b$12$tpGjLmJCPnYVt4U3rhfndOWVfSGRyGiXhuEetmtzEmDIcF9S6YxuK'
            },
            {
                corrPass: 'HappyMoon',
                corrHash: '$2b$12$zy.Wxa575u2nhIlKXnCexOT0Ghphr4v3weCrsgCZ0US4LhzPEjLo6'
            }
        ]

        let res = undefined
        for (const uPass of corrArr) {
            res = await validatePass(uPass.corrPass, uPass.corrHash)
            expect(res).toBe(true)
        }
    })

     test('should return false for incorrect plaintext for a hash', async () => { 
        
        const wrongArr = [
            {
                wrongPass: 'HelloWorld@2',
                wrongHash: '$2b$12$tpGjLmJCPnYVt4U3rhfndOWVfSGRyGiXhuEetmtzEmDIcF9S6YxuK' 
            },
            {
                wrongPass: 'Applebear$6',
                wrongHash: '$2b$12$v83jedjCtVtxNnCGh0TeEebj.2BeTAcuDwIIZP79ScjdffFp58MKa'
            },
            {
                wrongPass: 'GreatPerson9',
                wrongHash: '$2b$12$zy.Wxa575u2nhIlKXnCexOT0Ghphr4v3weCrsgCZ0US4LhzPEjLo6'
            },
            {
                wrongPass: 'HappyMoon',
                wrongHash: '$2b$12$nIK8BXJRGidwVH9YgoIBuOmM3lzcGtCuGmRxHGSLcFkIvSvii.ChO' 
            }
        ]

        let res = undefined
        for (const uPass of wrongArr) {
            res = await validatePass(uPass.wrongPass, uPass.wrongHash)
            expect(res).toBe(false)
        }

    })

    test('should return false for blank password', async () => { 
        const empPass = ''
        const empHash = '$2b$12$v83jedjCtVtxNnCGh0TeEebj.2BeTAcuDwIIZP79ScjdffFp58MKa'
        const res = await validatePass(empPass, empHash)
        expect(res).toBe(false)
     })
 })
