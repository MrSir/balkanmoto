class Defaults {
    findDefaults(name) {
        return this.defaults[name]
    }

    getOptions() {
        return ['Custom', '1982 Honda V45 Saber', '2013 Suzuki C90T B.O.S.S.', '2003 Yamaha YZF-600 R6']
    }

    get defaults() {
        let defaults = []

        defaults['Custom'] = {
            rake: 30,
            wheelbase: 1000,
            stemLength: 200,
            tripleTree: {
                offset: 60,
                rake: 0,
                topYokeThickness: 20,
                bottomYokeThickness: 30,
            },
            fork: {
                length: 1000,
                offset: 0,
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

        defaults['1982 Honda V45 Saber'] = {
            rake: 29.5,
            wheelbase: 1570,
            stemLength: 225,
            tripleTree: {
                offset: 60,
                rake: 0,
                topYokeThickness: 20,
                bottomYokeThickness: 30,
            },
            fork: {
                length: 890,
                offset: 40,
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
            tripleTree: {
                offset: 60,
                rake: 0,
                topYokeThickness: 35,
                bottomYokeThickness: 35,
            },
            fork: {
                length: 775,
                offset: 0,
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

        defaults['2003 Yamaha YZF-600 R6'] = {
            rake: 24,
            wheelbase: 1380,
            stemLength: 200,
            tripleTree: {
                offset: 35,
                rake: 0,
                topYokeThickness: 20,
                bottomYokeThickness: 30,
            },
            fork: {
                length: 725,
                offset: 10,
                diameter: 43,
                width: 205,
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
