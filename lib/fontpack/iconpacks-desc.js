const path = require("path");

module.exports = {
    icons: [
        {
            id: "fa",
            name: "Font Awesome",
            zipUrl: 'https://github.com/FortAwesome/Font-Awesome/archive/master.zip',
            contents: [
                {
                    files: "/svgs/+(brands|solid)/*.svg",
                    formatter: name => `Fa${name}`
                },
                {
                    files: "/regular/*.svg",
                    formatter: name => `FaReg${name}`
                }
            ],
            projectUrl: "https://fontawesome.com/",
            license: "CC BY 4.0 License",
            licenseUrl: "https://creativecommons.org/licenses/by/4.0/"
        },
        {
            id: "io",
            name: "Ionicons",
            zipUrl: 'https://github.com/ionic-team/ionicons/archive/master.zip',
            contents: [
                {
                    files:
                        "/src/svg/*.svg"
                    ,
                    formatter: name => `Io${name}`
                }
            ],
            projectUrl: "https://ionicons.com/",
            license: "MIT",
            licenseUrl: "https://github.com/ionic-team/ionicons/blob/master/LICENSE"
        },
        {
            id: "md",
            name: "Material Design icons",
            zipUrl: 'https://github.com/google/material-design-icons/archive/master.zip',
            contents: [
                {
                    files: "/*/svg/production/*_24px.svg"
                    ,
                    formatter: name => name.replace(/Ic(\w+)24px/i, "Md$1")
                }
            ],
            projectUrl: "http://google.github.io/material-design-icons/",
            license: "Apache License Version 2.0",
            licenseUrl:
                "https://github.com/google/material-design-icons/blob/master/LICENSE"
        },
        {
            id: "ti",
            name: "Typicons",
            zipUrl: 'https://github.com/stephenhutchings/typicons.font/archive/master.zip',
            contents: [
                {
                    files: '/src/svg/*.svg',
                    formatter: name => `Ti${name}`
                }
            ],
            projectUrl: "http://s-ings.com/typicons/",
            license: "CC BY-SA 3.0",
            licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/"
        },
        {
            id: "go",
            name: "Github Octicons icons",
            zipUrl: 'https://github.com/stephenhutchings/typicons.font/archive/master.zip',
            contents: [
                {
                    files: "/src/svg/*.svg"
                    ,
                    formatter: name => `Go${name}`
                }
            ],
            projectUrl: "https://octicons.github.com/",
            license: "MIT",
            licenseUrl: "https://github.com/primer/octicons/blob/master/LICENSE"
        },
        {
            id: "fi",
            name: "Feather",
            zipUrl: 'https://github.com/feathericons/feather/archive/master.zip',
            contents: [
                {
                    files: "/icons/*.svg"
                    ,
                    formatter: name => `Fi${name}`
                }
            ],
            projectUrl: "https://feathericons.com/",
            license: "MIT",
            licenseUrl: "https://github.com/feathericons/feather/blob/master/LICENSE"
        },
        {
            id: "gi",
            name: "Game Icons",
            zipUrl: 'https://github.com/delacannon/game-icons-inverted/archive/master.zip',
            contents: [
                {
                    files: "/+(carl-olsen|andymeneely|cathelineau|darkzaitzev|delapouite|faithtoken|generalace135|guard13007|heavenly-dog|irongamer|john-colburn|kier-heyl|lorc|lord-berandas|quoting|rihlsul|sbed|skoll|sparker|spencerdub|zajkonur)/originals/svg/000000/transparent/*.svg"
                    ,
                    formatter: name => `Gi${name}`
                },
                {
                    files: "/+(zeromancer|willdabeast|)/deviations/svg/000000/transparent/*.svg"
                    ,
                    formatter: name => `Gi${name}`
                },
                {
                    files: "/+(john-redman)/hands/svg/000000/transparent/*.svg"
                    ,
                    formatter: name => `Gi${name}`
                },
                {
                    files: "/+(lucasms)/equipment/svg/000000/transparent/*.svg"
                    ,
                    formatter: name => `Gi${name}`
                },
                {
                    files: "/+(priorblue)/batteries/svg/000000/transparent/*.svg"
                    ,
                    formatter: name => `Gi${name}`
                },
                {
                    files: "/+(viscious-speed)/abstract/svg/000000/transparent/*.svg"
                    ,
                    formatter: name => `Gi${name}`
                },
                {
                    files: "/+(various-artists)/public-domain/svg/000000/transparent/*.svg",
                    formatter: name => `Gi${name}`
                },
                {
                    files: "/+(felbrigg)/arrows/svg/000000/transparent/*.svg"
                    ,
                    formatter: name => `Gi${name}`
                },
                {
                    files: "/aussiesim/*.svg",
                    formatter: name => `Gi${name}`
                }
            ],
            projectUrl: "https://game-icons.net/",
            license: "CC BY 3.0",
            licenseUrl: "https://creativecommons.org/licenses/by/3.0/"
        },
        {
            id: "wi",
            name: "Weather Icons",
            zipUrl: 'https://github.com/erikflowers/weather-icons/archive/master.zip',
            contents: [
                {
                    files: "/svg/*.svg",
                    formatter: name => name
                }
            ],
            projectUrl: "https://erikflowers.github.io/weather-icons/",
            license: "SIL OFL 1.1",
            licenseUrl: "http://scripts.sil.org/OFL"
        },
        {
            id: "di",
            name: "Devicons",
            zipUrl: 'https://github.com/vorillaz/devicons/archive/master.zip',
            contents: [
                {
                    files: "!SVG/*.svg",
                    formatter: name => `Di${name}`
                }
            ],
            projectUrl: "https://vorillaz.github.io/devicons/",
            license: "MIT",
            licenseUrl: "https://opensource.org/licenses/MIT"
        }
    ]
};