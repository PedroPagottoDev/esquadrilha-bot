const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    const guild = member.guild;

    // Dá o cargo de Aluno de Aviação Militar automaticamente
    const recrutaRole = guild.roles.cache.find(r => r.name === '🛫 Aluno de Aviação Militar');
    if (recrutaRole) {
      await member.roles.add(recrutaRole).catch(() => {});
    }

    // Procura o canal de boas-vindas (bem-vindos ou chat-geral como fallback)
    const welcomeChannel =
      guild.channels.cache.find(c => c.name.includes('bem-vindos')) ||
      guild.channels.cache.find(c => c.name.includes('chat-geral'));

    if (!welcomeChannel) return;

    const embed = new EmbedBuilder()
      .setTitle('✈️ Novo Piloto nos Céus!')
      .setDescription(
        `Saudações, ${member}! Você acaba de ingressar na\n` +
        `**Formação Esquadrilha da Fumaça** — PTFS 💨\n\n` +
        `Aqui você vai aprender a:\n` +
        `🛩️ Pilotar aeronaves e caças no PTFS\n` +
        `🎪 Executar shows aéreos de precisão\n` +
        `⚔️ Defender o espaço aéreo em missões táticas\n\n` +
        `**Primeiros passos:**\n` +
        `**1.** Leia as 📜 regras\n` +
        `**2.** Vá em 📝 inscrições e solicite seu curso\n` +
        `**3.** Aguarde um oficial te chamar para o treinamento\n\n` +
        `*Bom voo, Aluno! A glória está nos céus.* 🫡`
      )
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setColor(0x2980B9)
      .setFooter({ text: 'Formação Esquadrilha da Fumaça • PTFS' })
      .setTimestamp();

    await welcomeChannel.send({ content: `${member}`, embeds: [embed] });
  },
};
