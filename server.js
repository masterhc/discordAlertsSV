const Discord  = require('discord.js');
const { networkInterfaces } = require('os');
const Intents = require('discord.js').Intents
const allIntents = new Intents(32767);
const bot = new Discord.Client({intents:allIntents});

bot.login(process.env.discord_token);

var IPCache = {};

bot.on('ready', ()=>
{
    init(bot);
    setInterval(()=>
    {
        checkIP().then((nIP)=>
        {
            message(nIP, bot);
        })
    }, 60000)
})

function checkIP()
{
    return new Promise((resolve, reject)=>
    {

        const nets = networkInterfaces();
        const results = {};

        for (const name of Object.keys(nets)) {
            for (const net of nets[name]) {
                if (net.family === 'IPv4' && !net.internal) {
                    if (!results[name]) {
                        results[name] = [];
                    }
                    results[name].push(net.address);
                    console.log('IPCache, results, equals', IPCache, results, IPCache==results);
                    if(IPCache != results)
                    {
                        IPCache = results;
                        resolve(results)
                    }
                }
                reject();
            }
        }
    })
}

function init(bot)
{
    console.log('Bot Started and Loged In on:',bot.guilds.cache.size, 'guilds.')

}

function message(ips, bot)
{
    bot.users.cache.get('186540961650835456').send(`Change in NetWork: ${JSON.stringify(ips)}`)
}