const {
  EmbedBuilder,
  ChannelType,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');

const TICKET_TYPES = {
  inscricao:  { label: 'Inscrição em Curso',    emoji: '🎓', color: 0x27AE60 },
  suporte:    { label: 'Suporte Geral',          emoji: '❓', color: 0x2980B9 },
  parceria:   { label: 'Parceria',               emoji: '🤝', color: 0x9B59B6 },
  reclamacao: { label: 'Reclamação',             emoji: '📋', color: 0xE74C3C },
  missao:     { label: 'Missão / Operação',      emoji: '⚔️', color: 0xF39C12 },
};

const STAFF_ROLES = [
  '👑 Diretor Supremo da Academia',
  '🎖️ Comandante da Base Aérea',
  '🧠 Oficial de Estratégia Aérea',
  '🔨 Moderador Militar',
  '📡 Supervisor de Operações',
];

async function criarTicket(interaction, tipo) {
  const guild = interaction.guild;
  const user  = interaction.user;
  const info  = TICKET_TYPES[tipo];

  if (!info) return interaction.reply({ content: '❌ Tipo de ticket inválido.', ephemeral: true });

  // Verifica se o usuário já tem ticket aberto
  const existing = guild.channels.cache.find(c => c.topic === `ticket:${user.id}`);
  if (existing) {
    return interaction.reply({
      content: `Você já tem um ticket aberto: ${existing}`,
      ephemeral: true,
    });
  }

  await interaction.deferReply({ ephemeral: true });

  // Permissões do canal
  const overwrites = [
    { id: guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
    {
      id: user.id,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ReadMessageHistory,
        PermissionFlagsBits.AttachFiles,
      ],
    },
  ];

  for (const roleName of STAFF_ROLES) {
    const role = guild.roles.cache.find(r => r.name === roleName);
    if (role) {
      overwrites.push({
        id: role.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
          PermissionFlagsBits.ManageMessages,
        ],
      });
    }
  }

  // Cria categoria de tickets se não existir
  let category = guild.channels.cache.find(
    c => c.name === '🎫 TICKETS' && c.type === ChannelType.GuildCategory
  );
  if (!category) {
    category = await guild.channels.create({
      name: '🎫 TICKETS',
      type: ChannelType.GuildCategory,
      permissionOverwrites: [{ id: guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] }],
    });
  }

  const slug = user.username.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20) || user.id.slice(-6);
  const channel = await guild.channels.create({
    name: `🎫┃ticket-${slug}`,
    type: ChannelType.GuildText,
    parent: category.id,
    topic: `ticket:${user.id}`,
    permissionOverwrites: overwrites,
  });

  const embed = new EmbedBuilder()
    .setTitle(`${info.emoji} ${info.label}`)
    .setDescription(
      `Olá ${user}! Seu ticket foi aberto com sucesso.\n\n` +
      `Descreva sua solicitação com o máximo de detalhes.\n` +
      `Um membro do **Staff** responderá em breve.\n\n` +
      `> Clique em **Fechar Ticket** quando o assunto for resolvido.`
    )
    .addFields(
      { name: '👤 Aberto por', value: `${user}`, inline: true },
      { name: '📋 Tipo',       value: `${info.emoji} ${info.label}`, inline: true },
    )
    .setColor(info.color)
    .setTimestamp()
    .setFooter({ text: 'Formação Esquadrilha da Fumaça • Tickets' });

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('ticket_fechar')
      .setLabel('🔒 Fechar Ticket')
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId('ticket_reivindicar')
      .setLabel('✋ Reivindicar')
      .setStyle(ButtonStyle.Secondary),
  );

  await channel.send({ content: `${user}`, embeds: [embed], components: [row] });
  await interaction.editReply({ content: `✅ Ticket aberto! Acesse ${channel}` });
}

async function fecharTicket(interaction) {
  const channel = interaction.channel;

  if (!channel.topic?.startsWith('ticket:')) {
    return interaction.reply({ content: '❌ Este não é um canal de ticket.', ephemeral: true });
  }

  const ownerId  = channel.topic.replace('ticket:', '');
  const isOwner  = interaction.user.id === ownerId;
  const isStaff  = interaction.member.roles.cache.some(r => STAFF_ROLES.includes(r.name));

  if (!isOwner && !isStaff) {
    return interaction.reply({ content: '❌ Você não tem permissão para fechar este ticket.', ephemeral: true });
  }

  await interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setTitle('🔒 Ticket Encerrado')
        .setDescription(`Ticket fechado por ${interaction.user}.\nEste canal será deletado em **5 segundos**.`)
        .setColor(0xED4245)
        .setTimestamp(),
    ],
  });

  setTimeout(() => channel.delete('Ticket encerrado').catch(() => {}), 5000);
}

async function reivindicarTicket(interaction) {
  const isStaff = interaction.member.roles.cache.some(r => STAFF_ROLES.includes(r.name));
  if (!isStaff) {
    return interaction.reply({ content: '❌ Apenas o Staff pode reivindicar tickets.', ephemeral: true });
  }

  await interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setDescription(`✋ **${interaction.user}** está atendendo este ticket.`)
        .setColor(0x57F287),
    ],
  });
}

module.exports = { criarTicket, fecharTicket, reivindicarTicket, TICKET_TYPES };
