const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  OverwriteType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');

// ─── Definição completa do servidor ───────────────────────────────────────────

const ROLES = [
  // Comunidade
  { name: '🟢 Piloto Ativo',                color: '#2ECC71', hoist: false, mentionable: false, permissions: [] },
  { name: '💎 Membro Honrado',              color: '#1ABC9C', hoist: false, mentionable: false, permissions: [] },
  { name: '🎖️ Veterano da Base',            color: '#95A5A6', hoist: false, mentionable: false, permissions: [] },
  { name: '🛰️ Parceiro Militar',            color: '#7F8C8D', hoist: false, mentionable: false, permissions: [] },
  // Controle Aéreo
  { name: '📡 Operador de Radar',           color: '#3498DB', hoist: true,  mentionable: true,  permissions: [] },
  { name: '🎧 Controlador Aéreo',           color: '#2980B9', hoist: true,  mentionable: true,  permissions: [] },
  // Academia de Pilotos
  { name: '🛫 Aluno de Aviação Militar',    color: '#95A5A6', hoist: true,  mentionable: true,  permissions: [] },
  { name: '✈️ Cadete em Treinamento',       color: '#27AE60', hoist: true,  mentionable: true,  permissions: [] },
  { name: '🎤 Instrutor de Voo',            color: '#F39C12', hoist: true,  mentionable: true,  permissions: [] },
  // Esquadrão Operacional
  { name: '🔥 Piloto de Caça',              color: '#E74C3C', hoist: true,  mentionable: true,  permissions: [] },
  { name: '⚡ Piloto de Elite',             color: '#F1C40F', hoist: true,  mentionable: true,  permissions: [] },
  { name: '☠️ Ás da Academia',              color: '#ECF0F1', hoist: true,  mentionable: true,  permissions: [] },
  // Staff da Base
  { name: '🎥 Oficial de Mídia Militar',   color: '#E91E63', hoist: true,  mentionable: true,  permissions: ['ManageMessages'] },
  { name: '🧰 Engenheiro da Base',          color: '#9B59B6', hoist: true,  mentionable: true,  permissions: ['ManageChannels', 'ManageMessages'] },
  { name: '📡 Supervisor de Operações',     color: '#1ABC9C', hoist: true,  mentionable: true,  permissions: ['ManageMessages'] },
  { name: '🔨 Moderador Militar',           color: '#2980B9', hoist: true,  mentionable: true,  permissions: ['ManageMessages', 'KickMembers', 'MuteMembers'] },
  // Comando da Academia
  { name: '🧠 Oficial de Estratégia Aérea', color: '#C0392B', hoist: true, mentionable: true,  permissions: ['ManageMessages', 'ManageChannels'] },
  { name: '🎖️ Comandante da Base Aérea',   color: '#FF6B00', hoist: true,  mentionable: true,  permissions: ['ManageGuild', 'ManageChannels', 'ManageRoles', 'KickMembers', 'BanMembers'] },
  { name: '👑 Diretor Supremo da Academia', color: '#FFD700', hoist: true,  mentionable: true,  permissions: ['Administrator'] },
];

const PERMISSION_MAP = {
  Administrator:   PermissionFlagsBits.Administrator,
  ManageGuild:     PermissionFlagsBits.ManageGuild,
  ManageChannels:  PermissionFlagsBits.ManageChannels,
  ManageRoles:     PermissionFlagsBits.ManageRoles,
  KickMembers:     PermissionFlagsBits.KickMembers,
  BanMembers:      PermissionFlagsBits.BanMembers,
  ManageMessages:  PermissionFlagsBits.ManageMessages,
  MuteMembers:     PermissionFlagsBits.MuteMembers,
};

const CATEGORIES = [
  {
    name: '📋 INFORMAÇÕES',
    staffOnly: false,
    channels: [
      { name: '🏠┃sobre-a-esquadrilha',  type: 'text',  readonly: true,  topic: 'O que é a Formação Esquadrilha da Fumaça' },
      { name: '📜┃regras',                type: 'text',  readonly: true,  topic: 'Regulamento interno — leia antes de tudo' },
      { name: '📣┃anúncios',              type: 'text',  readonly: true,  topic: 'Comunicados oficiais do Comando' },
      { name: '📅┃agenda-de-operações',  type: 'text',  readonly: true,  topic: 'Calendário de treinos, shows e missões' },
      { name: '👋┃bem-vindos',            type: 'text',  readonly: false, topic: 'Boas-vindas aos novos recrutas' },
      { name: '🎫┃abrir-ticket',          type: 'text',  readonly: false, topic: 'Suporte e inscrições' },
    ],
  },
  {
    name: '🛩️ FORMAÇÃO DE PILOTOS',
    staffOnly: false,
    channels: [
      { name: '📚┃cursos-disponíveis',   type: 'text',  readonly: true,  topic: 'Cursos ativos e requisitos' },
      { name: '📝┃inscrições',            type: 'text',  readonly: false, topic: 'Solicite sua inscrição em um curso' },
      { name: '🛩️┃manual-do-piloto',     type: 'text',  readonly: true,  topic: 'Manual de voo e procedimentos' },
      { name: '📊┃progresso-dos-cadetes', type: 'text', readonly: true,  topic: 'Acompanhamento dos cadetes em formação' },
      { name: '💬┃dúvidas-de-voo',       type: 'text',  readonly: false, topic: 'Tire dúvidas sobre manobras e procedimentos' },
      { name: '📸┃logs-de-treino',        type: 'text',  readonly: false, topic: 'Poste screenshots dos seus treinos' },
    ],
  },
  {
    name: '🎪 SHOWS AÉREOS',
    staffOnly: false,
    channels: [
      { name: '🎪┃guia-de-shows',         type: 'text',  readonly: true,  topic: 'Como planejar e executar um show aéreo' },
      { name: '📅┃próximos-shows',         type: 'text',  readonly: true,  topic: 'Shows agendados e confirmados' },
      { name: '🗂️┃planejamento',           type: 'text',  readonly: false, topic: 'Coordenação de coreografias e rotas' },
      { name: '🖼️┃galeria',               type: 'text',  readonly: false, topic: 'Fotos e vídeos dos shows realizados' },
      { name: '🏆┃hall-da-fama',           type: 'text',  readonly: true,  topic: 'Melhores momentos da Esquadrilha' },
    ],
  },
  {
    name: '⚔️ DEFESA AÉREA',
    staffOnly: false,
    channels: [
      { name: '🗺️┃táticas-de-combate',   type: 'text',  readonly: false, topic: 'Estratégias para defesa do espaço aéreo' },
      { name: '🎯┃missões-ativas',         type: 'text',  readonly: false, topic: 'Briefing das missões em andamento' },
      { name: '📋┃debriefing',             type: 'text',  readonly: false, topic: 'Análise e relatório pós-missão' },
      { name: '🔫┃armamento-e-aeronaves',  type: 'text',  readonly: false, topic: 'Caças, armamento e equipamentos' },
    ],
  },
  {
    name: '💬 GERAL',
    staffOnly: false,
    channels: [
      { name: '💬┃chat-geral',            type: 'text',  readonly: false, topic: 'Conversa geral entre os membros' },
      { name: '🎮┃ptfs-geral',            type: 'text',  readonly: false, topic: 'Assuntos gerais sobre o PTFS' },
      { name: '📰┃notícias-ptfs',          type: 'text',  readonly: false, topic: 'Atualizações e novidades do PTFS' },
      { name: '🖼️┃screenshots',           type: 'text',  readonly: false, topic: 'Compartilhe suas melhores capturas' },
      { name: '😄┃off-topic',             type: 'text',  readonly: false, topic: 'Assuntos fora do tema principal' },
    ],
  },
  {
    name: '🎙️ SALAS DE VOZ',
    staffOnly: false,
    channels: [
      { name: '🏛️ Sala de Briefing',       type: 'voice' },
      { name: '🛩️ Treinamento em Voo',      type: 'voice' },
      { name: '⚔️ Sala de Missão',          type: 'voice' },
      { name: '🎪 Coordenação de Show',     type: 'voice' },
      { name: '☕ Lobby',                   type: 'voice' },
    ],
  },
  {
    name: '🎖️ COMANDO — STAFF',
    staffOnly: true,
    channels: [
      { name: '💼┃comando-privado',        type: 'text',  readonly: false, topic: 'Canal exclusivo do Comando' },
      { name: '📋┃gestão-de-cadetes',      type: 'text',  readonly: false, topic: 'Promoções, suspensões e desligamentos' },
      { name: '📊┃logs-do-servidor',       type: 'text',  readonly: false, topic: 'Logs de moderação e ações administrativas' },
      { name: '🔧┃configurações',          type: 'text',  readonly: false, topic: 'Configurações e manutenção do servidor' },
      { name: '🔒 Reunião de Comando',     type: 'voice', userLimit: 8 },
    ],
  },
];

// ─── Conteúdo automático ──────────────────────────────────────────────────────

async function postarSobre(channel) {
  const embeds = [
    new EmbedBuilder()
      .setTitle('💨 Formação Esquadrilha da Fumaça — PTFS')
      .setDescription(
        'Bem-vindo à **Esquadrilha da Fumaça**, a organização de aviação militar mais completa do **PTFS**!\n\n' +
        'Nossa missão é tripla:\n' +
        '🛩️ **Formar pilotos** — do básico ao combate avançado\n' +
        '🎪 **Realizar shows aéreos** — coreografias de precisão nos céus\n' +
        '⚔️ **Defender o espaço aéreo** — patrulha e interceptação com caças\n\n' +
        'Se você sonha em voar com maestria no PTFS, este é o seu lugar.'
      )
      .setColor(0x2980B9)
      .setTimestamp(),

    new EmbedBuilder()
      .setTitle('🏅 Hierarquia da Academia')
      .setDescription(
        '**👑 COMANDO DA ACADEMIA**\n' +
        '👑 **Diretor Supremo da Academia** — Dono e autoridade máxima\n' +
        '🎖️ **Comandante da Base Aérea** — Gerencia toda a academia\n' +
        '🧠 **Oficial de Estratégia Aérea** — Eventos, missões e organização\n\n' +
        '**🛡️ STAFF DA BASE**\n' +
        '🔨 **Moderador Militar** — Ordem e regras\n' +
        '📡 **Supervisor de Operações** — Treinos e atividades\n' +
        '🧰 **Engenheiro da Base** — Bots e estrutura\n' +
        '🎥 **Oficial de Mídia Militar** — Anúncios e divulgação\n\n' +
        '**🎓 ACADEMIA DE PILOTOS**\n' +
        '🎤 **Instrutor de Voo** — Ensina manobras e combate\n' +
        '✈️ **Cadete em Treinamento** — Aprendendo a pilotar\n' +
        '🛫 **Aluno de Aviação Militar** — Novato recém-chegado\n\n' +
        '**⚔️ ESQUADRÃO OPERACIONAL**\n' +
        '☠️ **Ás da Academia** — Melhor piloto, cargo raro\n' +
        '⚡ **Piloto de Elite** — Experiente e destaque em combate\n' +
        '🔥 **Piloto de Caça** — Piloto oficial aprovado'
      )
      .setColor(0xFFD700),

    new EmbedBuilder()
      .setTitle('🚀 Como Começar')
      .setDescription(
        '**1.** Leia as 📜┃regras\n' +
        '**2.** Inscreva-se em um curso em 📝┃inscrições\n' +
        '**3.** Participe dos treinos e suba de patente\n' +
        '**4.** Voe com a Esquadrilha nos shows e missões\n\n' +
        '> Dúvidas? Use 🎫┃abrir-ticket ou pergunte em 💬┃chat-geral\n\n' +
        '**Bom voo, piloto!** 🫡'
      )
      .setColor(0x27AE60)
      .setFooter({ text: 'Formação Esquadrilha da Fumaça • PTFS Bot' }),
  ];

  for (const embed of embeds) await channel.send({ embeds: [embed] });
}

async function postarRegras(channel) {
  const embeds = [
    new EmbedBuilder()
      .setTitle('📜 Regulamento Interno — Formação Esquadrilha da Fumaça')
      .setDescription(
        'Ao ingressar na Esquadrilha, você concorda com todo o regulamento abaixo.\n' +
        '**Disciplina é a base de toda grande esquadrilha.** ✈️'
      )
      .setColor(0xC0392B)
      .setTimestamp(),

    new EmbedBuilder()
      .setTitle('§1 — Conduta e Disciplina')
      .setDescription(
        '**1.1** Respeite todos os membros, independente de patente.\n' +
        '**1.2** Trate superiores com respeito e siga ordens dentro do regulamento.\n' +
        '**1.3** Proibido desacato, ofensa ou humilhação.\n' +
        '**1.4** Spam, flood e abuso de menções são proibidos.\n' +
        '**1.5** Conteúdo adulto, político ou ilegal é terminantemente proibido.'
      )
      .setColor(0xED4245),

    new EmbedBuilder()
      .setTitle('§2 — Formação e Treinos')
      .setDescription(
        '**2.1** Recrutas devem se inscrever em um curso para progredir de patente.\n' +
        '**2.2** Presença em treinos agendados é **obrigatória** para Cadetes e acima.\n' +
        '**2.3** Faltas não justificadas em 3 treinos consecutivos resultam em advertência.\n' +
        '**2.4** Poste seus logs de treino em 📸┃logs-de-treino para validação.\n' +
        '**2.5** Dúvidas sobre voo em 💬┃dúvidas-de-voo.'
      )
      .setColor(0xF39C12),

    new EmbedBuilder()
      .setTitle('§3 — Shows Aéreos')
      .setDescription(
        '**3.1** Shows são planejados com no mínimo **48h de antecedência**.\n' +
        '**3.2** Apenas **Sargento ou acima** participam de shows.\n' +
        '**3.3** Durante o show, siga rigorosamente a coreografia do briefing.\n' +
        '**3.4** Comunicação via voz é obrigatória em 🎪 Coordenação de Show.\n' +
        '**3.5** Registre fotos/vídeos em 🖼️┃galeria após cada show.'
      )
      .setColor(0x8E44AD),

    new EmbedBuilder()
      .setTitle('§4 — Defesa Aérea')
      .setDescription(
        '**4.1** Missões são coordenadas pelo **Capitão** ou superior.\n' +
        '**4.2** Siga o briefing em 🎯┃missões-ativas antes de iniciar qualquer operação.\n' +
        '**4.3** Preencha o relatório em 📋┃debriefing após cada missão.\n' +
        '**4.4** Ataques não autorizados a outras aeronaves são proibidos.'
      )
      .setColor(0x2980B9),

    new EmbedBuilder()
      .setTitle('§5 — Progressão de Patentes')
      .setDescription(
        '🛫 **Aluno de Aviação Militar** → Ingressante — sem requisitos\n' +
        '✈️ **Cadete em Treinamento** → Concluir o Curso Básico de Voo\n' +
        '🎤 **Instrutor de Voo** → Aprovação do Comandante da Base\n' +
        '🔥 **Piloto de Caça** → Piloto oficial aprovado em missão\n' +
        '⚡ **Piloto de Elite** → Destaque em combate e atividade\n' +
        '☠️ **Ás da Academia** → Cargo raro — indicação do Diretor Supremo\n' +
        '🎧 **Controlador Aéreo** → Membro da equipe ATC\n' +
        '🔨 **Moderador Militar** → Indicação do Comandante da Base\n' +
        '🎖️ **Comandante da Base Aérea** → Indicação do Diretor Supremo\n' +
        '👑 **Diretor Supremo da Academia** → Dono da companhia'
      )
      .setColor(0xFFD700),

    new EmbedBuilder()
      .setTitle('§6 — Penalidades')
      .setDescription(
        '**Advertência** — Infrações leves ou primeira ocorrência.\n' +
        '**Rebaixamento** — Reincidência ou infração moderada.\n' +
        '**Suspensão** — Infrações graves.\n' +
        '**Banimento** — Infrações gravíssimas ou desrespeito ao Comando.'
      )
      .setColor(0xED4245)
      .setFooter({ text: 'Formação Esquadrilha da Fumaça • 2026' }),
  ];

  for (const embed of embeds) await channel.send({ embeds: [embed] });
}

async function postarCursos(channel) {
  const embeds = [
    new EmbedBuilder()
      .setTitle('📚 Cursos Disponíveis — Formação Esquadrilha da Fumaça')
      .setDescription(
        'Para se inscrever, acesse 📝┃inscrições e use o modelo:\n\n' +
        '```\n📋 INSCRIÇÃO\nNome de usuário: \nCurso desejado: \nHorário disponível: \n```\n\n' +
        '> ⚠️ Você só pode estar em **um curso por vez**.'
      )
      .setColor(0xF39C12)
      .setTimestamp(),

    new EmbedBuilder()
      .setTitle('🛩️ Curso Básico de Voo — CBV')
      .setDescription(
        '**Nível:** Iniciante | **Duração:** ~5 sessões\n' +
        '**Requisito:** Patente Recruta → **Promove para:** Cadete\n\n' +
        '• Controles básicos da aeronave no PTFS\n' +
        '• Decolagem, cruzeiro e pouso seguros\n' +
        '• Comunicação com ATC\n' +
        '• Regras de espaço aéreo\n' +
        '• Manobras de emergência básicas'
      )
      .setColor(0x2980B9),

    new EmbedBuilder()
      .setTitle('🎪 Curso de Shows Aéreos — CSA')
      .setDescription(
        '**Nível:** Intermediário | **Duração:** ~8 sessões\n' +
        '**Requisito:** Cadete + CBV concluído\n\n' +
        '• Manobras acrobáticas (looping, barrel roll, split-S)\n' +
        '• Voo em formação e sincronização\n' +
        '• Leitura de coreografias e briefings\n' +
        '• Comunicação durante o show\n' +
        '• Simulação completa de show aéreo'
      )
      .setColor(0x27AE60),

    new EmbedBuilder()
      .setTitle('⚔️ Curso de Combate Aéreo — CCA')
      .setDescription(
        '**Nível:** Avançado | **Duração:** ~10 sessões\n' +
        '**Requisito:** Sargento + CSA concluído\n\n' +
        '• Pilotagem de caças no PTFS\n' +
        '• Táticas BVR (Beyond Visual Range)\n' +
        '• Interceptação e escolta aérea\n' +
        '• Patrulha de espaço aéreo\n' +
        '• Missões coordenadas em equipe\n' +
        '• Debriefing e análise pós-missão'
      )
      .setColor(0xC0392B)
      .setFooter({ text: 'Para se inscrever → 📝┃inscrições' }),
  ];

  for (const embed of embeds) await channel.send({ embeds: [embed] });
}

async function postarManual(channel) {
  const embeds = [
    new EmbedBuilder()
      .setTitle('🛩️ Manual do Piloto — Formação Esquadrilha da Fumaça')
      .setDescription('Seu guia fundamental para se tornar um piloto de elite no PTFS.')
      .setColor(0x2980B9)
      .setTimestamp(),

    new EmbedBuilder()
      .setTitle('🕹️ Controles Básicos no PTFS')
      .setDescription(
        '**W / S** — Acelerar / Desacelerar\n' +
        '**A / D** — Guinada (yaw) esquerda/direita\n' +
        '**Q / E** — Rolagem (roll) esquerda/direita\n' +
        '**Mouse** — Pitch e direção do nariz\n' +
        '**F** — Trem de pouso\n' +
        '**G** — Flaps\n' +
        '**Shift** — Pós-combustão (afterburner)\n\n' +
        '> 💡 Treine com aeronaves lentas antes de passar para caças.'
      )
      .setColor(0xF39C12),

    new EmbedBuilder()
      .setTitle('🛫 Decolagem Correta')
      .setDescription(
        '**1.** Alinhe-se com a pista e libere os freios\n' +
        '**2.** Aplique potência gradualmente\n' +
        '**3.** Na velocidade de rotação, puxe suavemente o manche\n' +
        '**4.** Suba o trem de pouso ao atingir altitude positiva\n' +
        '**5.** Mantenha subida a ~15° de ângulo de ataque\n' +
        '**6.** Reduza potência ao atingir altitude de cruzeiro'
      )
      .setColor(0x27AE60),

    new EmbedBuilder()
      .setTitle('🛬 Pouso Seguro')
      .setDescription(
        '**1.** Reduza velocidade com antecedência\n' +
        '**2.** Desça o trem de pouso a distância segura\n' +
        '**3.** Aplique flaps para reduzir velocidade de estol\n' +
        '**4.** Mantenha descida suave (~3°)\n' +
        '**5.** Toque com as rodas traseiras primeiro\n' +
        '**6.** Aplique freios progressivamente'
      )
      .setColor(0x8E44AD),

    new EmbedBuilder()
      .setTitle('⚔️ Pilotagem de Caças')
      .setDescription(
        '**Energia é vida** — Mantenha altitude e velocidade\n' +
        '**Turning fight** — Use rolagem + puxada para virar fechado\n' +
        '**BnZ (Boom & Zoom)** — Mergulho em alta velocidade + subida\n' +
        '**Scissors** — Reduza para fazer o inimigo ultrapassar\n' +
        '**Extension** — Fuja em velocidade quando em desvantagem\n\n' +
        '*O piloto mais disciplinado sempre supera o mais agressivo.*'
      )
      .setColor(0xC0392B)
      .setFooter({ text: 'In caelo victoria — a vitória está nos céus' }),
  ];

  for (const embed of embeds) await channel.send({ embeds: [embed] });
}

async function postarGuiaShows(channel) {
  const embeds = [
    new EmbedBuilder()
      .setTitle('🎪 Guia de Shows Aéreos — Esquadrilha da Fumaça')
      .setDescription('Um show bem executado é a marca registrada da Esquadrilha.')
      .setColor(0x8E44AD)
      .setTimestamp(),

    new EmbedBuilder()
      .setTitle('📋 Fases de um Show Aéreo')
      .setDescription(
        '**1. Planejamento** (48h antes)\n' +
        '> Capitão define coreografia em 🗂️┃planejamento\n\n' +
        '**2. Seleção da tripulação**\n' +
        '> Confirmação de presença em 🗂️┃planejamento\n\n' +
        '**3. Ensaio**\n' +
        '> Reunião em 🎪 Coordenação de Show\n\n' +
        '**4. Execução**\n' +
        '> Show no PTFS seguindo o briefing\n\n' +
        '**5. Registro**\n' +
        '> Fotos e vídeos em 🖼️┃galeria'
      )
      .setColor(0xF39C12),

    new EmbedBuilder()
      .setTitle('✈️ Manobras Essenciais')
      .setDescription(
        '**Looping** — Laço vertical completo\n' +
        '**Barrel Roll** — Rolagem em espiral\n' +
        '**Split-S** — Inversão + mergulho\n' +
        '**Immelmann** — Meio looping + rolagem\n' +
        '**Voo Invertido** — Sustentação invertida\n' +
        '**Formação Delta** — 3+ aeronaves em triângulo\n' +
        '**Cruzamento** — Aeronaves em sentidos opostos\n' +
        '**Fumaça Colorida** — Ativação sincronizada'
      )
      .setColor(0x2980B9),

    new EmbedBuilder()
      .setTitle('⚠️ Regras de Segurança')
      .setDescription(
        '• Mantenha **distância mínima** entre as aeronaves\n' +
        '• Nunca interrompa uma manobra pela metade\n' +
        '• Em colisão acidental, avise imediatamente no chat de voz\n' +
        '• O **Piloto Líder** tem autoridade total durante o show\n' +
        '• Siga a altitude mínima do briefing'
      )
      .setColor(0xED4245)
      .setFooter({ text: 'Formação Esquadrilha da Fumaça • Glória no céu!' }),
  ];

  for (const embed of embeds) await channel.send({ embeds: [embed] });
}

// ─── Permissão ────────────────────────────────────────────────────────────────

const COMANDO_ROLES = [
  '👑 Diretor Supremo da Academia',
  '🎖️ Comandante da Base Aérea',
  '🧠 Oficial de Estratégia Aérea',
];

function temPermissao(member) {
  return member.roles.cache.some(r => COMANDO_ROLES.includes(r.name));
}

// ─── Mapa canal → função de conteúdo ─────────────────────────────────────────

const CONTEUDO_MAP = {
  '🏠┃sobre-a-esquadrilha': postarSobre,
  '📜┃regras':               postarRegras,
  '📚┃cursos-disponíveis':  postarCursos,
  '🛩️┃manual-do-piloto':    postarManual,
  '🎪┃guia-de-shows':        postarGuiaShows,
};

// ─── Comando principal ────────────────────────────────────────────────────────

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Monta o servidor da Formação Esquadrilha da Fumaça do zero')
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

    // Confirmação via botão
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('setup_confirm')
        .setLabel('✅ Confirmar Setup')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('setup_cancel')
        .setLabel('❌ Cancelar')
        .setStyle(ButtonStyle.Danger)
    );

    const confirmMsg = await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle('⚠️ Configurar Servidor do Zero')
          .setDescription(
            'O bot vai criar **todos os cargos, categorias e canais** da Esquadrilha da Fumaça.\n\n' +
            '> Canais e cargos **existentes não serão deletados** — apenas novos serão criados.\n\n' +
            'Deseja continuar?'
          )
          .setColor(0xF0A500),
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

    if (collected.customId === 'setup_cancel') {
      return collected.update({ content: '❌ Setup cancelado.', components: [], embeds: [] });
    }

    await collected.update({
      embeds: [
        new EmbedBuilder()
          .setTitle('⚙️ Configurando servidor...')
          .setDescription('Criando cargos, categorias e canais. Aguarde...')
          .setColor(0x5865F2),
      ],
      components: [],
    });

    const guild = interaction.guild;
    const everyone = guild.roles.everyone;
    const roleMap = {};

    // 1. Criar cargos
    for (const roleData of ROLES) {
      const existing = guild.roles.cache.find(r => r.name === roleData.name);
      if (existing) {
        roleMap[roleData.name] = existing.id;
        continue;
      }
      const permBits = roleData.permissions.reduce(
        (acc, p) => acc | (PERMISSION_MAP[p] ?? 0n), 0n
      );
      const role = await guild.roles.create({
        name: roleData.name,
        color: roleData.color,
        hoist: roleData.hoist,
        mentionable: roleData.mentionable,
        permissions: permBits,
        reason: 'Esquadrilha Bot — Setup',
      });
      roleMap[roleData.name] = role.id;
    }

    const adminRoleId = roleMap['🎖️ Comandante da Base Aérea'];
    const modRoleId   = roleMap['🔨 Moderador Militar'];

    // 2. Criar categorias e canais
    for (let i = 0; i < CATEGORIES.length; i++) {
      const catData = CATEGORIES[i];

      const catOverwrites = [];
      if (catData.staffOnly) {
        catOverwrites.push({ id: everyone.id, type: OverwriteType.Role, deny: [PermissionFlagsBits.ViewChannel] });
        if (adminRoleId) catOverwrites.push({ id: adminRoleId, type: OverwriteType.Role, allow: [PermissionFlagsBits.ViewChannel] });
        if (modRoleId)   catOverwrites.push({ id: modRoleId,   type: OverwriteType.Role, allow: [PermissionFlagsBits.ViewChannel] });
      }

      let category = guild.channels.cache.find(
        c => c.name === catData.name && c.type === ChannelType.GuildCategory
      );
      if (!category) {
        category = await guild.channels.create({
          name: catData.name,
          type: ChannelType.GuildCategory,
          position: i,
          permissionOverwrites: catOverwrites,
          reason: 'Esquadrilha Bot — Setup',
        });
      }

      for (const ch of catData.channels) {
        const alreadyExists = guild.channels.cache.find(
          c => c.parentId === category.id && c.name === ch.name.toLowerCase().replace(/[^\w\s\p{Emoji}┃]/gu, '-')
        );
        if (alreadyExists) continue;

        const chOverwrites = [];
        if (ch.readonly) {
          chOverwrites.push({
            id: everyone.id,
            type: OverwriteType.Role,
            deny: [PermissionFlagsBits.SendMessages],
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory],
          });
        }

        await guild.channels.create({
          name: ch.name,
          type: ch.type === 'voice' ? ChannelType.GuildVoice : ChannelType.GuildText,
          parent: category.id,
          topic: ch.topic,
          userLimit: ch.userLimit,
          permissionOverwrites: chOverwrites.length ? chOverwrites : undefined,
          reason: 'Esquadrilha Bot — Setup',
        });
      }
    }

    // 3. Postar conteúdo automático
    await guild.channels.fetch();
    for (const [chName, fn] of Object.entries(CONTEUDO_MAP)) {
      const ch = guild.channels.cache.find(
        c => c.type === ChannelType.GuildText && c.name === chName.toLowerCase().replace(/[^\w┃]/g, ch => ch)
      );
      if (!ch) continue;
      // Apaga mensagens antigas do bot antes de postar
      const old = await ch.messages.fetch({ limit: 10 });
      for (const [, m] of old) {
        if (m.author.id === guild.client.user.id) await m.delete().catch(() => {});
      }
      await fn(ch);
    }

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle('✅ Servidor Configurado!')
          .setDescription(
            'A **Formação Esquadrilha da Fumaça** está pronta para voar!\n\n' +
            '✈️ Cargos criados\n' +
            '📁 Categorias e canais criados\n' +
            '📝 Conteúdo gerado automaticamente\n\n' +
            '*Bom voo, Comandante!* 🫡'
          )
          .setColor(0x57F287)
          .setTimestamp()
          .setFooter({ text: 'Esquadrilha Bot' }),
      ],
    });
  },
};
