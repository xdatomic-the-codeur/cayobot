const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const data = require("../../targets.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cayo')
        .setDescription('Calcule la rentabilité d\'un cayo')
        .addStringOption(option => option.setName('principal')
            .setDescription('Objectif principal')
            .setRequired(true)
            .addChoices(
                { name: 'panthere', value: 'panthere' },
                { name: 'diamant-rose', value: 'diamant' },
                { name: 'bons', value: 'bons' },
                { name: 'rubis', value: 'rubis' },
                { name: 'tequilla', value: 'tequilla' }
            )
        )
        .addIntegerOption(option => option.setName('joueurs')
            .setDescription('nombre de joueurs')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(4)
        )
        .addIntegerOption(option => option.setName('or')
            .setDescription('Nombre d\'or dans le braquage')
            .setMinValue(0)
            .setMaxValue(7)
        )
        .addIntegerOption(option => option.setName('coke')
            .setDescription('Nombre de cocaïne dans le braquage')
            .setMinValue(0)
            .setMaxValue(7)
        )
        .addIntegerOption(option => option.setName('tableaux')
            .setDescription('Nombre de tableaux dans le braquage')
            .setMinValue(0)
            .setMaxValue(7)
        )
        .addIntegerOption(option => option.setName('cannabis')
            .setDescription('Nombre de cannabis dans le braquage')
            .setMinValue(0)
            .setMaxValue(7)
        )
        .addIntegerOption(option => option.setName('argent')
            .setDescription('Nombre d\'argent dans le braquage')
            .setMinValue(0)
            .setMaxValue(7)
        ),
    async execute(interaction) {
        const principal = interaction.options.getString('principal');
        const or = interaction.options.getInteger('or') !== null ? interaction.options.getInteger('or') : 0;
        const coke = interaction.options.getInteger('coke') !== null ? interaction.options.getInteger('coke') : 0;
        const tableaux = interaction.options.getInteger('tableaux') !== null ? interaction.options.getInteger('tableaux') : 0;
        const cannabis = interaction.options.getInteger('cannabis') !== null ? interaction.options.getInteger('cannabis') : 0;
        const argent = interaction.options.getInteger('argent') !== null ? interaction.options.getInteger('argent') : 0;
        const joueurs = interaction.options.getInteger('joueurs');

        let min = or * Number(data.Secondaires.Lingots[0]) + coke * Number(data.Secondaires.Cocaïne[0]) + tableaux * Number(data.Secondaires.Tableaux[0]) + cannabis * Number(data.Secondaires.Cannabis[0]) + argent * Number(data.Secondaires.Argent[0]) + Number(data.Principaux[principal][0]);
        min * data.FRAIS;
        min = String(min) + '$';

        let max = or * Number(data.Secondaires.Lingots[1]) + coke * Number(data.Secondaires.Cocaïne[1]) + tableaux * Number(data.Secondaires.Tableaux[1]) + cannabis * Number(data.Secondaires.Cannabis[1]) + argent * Number(data.Secondaires.Argent[1]) + Number(data.Principaux[principal][1]);
        max * data.FRAIS;
        max = String(max) + '$';

        // Objectifs prenables : (minimum)
        // MaxOr = 1,5; MaxTableaux & MaxCoke = 2; MaxCannabis = 3; MaxArgent = 3
        let sacJoueurs = [[], [], [], []];
        let capaciteSacs = [1, 1, 1, 1];
        calculOr();
        sacJoueurs = sacJoueurs.slice(0, joueurs);
        capaciteSacs = capaciteSacs.slice(0, joueurs);
        const orPrenable = sacJoueurs.reduce((acc, array) => acc + array[0], 0);

        const Embed = new EmbedBuilder()
            .setTitle('Rentabilitée du cayo')
            .setAuthor({ name: 'Cayobot' })
            .setDescription(`Pour ${joueurs} joueurs avec le maximum au chef`)
            .addFields(
                { name: 'Objectif principal', value: principal },
                { name: 'Nombre d\'or :', value: String(or), inline: true },
                { name: 'Nombre de cocaïne :', value: String(coke), inline: true },
                { name: 'Nombre de tableaux :', value: String(tableaux), inline: true },
                { name: 'Nombre de cannabis :', value: String(cannabis), inline: true },
                { name: 'Nombre d\'argent :', value: String(argent), inline: true },
                { name: '\u200b', value: '\u200b' },
                { name: 'Minimum (parfait) :', value: min, inline: true },
                { name: 'Maximum (parfait) :', value: max, inline: true },
                { name: '\u200b', value: '\u200b' },
                { name: 'Or prenable :', value: String(orPrenable) }
            );
        console.log("Coucou")
        await interaction.reply({ embeds: [Embed] });

        function calculOr() {
            switch (or) {
                case 1:
                    //Remplissage des sacs
                    sacJoueurs[0][0] = 1;
                    sacJoueurs[1][0] = 0;
                    sacJoueurs[2][0] = 0;
                    sacJoueurs[3][0] = 0;
                    //Taux de remplissage des sacs
                    capaciteSacs[0] = capaciteSacs[0] - (sacJoueurs[0][0] * data.Place.Lingots);
                    break;
                case 2:
                    sacJoueurs[0][0] = 1.5;
                    sacJoueurs[1][0] = 0.5;
                    sacJoueurs[2][0] = 0;
                    sacJoueurs[3][0] = 0;

                    capaciteSacs[0] = capaciteSacs[0] - (sacJoueurs[0][0] * data.Place.Lingots);
                    capaciteSacs[1] = capaciteSacs[1] - (sacJoueurs[1][0] * data.Place.Lingots);

                    break;
                case 3:
                    sacJoueurs[0][0] = 1.5;
                    sacJoueurs[1][0] = 1.5;
                    sacJoueurs[2][0] = 0;
                    sacJoueurs[3][0] = 0;

                    capaciteSacs[0] = capaciteSacs[0] - (sacJoueurs[0][0] * data.Place.Lingots);
                    capaciteSacs[1] = capaciteSacs[1] - (sacJoueurs[1][0] * data.Place.Lingots);

                    break;
                case 4:
                    sacJoueurs[0][0] = 1.5;
                    sacJoueurs[1][0] = 1.5;
                    sacJoueurs[2][0] = 1;
                    sacJoueurs[3][0] = 0;

                    capaciteSacs[0] = capaciteSacs[0] - (sacJoueurs[0][0] * data.Place.Lingots);
                    capaciteSacs[1] = capaciteSacs[1] - (sacJoueurs[1][0] * data.Place.Lingots);
                    capaciteSacs[2] = capaciteSacs[2] - (sacJoueurs[2][0] * data.Place.Lingots);

                    break;
                case 5:
                    sacJoueurs[0][0] = 1.5;
                    sacJoueurs[1][0] = 1.5;
                    sacJoueurs[2][0] = 1.5;
                    sacJoueurs[3][0] = 0.5;

                    capaciteSacs[0] = capaciteSacs[0] - (sacJoueurs[0][0] * data.Place.Lingots);
                    capaciteSacs[1] = capaciteSacs[1] - (sacJoueurs[1][0] * data.Place.Lingots);
                    capaciteSacs[2] = capaciteSacs[2] - (sacJoueurs[2][0] * data.Place.Lingots);
                    capaciteSacs[3] = capaciteSacs[3] - (sacJoueurs[3][0] * data.Place.Lingots);

                    break;
                case 6:
                    sacJoueurs[0][0] = 1.5;
                    sacJoueurs[1][0] = 1.5;
                    sacJoueurs[2][0] = 1.5;
                    sacJoueurs[3][0] = 1.5;

                    capaciteSacs[0] = capaciteSacs[0] - (sacJoueurs[0][0] * data.Place.Lingots);
                    capaciteSacs[1] = capaciteSacs[1] - (sacJoueurs[1][0] * data.Place.Lingots);
                    capaciteSacs[2] = capaciteSacs[2] - (sacJoueurs[2][0] * data.Place.Lingots);
                    capaciteSacs[3] = capaciteSacs[3] - (sacJoueurs[3][0] * data.Place.Lingots);

                    break;
                case 7:
                    sacJoueurs[0][0] = 1.5;
                    sacJoueurs[1][0] = 1.5;
                    sacJoueurs[2][0] = 1.5;
                    sacJoueurs[3][0] = 1.5;

                    capaciteSacs[0] = capaciteSacs[0] - (sacJoueurs[0][0] * data.Place.Lingots);
                    capaciteSacs[1] = capaciteSacs[1] - (sacJoueurs[1][0] * data.Place.Lingots);
                    capaciteSacs[2] = capaciteSacs[2] - (sacJoueurs[2][0] * data.Place.Lingots);
                    capaciteSacs[3] = capaciteSacs[3] - (sacJoueurs[3][0] * data.Place.Lingots);

                    break;
            }
        }
    },
};
