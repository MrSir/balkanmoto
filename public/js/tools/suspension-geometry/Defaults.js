class Defaults {
    findDefaults(name) {
        return this.defaults[name]
    }

    getOptions() {
        return [
            'zero',
            '1982 Honda V45 Saber',
            '1971 Honda CB750',
            '2003 Yamaha YZF-600 R6',
            '2013 Suzuki C90T B.O.S.S.',
        ]
    }

    get defaults() {
        let defaults = []

        defaults['zero'] = {
            rake: 0,
            wheelbase: 1570,
            stemLength: 200,
            fork: {
                length: 830,
                offset: 0,
                tripleTreeRake: 0,
                diameter: 37,
                width: 240,
            },
            frontTire: {
                width: 110,
                aspect: 90,
                rimDiameterInInches: 18,
            },
            rearTire: {
                width: 130,
                aspect: 90,
                rimDiameterInInches: 17,
            },
        }

        defaults['1982 Honda V45 Saber'] = {
            rake: 29.5,
            wheelbase: 1570,
            stemLength: 225,
            fork: {
                length: 850,
                offset: 60,
                tripleTreeRake: 0,
                diameter: 37,
                width: 191,
            },
            frontTire: {
                width: 110,
                aspect: 90,
                rimDiameterInInches: 18,
            },
            rearTire: {
                width: 130,
                aspect: 90,
                rimDiameterInInches: 17,
            },
        }

        defaults['2013 Suzuki C90T B.O.S.S.'] = {
            rake: 32,
            wheelbase: 1675,
            stemLength: 210,
            fork: {
                length: 775,
                offset: 60,
                tripleTreeRake: 0,
                diameter: 43,
                width: 265,
            },
            frontTire: {
                width: 130,
                aspect: 80,
                rimDiameterInInches: 17,
            },
            rearTire: {
                width: 200,
                aspect: 60,
                rimDiameterInInches: 16,
            },
        }

        defaults['1971 Honda CB750'] = {
            rake: 27,
            wheelbase: 1453,
            stemLength: 200,
            fork: {
                length: 830,
                offset: 0,
                tripleTreeRake: 0,
                diameter: 35,
                width: 240,
            },
            frontTire: {
                width: 100,
                aspect: 90,
                rimDiameterInInches: 19,
            },
            rearTire: {
                width: 110,
                aspect: 90,
                rimDiameterInInches: 18,
            },
        }

        defaults['2003 Yamaha YZF-600 R6'] = {
            rake: 24,
            wheelbase: 1380,
            stemLength: 200,
            fork: {
                length: 830,
                offset: 0,
                tripleTreeRake: 0,
                diameter: 43,
                width: 240,
            },
            frontTire: {
                width: 120,
                aspect: 60,
                rimDiameterInInches: 17,
            },
            rearTire: {
                width: 180,
                aspect: 55,
                rimDiameterInInches: 17,
            },
        }

        return defaults
    }
}
