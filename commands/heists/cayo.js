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
        .addBooleanOption(option =>
            option.setName('difficile')
            .setDescription('Mode difficile')
            .setRequired(true)
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
        const difficile = interaction.options.getBoolean('difficile')

        // Objectifs prenables : (minimum)
        // MaxOr = 1,5; MaxTableaux & MaxCoke = 2; MaxCannabis = 3; MaxArgent = 3
        let sacJoueurs = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
        let capaciteSacs = [100, 100, 100, 100];
        capaciteSacs = capaciteSacs.slice(0, joueurs)
        let orPrenable = 0
        let cokePrenable = 0
        let cannabisPrenable = 0
        let argentPrenable = 0
        let tableauxPrenable = 0
        const partChef = (100 - (joueurs-1)*15)/100
        console.log(partChef)
        calculOr()
        calculCoke()
        calculCannabis()
        calculTableaux()
        calculArgent()

        let min = orPrenable * Number(data.Secondaires.Lingots[0]) + cokePrenable * Number(data.Secondaires.Cocaïne[0]) + tableauxPrenable * Number(data.Secondaires.Tableaux[0]) + cannabisPrenable * Number(data.Secondaires.Cannabis[0]) + argentPrenable * Number(data.Secondaires.Argent[0]) + (difficile ? Number(data.Principaux[principal][1]) : Number(data.Principaux[principal][0])) + data.Secondaires.Bureau[0] ;
        min = min * data.FRAIS;
        min = min * partChef
        min = String(min) + '$';

        let max = orPrenable * Number(data.Secondaires.Lingots[1]) + cokePrenable * Number(data.Secondaires.Cocaïne[1]) + tableauxPrenable * Number(data.Secondaires.Tableaux[1]) + cannabisPrenable * Number(data.Secondaires.Cannabis[1]) + argentPrenable * Number(data.Secondaires.Argent[1]) + (difficile ? Number(data.Principaux[principal][1]) : Number(data.Principaux[principal][0])) + data.Secondaires.Bureau[1];
        max =  max * data.FRAIS;
        max = max * partChef
        max = String(max) + '$';

        const Embed = new EmbedBuilder()
            .setTitle(`Rentabilitée du cayo de ${interaction.user.displayName}`)
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
                { name: 'Minimum :', value: String(min), inline: true },
                { name: 'Maximum :', value: String(max), inline: true },
                { name: '\u200b', value: '\u200b' },
            );
        if(orPrenable>0){
            Embed.addFields({ name: 'Or prenable :', value: String(orPrenable), inline: true})
        }
        if(cokePrenable>0){
            Embed.addFields({ name: 'Coke prenable :', value: String(Math.round(cokePrenable*10)/10), inline: true})
        }
        if(cannabisPrenable>0){
            Embed.addFields({ name: 'Cannabis prenable :', value: String(Math.round(cannabisPrenable*10)/10), inline: true})
        }
        if(tableauxPrenable>0){
            Embed.addFields({ name: 'Tableaux prenables :', value: String(Math.round(tableauxPrenable*10)/10), inline: true})
        }
        if(argentPrenable>0){
            Embed.addFields({ name: 'Argent prenable :', value: String(Math.round(argentPrenable*10)/10), inline: true})
        }
        if(orPrenable >0 || cokePrenable>0 || cannabisPrenable>0 || tableauxPrenable>0 || argentPrenable>0){
            Embed.addFields({ name: '\u200b', value: '\u200b'})
        }
        for(let i = 0; i<joueurs; i++){
            Embed.addFields({ name: `Joueur ${i+1} :`, value: `Capacité du joueur ${i+1} (en clicks)`})
            if(sacJoueurs[i][0]>0){
                Embed.addFields({ name: 'Or', value: String(sacJoueurs[i][0]*10), inline: true})
            }
            if(sacJoueurs[i][1]>0){
                Embed.addFields({ name: 'Coke', value: String(Math.round(sacJoueurs[i][1]*10)), inline: true})
            }
            if(sacJoueurs[i][2]>0){
                Embed.addFields({ name: 'Cannabis', value: String(Math.round(sacJoueurs[i][2]*10)), inline: true})
            }
            if(sacJoueurs[i][3]>0){
                Embed.addFields({ name: 'Tableaux', value: String(sacJoueurs[i][3]), inline: true})
            }
            if(sacJoueurs[i][4]>0){
                Embed.addFields({ name: 'Argent', value: String(Math.round(sacJoueurs[i][4]*10)), inline: true})
            }
        }
        await interaction.reply({ embeds: [Embed] });

        /*
        sacJoueurs[0] correspond au sac du premier joueur (le print donnera : [1.5, 0] par ex)
        sacJoueurs[0][0] correpond au nombre d'or dans le sac du premier joueur (selon le même ex que ci dessus, le print donnera : 1.5)

        capaciteSacs[0] est la capacité restante dans le sac du premier joueur (ici après l'avoir rempli d'or)
        Cette variable vas servir pour remplir les sacs avec autre chose que de l'or

        */
        function calculOr(){
            let orRestant = or
            let i = 0
            const placeOr = 100*data.Place.Lingots
            while(orRestant >= 0.5 && i<joueurs){
                while(capaciteSacs[i] - placeOr/2>=1 && orRestant>=0.5){
                    orRestant = orRestant-0.5
                    orPrenable = orPrenable+0.5
                    capaciteSacs[i] = capaciteSacs[i]- placeOr/2
                    sacJoueurs[i][0] = sacJoueurs[i][0] +0.5
                }
                i++
            }
        }

        function calculCoke(){
            let cokeRestant = coke
            let i = 0
            const placeCoke = 100*data.Place.Cocaïne
            while(cokeRestant>0 && i<joueurs){
                while(capaciteSacs[i] - placeCoke/10 >=4 && cokeRestant>=0.1){
                    cokeRestant -= 0.1
                    cokePrenable += 0.1
                    capaciteSacs[i] = capaciteSacs[i] - placeCoke/10
                    sacJoueurs[i][1] = sacJoueurs[i][1] + 0.1
                }
                i++
            }
        }

        function calculCannabis(){
            let cannabisRestant = cannabis
            let i = 0
            const placeCannabis = 100*data.Place.Cannabis
            while(cannabisRestant>0 && i<joueurs){
                while(capaciteSacs[i] - placeCannabis/10 >=1 && cannabisRestant>=0.1){
                    cannabisRestant -= 0.1
                    cannabisPrenable += 0.1
                    capaciteSacs[i] = capaciteSacs[i] - placeCannabis/10
                    sacJoueurs[i][2] += 0.1
                }
                i++
            }
        }
        function calculTableaux(){
            let tableauxRestant = tableaux
            let i = 0
            const placeTableaux = data.Place.Tableaux*100
            while(tableauxRestant>0 && i<joueurs){
                while(capaciteSacs[i] - placeTableaux >= 0 && tableauxRestant>=1){
                    tableauxRestant -= 1
                    tableauxPrenable++
                    capaciteSacs[i] = capaciteSacs[i] - placeTableaux
                    sacJoueurs[i][3]++
                }
                i++
            }
        }
        function calculArgent(){
            let argentRestant = argent
            let i = 0
            const placeArgent = 100*data.Place.Argent
            while(argentRestant>0 && i<joueurs){
                while(capaciteSacs[i] - placeArgent/10 >=0 && argentRestant>=0.1){
                    argentRestant-=0.1
                    argentPrenable+=0.1
                    capaciteSacs[i] = capaciteSacs[i] - placeArgent/10
                    sacJoueurs[i][4] += 0.1
                }
                i++
            }
        }
    },
};
