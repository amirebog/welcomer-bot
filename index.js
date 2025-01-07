// ساخته شده توسط amireb._.og0047
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { token, welcomeChannelId, goodbyeChannelId } = require('./config.json');

// ایجاد کلاینت جدید دیسکورد با دسترسی‌های مختلف
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,          // دسترسی به اطلاعات سرور
        GatewayIntentBits.GuildMembers,   // دسترسی به اطلاعات اعضای سرور
        GatewayIntentBits.GuildMessages,  // دسترسی به پیام‌ها در سرور
        GatewayIntentBits.MessageContent, // دسترسی به محتوای پیام‌ها
        GatewayIntentBits.GuildPresences // برای دسترسی به وضعیت آنلاین/آفلاین کاربران
    ]
});

// زمانی که ربات آماده است وارد سرور می‌شود
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// زمانی که یک عضو جدید به سرور می‌پیوندد
client.on('guildMemberAdd', async (member) => {
    const channel = member.guild.channels.cache.get(welcomeChannelId);
    if (!channel) return; // اگر کانال خوشامدگویی پیدا نشد، تابع متوقف می‌شود

    // شمارش تعداد اعضای سرور و وضعیت آنلاین/آفلاین
    const totalMembers = member.guild.memberCount;
    const onlineMembers = member.guild.members.cache.filter(m => m.presence && m.presence.status === 'online').size;
    const offlineMembers = member.guild.members.cache.filter(m => !m.presence || m.presence.status === 'offline').size;

    // ایجاد پیام خوشامدگویی با اضافه کردن ایموجی‌ها
    const embed = new EmbedBuilder()
        .setColor('#00FF00') // رنگ سبز
        .setTitle('🎉 خوش آمدید! 🎉') // عنوان پیام با ایموجی
        .setDescription(`به سرور **${member.guild.name}** خوش آمدید، ${member.user.username}! 👋`) // متن پیام با ایموجی
        .setThumbnail(member.user.displayAvatarURL()) // تصویر پروفایل کاربر
        .addFields(
            { name: '👤 نام کاربری:', value: member.user.username, inline: true },
            { name: '🆔 آی دی کاربر:', value: member.user.id, inline: true },
            { name: '📅 زمان ایجاد حساب:', value: member.user.createdAt.toDateString(), inline: true },
            { name: '📅 تاریخ پیوستن:', value: member.joinedAt.toDateString(), inline: true },
            { name: '💬 تگ کاربر:', value: member.user.tag, inline: true },
            { name: '🌐 وضعیت کاربر:', value: member.presence?.status || 'آفلاین', inline: true },
            { name: '🎖️ بالاترین نقش:', value: member.roles.highest.name, inline: true },
            { name: '🔢 تعداد نقش‌ها:', value: `${member.roles.cache.size - 1}`, inline: true }, // -1 برای حذف نقش @everyone
            { name: '👥 تعداد کل اعضا:', value: `${totalMembers}`, inline: true },
            { name: '🟢 اعضای آنلاین:', value: `${onlineMembers}`, inline: true },
            { name: '⚪ اعضای آفلاین:', value: `${offlineMembers}`, inline: true }
        )
        .setFooter({ text: 'امیدواریم از وقت خود در اینجا لذت ببرید! 🌟' }); // یادآوری در فوتر با ایموجی

    // ارسال پیام خوشامدگویی
    channel.send({ embeds: [embed] });
});

// زمانی که یک عضو از سرور خارج می‌شود
client.on('guildMemberRemove', async (member) => {
    const channel = member.guild.channels.cache.get(goodbyeChannelId);
    if (!channel) return; // اگر کانال خداحافظی پیدا نشد، تابع متوقف می‌شود

    // ایجاد پیام خداحافظی با اضافه کردن ایموجی‌ها
    const embed = new EmbedBuilder()
        .setColor('#FF0000') // رنگ قرمز
        .setTitle('👋 خداحافظ! 👋') // عنوان پیام با ایموجی
        .setDescription(`کاربر **${member.user.username}** از سرور **${member.guild.name}** خارج شد. 😢`) // متن پیام با ایموجی
        .setThumbnail(member.user.displayAvatarURL()) // تصویر پروفایل کاربر
        .addFields(
            { name: '👤 نام کاربری:', value: member.user.username, inline: true },
            { name: '🆔 آی دی کاربر:', value: member.user.id, inline: true },
            { name: '📅 زمان ایجاد حساب:', value: member.user.createdAt.toDateString(), inline: true },
            { name: '💬 تگ کاربر:', value: member.user.tag, inline: true }
        )
        .setFooter({ text: 'امیدواریم در آینده دوباره شما را ببینیم! 🌈' }); // یادآوری در فوتر با ایموجی

    // ارسال پیام خداحافظی
    channel.send({ embeds: [embed] });
});

// ورود به دیسکورد با توکن ربات
client.login(token);
