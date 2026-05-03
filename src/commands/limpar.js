const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');

const COMANDO_ROLES = [
  '👑 Diretor Supremo da Academia',
  '🎖️ Comandante da Base Aérea',
  '🧠 Oficial de Estratégia Aérea',
];

function temPermissao(member) {
  return member.roles.cache.some(r => COMANDO_ROLES.includes(r.name));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('limpar')
    .setDescription('Apaga todos os canais e cargos do servidor')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    if (!interaction.guild) {
      return interaction.reply({ content: 'Só pode ser usado em servidores.', ephemeral: true });
    }

    if (!temPermissao(interaction.member)) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle('❌ Acesso Negado')
            .setDescription('Apenas membros do **Comando da Academia** podem usar este comando.')
            .setColor(0xED4245),
        ],
        ephemeral: true,
      });
    }

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('limpar_confirm')
        .setLabel('☠️ Confirmar — Apagar Tudo')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('limpar_cancel')
        .setLabel('❌ Cancelar')
        .setStyle(ButtonStyle.Secondary)
    );

    const confirmMsg = await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle('⚠️ ATENÇÃO — Ação Irreversível')
          .setDescription(
            'Este comando vai **apagar TODOS os canais e cargos** do servidor.\n\n' +
            '> Esta ação **não pode ser desfeita**.\n\n' +
            'Tem certeza absoluta?'
          )
          .setColor(0xED4245),
      ],
      components: [row],
      ephemeral: true,
    });

    let collected;
    try {
      collected = await confirmMsg.awaitMessageComponent({
        filter: i => i.user.id === interaction.user.id,
        time: 30_000,
      });
    } catch {
      return interaction.editReply({ content: '⏱️ Tempo esgotado.', components: [], embeds: [] });
    }

    if (collected.customId === 'limpar_cancel') {
      return collected.update({ content: '❌ Operação cancelada.', components: [], embeds: [] });
    }

    await collected.update({
      embeds: [
        new EmbedBuilder()
          .setTitle('🗑️ Limpando servidor...')
          .setDescription('Apagando canais e cargos. Aguarde...')
          .setColor(0xED4245),
      ],
      components: [],
    });

    const guild = interaction.guild;

    // Apaga todos os canais
    const channels = [...guild.channels.cache.values()];
    for (const channel of channels) {
      await channel.delete('Esquadrilha Bot — /limpar').catch(() => {});
    }

    // Apaga todos os cargos (exceto @everyone e o cargo do próprio bot)
    await guild.roles.fetch();
    const botRoleId = guild.members.me?.roles.highest?.id;
    const roles = [...guild.roles.cache.values()].filter(
      r => r.id !== guild.roles.everyone.id && r.id !== botRoleId && r.editable
    );
    for (const role of roles) {
      await role.delete('Esquadrilha Bot — /limpar').catch(() => {});
    }

    // Cria um canal temporário para confirmar a conclusão
    const temp = await guild.channels.create({
      name: '✅┃servidor-limpo',
      reason: 'Esquadrilha Bot — /limpar concluído',
    }).catch(() => null);

    if (temp) {
      await temp.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('✅ Servidor Limpo!')
            .setDescription(
              'Todos os canais e cargos foram apagados.\n\n' +
              'Use `/setup` para configurar o servidor novamente.'
            )
            .setColor(0x57F287)
            .setTimestamp()
            .setFooter({ text: 'Esquadrilha Bot' }),
        ],
      });
    }
  },
};
