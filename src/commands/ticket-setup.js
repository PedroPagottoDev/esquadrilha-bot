const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require('discord.js');
const { TICKET_TYPES } = require('../ticket/handler');

const COMANDO_ROLES = [
  '👑 Diretor Supremo da Academia',
  '🎖️ Comandante da Base Aérea',
  '🧠 Oficial de Estratégia Aérea',
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket-setup')
    .setDescription('Posta o painel de tickets no canal atual')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    if (!interaction.guild) {
      return interaction.reply({ content: 'Só pode ser usado em servidores.', ephemeral: true });
    }

    const temPermissao = interaction.member.roles.cache.some(r => COMANDO_ROLES.includes(r.name));
    if (!temPermissao) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle('❌ Acesso Negado')
            .setDescription('Apenas o **Comando da Academia** pode usar este comando.')
            .setColor(0xED4245),
        ],
        ephemeral: true,
      });
    }

    const embed = new EmbedBuilder()
      .setTitle('🎫 Sistema de Tickets — Esquadrilha da Fumaça')
      .setDescription(
        'Precisa de ajuda ou tem alguma solicitação?\n\n' +
        '**Selecione o tipo de ticket no menu abaixo:**\n\n' +
        '🎓 **Inscrição em Curso** — Quero me inscrever em um curso\n' +
        '❓ **Suporte Geral** — Dúvidas e ajuda geral\n' +
        '⚔️ **Missão / Operação** — Solicitações de missão\n' +
        '🤝 **Parceria** — Proposta de parceria\n' +
        '📋 **Reclamação** — Denúncias e reclamações\n\n' +
        '> Um membro do **Staff** responderá em breve.'
      )
      .setColor(0x2980B9)
      .setFooter({ text: 'Formação Esquadrilha da Fumaça • Tickets' })
      .setTimestamp();

    const menu = new StringSelectMenuBuilder()
      .setCustomId('ticket_abrir')
      .setPlaceholder('Selecione o tipo de ticket...')
      .addOptions(
        Object.entries(TICKET_TYPES).map(([value, info]) =>
          new StringSelectMenuOptionBuilder()
            .setLabel(info.label)
            .setValue(value)
            .setEmoji(info.emoji)
        )
      );

    const row = new ActionRowBuilder().addComponents(menu);

    await interaction.channel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: '✅ Painel de tickets postado!', ephemeral: true });
  },
};
