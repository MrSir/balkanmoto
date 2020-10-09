class Defaults {
    findDefaults(name) {
        return this.defaults[name]
    }

    getOptions() {
        return [
            '1982 Honda V45 Saber',
            '1971 Honda CB750',
            '2003 Yamaha YZF-600 R6',
        ]
    }

    get defaults() {
        return {
            '1982 Honda V45 Saber': {
                rake: 29.5,
                wheelbase: 1570,
                stemHeight: 200,
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
            },
            '1971 Honda CB750': {
                rake: 27,
                wheelbase: 1453,
                stemHeight: 200,
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
            },
            '2003 Yamaha YZF-600 R6': {
                rake: 24,
                wheelbase: 1380,
                stemHeight: 200,
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
            },
        }
    }
}
