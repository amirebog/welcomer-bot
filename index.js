const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { token, welcomeChannelId } = require('./config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences // برای دسترسی به وضعیت آنلاین و آفلاین کاربران
    ]
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    console.log(`Amade be kar`);
});

client.on('guildMemberAdd', async member => {
    const channel = member.guild.channels.cache.get(welcomeChannelId);
    if (!channel) return;

    // شمارش تعداد اعضا
    const totalMembers = member.guild.memberCount;
    const onlineMembers = member.guild.members.cache.filter(m => m.presence && m.presence.status === 'online').size;
    const offlineMembers = member.guild.members.cache.filter(m => !m.presence || m.presence.status === 'offline').size;

    const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('خوش آمدید!')
        .setDescription(`به سرور **${member.guild.name}** خوش آمدید، ${member.user.username}!`)
        .setThumbnail(member.user.displayAvatarURL())
        .addFields(
            { name: 'نام کاربری:', value: member.user.username, inline: true },
            { name: 'آی دی کاربر:', value: member.user.id, inline: true },
            { name: 'زمان ایجاد حساب:', value: member.user.createdAt.toDateString(), inline: true },
            { name: 'تاریخ پیوستن:', value: member.joinedAt.toDateString(), inline: true },
            { name: 'تگ کاربر:', value: member.user.tag, inline: true },
            { name: 'وضعیت کاربر:', value: member.presence?.status || 'آفلاین', inline: true },
            { name: 'بالاترین نقش:', value: member.roles.highest.name, inline: true },
            { name: 'تعداد نقش‌ها:', value: `${member.roles.cache.size - 1}`, inline: true }, // -1 برای حذف نقش @everyone
            { name: 'تعداد کل اعضا:', value: `${totalMembers}`, inline: true },
            { name: 'اعضای آنلاین:', value: `${onlineMembers}`, inline: true },
            { name: 'اعضای آفلاین:', value: `${offlineMembers}`, inline: true }
        )
        .setFooter({ text: 'امیدواریم از وقت خود در اینجا لذت ببرید!' });

    channel.send({ embeds: [embed] });
});

client.on('guildMemberRemove', async member => {
    const channel = member.guild.channels.cache.get(welcomeChannelId);
    if (!channel) return;

    const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('خداحافظ!')
        .setDescription(`کاربر **${member.user.username}** از سرور **${member.guild.name}** خارج شد.`)
        .setThumbnail(member.user.displayAvatarURL())
        .addFields(
            { name: 'نام کاربری:', value: member.user.username, inline: true },
            { name: 'آی دی کاربر:', value: member.user.id, inline: true },
            { name: 'زمان ایجاد حساب:', value: member.user.createdAt.toDateString(), inline: true },
            { name: 'تگ کاربر:', value: member.user.tag, inline: true }
        )
        .setFooter({ text: 'امیدواریم در آینده دوباره شما را ببینیم!' });

    channel.send({ embeds: [embed] });
});

client.login(token);