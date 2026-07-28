import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Linkedin AI POST
// Nodes   : 62  |  Connections: 99
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ScheduleSegQuaSex14hBrt            scheduleTrigger
// SheetsLerTodasAsLinhas             googleSheets               [onError→out(1)] [creds] [retry]
// CodeSelecionaLinhaRotacaoDePilar   code                       [onError→out(1)]
// IaGeraTextoDoPostPromptDeImagem    googleGemini               [onError→out(1)] [creds] [retry]
// CodeParseJsonDoLlm                 code                       [onError→out(1)]
// TelegramAprovacaoDoTexto           telegram                   [onError→out(1)] [creds]
// MergeRestauraCamposPosAprovacaoDoTexto merge
// CodeNormalizaDecisaoDoTexto        code                       [onError→out(1)]
// IfTextoReprovado                   if
// SheetsMarcarDescartado             googleSheets               [creds]
// HttpGeraImagemRecraft              httpRequest                [onError→out(1)] [creds]
// CodeExtraiUrlRecraft               code                       [onError→out(1)]
// HttpGeraImagemNanoBanana           httpRequest                [onError→out(1)] [creds]
// CodeExtraiUrlNanoBanana            code                       [onError→out(1)]
// MergeRestauraCamposPosGeracaoDupla merge
// TelegramEnviaImagem1               telegram                   [onError→out(1)] [creds]
// TelegramEnviaImagem2               telegram                   [onError→out(1)] [creds]
// TelegramAprovacaoImagem1           telegram                   [onError→out(1)] [creds]
// MergeRestauraPosAprovacaoImagem1   merge
// CodeDecideImagem1                  code                       [onError→out(1)]
// IfImagem1Aprovada                  if
// TelegramAprovacaoImagem2           telegram                   [onError→out(1)] [creds]
// MergeRestauraPosAprovacaoImagem2   merge
// CodeDecideImagem2                  code                       [onError→out(1)]
// IfImagem2Aprovada                  if
// TelegramEscalarPraUltra            telegram                   [onError→out(1)] [creds]
// MergeRestauraPosEscalarUltra       merge
// IfGerarUltra                       if
// HttpGeraImagemUltra                httpRequest                [onError→out(1)] [creds]
// MergeRestauraPosGeracaoUltra       merge
// CodeDefineImagemUltra              code                       [onError→out(1)]
// IfTemImagemFinal                   if
// HttpDownloadBinarioDaImagemFinal   httpRequest                [onError→out(1)]
// MergeRestauraCamposPosDownload     merge
// LinkedinPublicaPost                linkedIn                   [onError→out(1)] [creds]
// SheetsMarcarPublicado              googleSheets               [creds]
// TelegramNotificaErro               telegram                   [creds]
// IfENoticiaExpirada                 if
// ScheduleIngestaoSemanalDom20hBrt   scheduleTrigger
// RssTowardsDataScience              rssFeedRead                [onError→out(1)]
// RssTheHackerNews                   rssFeedRead                [onError→out(1)]
// CodeNormalizaTdsTop5               code
// CodeNormalizaHnTop5                code
// RssBlogN8n                         rssFeedRead                [onError→out(1)]
// RssPlanetPostgresql                rssFeedRead                [onError→out(1)]
// CodeNormalizaN8nTop5               code
// CodeNormalizaSqlTop5               code
// MergeFontesRss                     merge
// CodePreparaItensRadar              code
// SheetsRadarGravaBruto              googleSheets               [onError→out(1)] [creds]
// IaClassificaItemRadar              googleGemini               [onError→out(1)] [creds] [retry]
// CodeParseClassificacaoRadar        code                       [onError→out(1)]
// SheetsRadarAppendOrUpdate          googleSheets               [onError→out(1)] [creds]
// SheetsRadarLeProntos               googleSheets               [onError→out(1)] [creds]
// IaTraduzTituloPtBr                 googleGemini               [onError→out(1)] [creds] [retry]
// CodeMontaLinhaDoBacklog            code                       [onError→out(1)]
// SheetsBacklogGravaMigrados         googleSheets               [onError→out(1)] [creds]
// SheetsRadarMarcaMigrado            googleSheets               [onError→out(1)] [creds]
// StickyNote                         stickyNote
// StickyNote1                        stickyNote
// StickyNote2                        stickyNote
// StickyNote3                        stickyNote
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ScheduleSegQuaSex14hBrt
//    → SheetsLerTodasAsLinhas
//      → CodeSelecionaLinhaRotacaoDePilar
//        → IfENoticiaExpirada
//          → SheetsMarcarDescartado
//         .out(1) → IaGeraTextoDoPostPromptDeImagem
//            → CodeParseJsonDoLlm
//              → TelegramAprovacaoDoTexto
//                → MergeRestauraCamposPosAprovacaoDoTexto
//                  → CodeNormalizaDecisaoDoTexto
//                    → IfTextoReprovado
//                      → SheetsMarcarDescartado (↩ loop)
//                     .out(1) → HttpGeraImagemRecraft
//                        → CodeExtraiUrlRecraft
//                          → MergeRestauraCamposPosGeracaoDupla
//                            → TelegramEnviaImagem1
//                             .out(1) → TelegramNotificaErro
//                            → TelegramAprovacaoImagem1
//                              → MergeRestauraPosAprovacaoImagem1
//                                → CodeDecideImagem1
//                                  → IfImagem1Aprovada
//                                    → IfTemImagemFinal
//                                      → HttpDownloadBinarioDaImagemFinal
//                                        → MergeRestauraCamposPosDownload
//                                          → LinkedinPublicaPost
//                                            → SheetsMarcarPublicado
//                                           .out(1) → TelegramNotificaErro (↩ loop)
//                                       .out(1) → TelegramNotificaErro (↩ loop)
//                                      → MergeRestauraCamposPosDownload.in(1) (↩ loop)
//                                     .out(1) → LinkedinPublicaPost (↩ loop)
//                                   .out(1) → TelegramEnviaImagem2
//                                     .out(1) → TelegramNotificaErro (↩ loop)
//                                   .out(1) → TelegramAprovacaoImagem2
//                                      → MergeRestauraPosAprovacaoImagem2
//                                        → CodeDecideImagem2
//                                          → IfImagem2Aprovada
//                                            → IfTemImagemFinal (↩ loop)
//                                           .out(1) → TelegramEscalarPraUltra
//                                              → MergeRestauraPosEscalarUltra
//                                                → IfGerarUltra
//                                                  → HttpGeraImagemUltra
//                                                    → MergeRestauraPosGeracaoUltra
//                                                      → CodeDefineImagemUltra
//                                                        → IfTemImagemFinal (↩ loop)
//                                                   .out(1) → TelegramNotificaErro (↩ loop)
//                                                  → MergeRestauraPosGeracaoUltra.in(1) (↩ loop)
//                                                 .out(1) → IfTemImagemFinal (↩ loop)
//                                             .out(1) → TelegramNotificaErro (↩ loop)
//                                           .out(1) → MergeRestauraPosEscalarUltra.in(1) (↩ loop)
//                                     .out(1) → TelegramNotificaErro (↩ loop)
//                                   .out(1) → MergeRestauraPosAprovacaoImagem2.in(1) (↩ loop)
//                             .out(1) → TelegramNotificaErro (↩ loop)
//                            → MergeRestauraPosAprovacaoImagem1.in(1) (↩ loop)
//                       .out(1) → TelegramNotificaErro (↩ loop)
//                     .out(1) → HttpGeraImagemNanoBanana
//                        → CodeExtraiUrlNanoBanana
//                          → MergeRestauraCamposPosGeracaoDupla.in(1) (↩ loop)
//                       .out(1) → TelegramNotificaErro (↩ loop)
//                     .out(1) → MergeRestauraCamposPosGeracaoDupla.in(2) (↩ loop)
//                   .out(1) → TelegramNotificaErro (↩ loop)
//               .out(1) → TelegramNotificaErro (↩ loop)
//              → MergeRestauraCamposPosAprovacaoDoTexto.in(1) (↩ loop)
//             .out(1) → TelegramNotificaErro (↩ loop)
//           .out(1) → TelegramNotificaErro (↩ loop)
//       .out(1) → TelegramNotificaErro (↩ loop)
//     .out(1) → TelegramNotificaErro (↩ loop)
// ScheduleIngestaoSemanalDom20hBrt
//    → RssTowardsDataScience
//      → CodeNormalizaTdsTop5
//        → MergeFontesRss
//          → CodePreparaItensRadar
//            → SheetsRadarGravaBruto
//              → IaClassificaItemRadar
//                → CodeParseClassificacaoRadar
//                  → SheetsRadarAppendOrUpdate
//                   .out(1) → TelegramNotificaErro (↩ loop)
//                 .out(1) → TelegramNotificaErro (↩ loop)
//               .out(1) → TelegramNotificaErro (↩ loop)
//             .out(1) → TelegramNotificaErro (↩ loop)
//     .out(1) → TelegramNotificaErro (↩ loop)
//    → RssTheHackerNews
//      → CodeNormalizaHnTop5
//        → MergeFontesRss.in(1) (↩ loop)
//     .out(1) → TelegramNotificaErro (↩ loop)
//    → RssBlogN8n
//      → CodeNormalizaN8nTop5
//        → MergeFontesRss.in(2) (↩ loop)
//     .out(1) → TelegramNotificaErro (↩ loop)
//    → RssPlanetPostgresql
//      → CodeNormalizaSqlTop5
//        → MergeFontesRss.in(3) (↩ loop)
//     .out(1) → TelegramNotificaErro (↩ loop)
// SheetsRadarLeProntos
//    → IaTraduzTituloPtBr
//      → CodeMontaLinhaDoBacklog
//        → SheetsBacklogGravaMigrados
//         .out(1) → TelegramNotificaErro (↩ loop)
//        → SheetsRadarMarcaMigrado
//         .out(1) → TelegramNotificaErro (↩ loop)
//       .out(1) → TelegramNotificaErro (↩ loop)
//     .out(1) → TelegramNotificaErro (↩ loop)
//   .out(1) → TelegramNotificaErro (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: '8EYY7V6kX14kC2sJ',
    name: 'Linkedin AI POST',
    active: false,
    isArchived: false,
    settings: { saveExecutionProgress: true, executionOrder: 'v1', availableInMCP: true, binaryMode: 'separate' },
})
export class LinkedinAiPostWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'b1a00001-0001-4001-8001-000000000001',
        name: 'Schedule — Seg/Qua/Sex 14h BRT',
        type: 'n8n-nodes-base.scheduleTrigger',
        version: 1.1,
        position: [96, 304],
    })
    ScheduleSegQuaSex14hBrt = {
        rule: {
            interval: [
                {
                    field: 'cronExpression',
                    expression: '0 14 * * 1,3,5',
                },
            ],
        },
    };

    @node({
        id: 'b1a00002-0002-4002-8002-000000000002',
        name: 'Sheets — Ler Todas as Linhas',
        type: 'n8n-nodes-base.googleSheets',
        version: 4.5,
        position: [320, 288],
        credentials: { googleSheetsOAuth2Api: { id: 'F1erZv6I4wGpkjvb', name: 'Google Sheets account' } },
        onError: 'continueErrorOutput',
        retryOnFail: true,
        waitBetweenTries: 5000,
    })
    SheetsLerTodasAsLinhas = {
        documentId: {
            __rl: true,
            value: '={{ $env.LINKEDIN_SHEET_ID }}',
            mode: 'id',
        },
        sheetName: {
            __rl: true,
            value: 'gid=0',
            mode: 'list',
            cachedResultName: 'Backlog LinkedIn',
            cachedResultUrl: 'https://docs.google.com/spreadsheets/d/SEU_SHEET_ID_AQUI/edit#gid=0',
        },
        options: {},
    };

    @node({
        id: 'b1a00003-0003-4003-8003-000000000003',
        name: 'Code — Seleciona Linha (Rotação de Pilar)',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [496, 112],
        onError: 'continueErrorOutput',
    })
    CodeSelecionaLinhaRotacaoDePilar = {
        jsCode: `// ============================================================
// LÓGICA DE ROTAÇÃO DE PILARES + VALIDADE DE NOTÍCIA (7 DIAS)
// 1. Descobre qual foi o último pilar publicado
// 2. Filtra linhas com status='pronto'
// 3. Separa candidatas com tipo='noticia' vencidas (mais de 7 dias
//    entre data_fonte e hoje) das candidatas ainda válidas —
//    conteúdo tipo='informativo' nunca expira
// 4. Entre as válidas, evita repetir o último pilar publicado
// 5. Desempata as elegíveis pelo maior score_relevancia (dado pela IA
//    de classificação do Radar)
// 6. Retorna a linha selecionada (_tipo_saida='selecionada') e as
//    vencidas (_tipo_saida='expirada', pra serem marcadas como
//    descartado logo em seguida pelo node IF)
// ============================================================

const rows = $input.all().map(item => item.json);
const PRAZO_NOTICIA_DIAS = 7;
const agora = new Date();

// Encontra o último pilar publicado (mais recente por data_publicacao)
const publicados = rows
  .filter(r => r.status === 'publicado' && r.data_publicacao)
  .sort((a, b) => new Date(b.data_publicacao) - new Date(a.data_publicacao));

const ultimoPilar = publicados.length > 0 ? publicados[0].pilar : null;

// Filtra candidatos com status='pronto'
// _rowIndex: +2 porque a linha 1 é o cabeçalho
// _inputItemIndex: índice original em $input.all(), usado só pra reconstruir o
// pairedItem abaixo — sem isso o node quebra o item linking (múltiplos itens
// de entrada virando um subconjunto de saída), o que faz o Telegram — Aprovação
// do Texto estourar "pairedItemNoConnection" ao resolver $json mais adiante.
const prontos = rows
  .map((r, idx) => ({ ...r, _rowIndex: idx + 2, _inputItemIndex: idx }))
  .filter(r => r.status === 'pronto');

if (prontos.length === 0) {
  throw new Error('Nenhuma linha com status=pronto encontrada na planilha Backlog LinkedIn.');
}

function estaExpirada(row) {
  if (row.tipo !== 'noticia') return false; // informativo não expira
  if (!row.data_fonte) return false; // sem data de origem, não descarta por precaução
  const dataFonte = new Date(row.data_fonte);
  if (isNaN(dataFonte.getTime())) return false;
  const diasPassados = (agora - dataFonte) / (1000 * 60 * 60 * 24);
  return diasPassados > PRAZO_NOTICIA_DIAS;
}

const expiradas = prontos.filter(estaExpirada).map(r => ({ ...r, _tipo_saida: 'expirada' }));
const candidatosValidos = prontos.filter(r => !estaExpirada(r));

// Reconstrói o pairedItem a partir de _inputItemIndex e remove o campo
// auxiliar do json final (mantém _rowIndex, que é usado no update da planilha).
function toItem(r) {
  const { _inputItemIndex, ...json } = r;
  return { json, pairedItem: { item: _inputItemIndex } };
}

if (candidatosValidos.length === 0) {
  // Só sobrou notícia vencida — nada elegível pra publicar neste ciclo.
  // Ainda assim devolve as vencidas pra serem marcadas como descartado.
  return expiradas.map(toItem);
}

// Evita repetir o último pilar; fallback: usa todas as válidas se não houver outra opção
let candidatos = candidatosValidos.filter(r => r.pilar !== ultimoPilar);
if (candidatos.length === 0) candidatos = candidatosValidos;

// Desempate por score_relevancia (definido pela IA — Classifica Item Radar):
// entre as candidatas elegíveis pra este ciclo, prioriza a de maior score.
function scoreDe(row) {
  const n = parseFloat(row.score_relevancia);
  return isNaN(n) ? 0 : n;
}
candidatos = [...candidatos].sort((a, b) => scoreDe(b) - scoreDe(a));

const selecionada = { ...candidatos[0], _tipo_saida: 'selecionada' };

return [selecionada, ...expiradas].map(toItem);`,
    };

    @node({
        id: 'b1a00004-0004-4004-8004-000000000004',
        name: 'IA — Gera Texto do Post + Prompt de Imagem',
        type: '@n8n/n8n-nodes-langchain.googleGemini',
        version: 1,
        position: [592, 400],
        credentials: { googlePalmApi: { id: 'xLU03UjXUyC6LxM1', name: 'Google Gemini(PaLM) Api account' } },
        onError: 'continueErrorOutput',
        retryOnFail: true,
        maxTries: 3,
        waitBetweenTries: 5000,
    })
    IaGeraTextoDoPostPromptDeImagem = {
        modelId: {
            __rl: true,
            value: 'models/gemini-3.5-flash',
            mode: 'list',
            cachedResultName: 'models/gemini-3.5-flash',
        },
        messages: {
            values: [
                {
                    content: `=Você escreve os posts de LinkedIn da sua própria conta pessoal, sobre dados, IA, SQL, n8n e tecnologia. Você TEM opinião própria sobre o assunto — você não é um resumidor neutro de notícia nem um serviço de press release. Escreva sempre na primeira pessoa, como alguém que já pôs a mão na massa nesse tema e quer compartilhar um ponto de vista, não uma cobertura editorial do artigo.

Informações da pauta:
- Título: {{ $json.titulo }}
- Pilar de conteúdo: {{ $json.pilar }}
- Link da fonte: {{ $json.link_fonte }}
- Contexto / O que abordar: {{ $json.contexto }}

## Estrutura obrigatória do post (nessa ordem, sem título/seções visíveis — é um post corrido)
1. Gancho de 1 linha: uma pergunta direta ou afirmação provocativa. Sem saudação, sem introdução, sem "hoje eu quero falar sobre X".
2. 2 a 3 frases com um ponto de vista SEU, específico, sobre o assunto — nunca uma descrição neutra do que o artigo diz.
3. 1 detalhe técnico concreto tirado do artigo/contexto fornecido (um número, um nome de ferramenta/comando, um comportamento específico) — nunca um detalhe genérico que serviria pra qualquer post do mesmo tema.
4. Um convite claro pro público comentar ou discordar — uma pergunta real que gera debate, nunca um "compartilhe suas experiências nos comentários!" motivacional.
5. NUNCA inclua o link da fonte no texto do post — ele é mostrado separadamente na tela de aprovação e não deve aparecer no LinkedIn.
6. No máximo 3 hashtags, específicos ao assunto tratado (nunca hashtags genéricos e sozinhos como #IA ou #Tecnologia — prefira algo mais específico, ex: #EngenhariaDeDados, #PerformanceDeQuery).

## Proibido (AI slop)
Nunca use estas expressões ou equivalentes: "é crucial", "está aquém do esperado", "no cenário atual", "revolucionário", "importante ressaltar", "vale destacar", "cada vez mais", e fechamentos motivacionais genéricos como "priorize isso", "não fique para trás", "fica a dica". Se uma frase poderia estar em qualquer post genérico de LinkedIn sobre tech, reescreva.

## Emojis
No máximo 2 a 3 emojis em todo o post — só para pontuar o gancho ou separar seções. Nunca um emoji por frase.

## Tamanho
150 a 280 palavras.

## Exemplos do meu tom — IMITE isso acima de qualquer regra genérica acima (few-shot)

[Exemplo — pilar SQL]
Todo mundo otimiza query lenta olhando o EXPLAIN. Poucos olham o schema primeiro.
Passei a tarde revisando uma query que "precisava de índice" — e o problema real era um JOIN redundante que trazia 4x mais linhas do que precisava antes mesmo de filtrar. Índice ia mascarar o sintoma, não resolver a causa.
O detalhe que me chamou atenção: adicionar EXISTS no lugar do JOIN cortou o tempo de execução de 8s pra 400ms, sem tocar em nenhum índice.
Isso muda como vocês debugam performance de query, ou o primeiro instinto ainda é "bota um índice nisso"? 👇
#SQL #PerformanceDeQuery

[Exemplo — pilar IA / Agentes de código]
A interface do seu agente de IA importa mais do que o modelo por trás dele.
Testei o mesmo agente em três formatos essa semana: terminal puro, integração no IDE e um painel customizado. O resultado técnico foi idêntico nos três — o que mudou foi quanto tempo eu perdia repetindo contexto que o agente já deveria saber.
O ponto que mais pesou: latência na troca de mensagens importa menos que a clareza do ciclo de feedback. Um agente rápido que exige três correções vale menos que um mais lento que acerta de primeira.
Vocês trocariam velocidade de resposta por menos ciclos de correção, ou é o contrário no seu fluxo? 🤔
#EngenhariaDePrompt #DevTools

[Exemplo — pilar n8n / Automação]
"Automatizar tudo" é a forma mais rápida de criar um sistema que ninguém entende daqui 6 meses.
Reconstruí um workflow essa semana que tinha 4 sub-workflows chamando uns aos outros pra fazer o que um único fluxo linear resolveria. Fazia sentido na cabeça de quem construiu — pra qualquer outra pessoa, era arqueologia.
O critério que uso agora antes de quebrar em sub-workflow: só vale a pena se a mesma lógica se repete em pelo menos 3 fluxos diferentes. Fora isso, linear e legível ganha de "elegante".
Vocês têm alguma automação que ficou complexa demais pro problema que resolve? Meio que quero saber que não sou só eu. 😅
#n8n #Automação

## Prompt de imagem (prompt_imagem)
Gere um prompt em inglês para um infográfico técnico — NÃO uma ilustração abstrata genérica. O infográfico deve ter: um título em texto (curto, extraído do gancho do post), 2 a 4 elementos/ícones NOMEADOS especificamente das ferramentas/tecnologias reais citadas no post (ex.: se o post fala de n8n e Slack, o prompt deve pedir um ícone de workflow estilo n8n E um ícone de chat estilo Slack, não "tech icons" genérico), conectados por um fluxo/setas simples. Fundo escuro, estilo flat vector corporativo, alto contraste, sem fotorrealismo.

Os 3 exemplos abaixo são só referência de FORMATAÇÃO e nível de especificidade — nunca copie o conteúdo deles, gere sempre a partir do post atual:

[Exemplo — post sobre n8n + Slack]
"Professional tech infographic, dark navy background. Bold white title at top: 'Chega de alertas perdidos no Slack'. Below, a clean flow diagram with 3 labeled steps left to right: an n8n logo-style workflow icon (orange, geometric nodes connected by lines) → a funnel icon labeled 'Filtro por Severidade' → a Slack logo-style chat bubble icon (rounded, colorful) receiving a check-mark notification. Flat vector corporate style, thin white connecting arrows between steps, minimal icons, high contrast, no photorealism, editorial infographic look."

[Exemplo — post sobre RAG/pgvector]
"Professional tech infographic, dark navy background. Bold white title at top: 'RAG não é só jogar tudo no vetor'. Below, a clean left-to-right flow with 3 labeled steps: a document stack icon labeled 'Documentos' → a purple database cylinder icon with small glowing dots labeled 'pgvector (embeddings)' → a chat bubble icon labeled 'Resposta com Contexto'. Flat vector corporate style, thin white arrows connecting the steps, minimal icons, high contrast, no photorealism, clean editorial infographic look."

[Exemplo — post sobre SQL/otimização de query]
"Professional tech infographic, dark navy background. Bold white title at top: 'O índice não é sempre a resposta'. Below, a query execution tree diagram: one branch tangled and crossed out in red labeled 'JOIN redundante', another branch clean and glowing green labeled 'EXISTS'. Flat vector corporate style, minimal geometric icons, high contrast, no photorealism, editorial infographic look."

## Formato de resposta
Responda EXCLUSIVAMENTE em JSON válido, sem markdown, sem explicações:
{
  "texto_post": "<texto completo do post, seguindo a estrutura e o tom acima>",
  "prompt_imagem": "<prompt de infográfico em inglês, seguindo as instruções e exemplos acima>"
}`,
                },
            ],
        },
        builtInTools: {
            googleSearch: false,
            urlContext: false,
            codeExecution: false,
        },
        options: {},
    };

    @node({
        id: 'b1a00005-0005-4005-8005-000000000005',
        name: 'Code — Parse JSON do LLM',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [912, 400],
        onError: 'continueErrorOutput',
    })
    CodeParseJsonDoLlm = {
        jsCode: `// Faz parse do JSON retornado pelo LLM (vem como string)
// O node Google Gemini retorna o texto em candidate.content.parts[].text
// (com "Simplify Output" ligado, o item já É o candidate; senão vem em .candidates[0])
const geminiOutput = $input.first().json;
const candidate = geminiOutput.content ? geminiOutput : (geminiOutput.candidates && geminiOutput.candidates[0]);
const parts = (candidate && candidate.content && candidate.content.parts) || [];
const raw = parts.map(p => p.text || '').join('') || geminiOutput.text || '';

let parsed;
try {
  // Remove blocos markdown caso o LLM os inclua por engano
  const clean = raw
    .replace(/\`\`\`json\\n?/g, '')
    .replace(/\`\`\`\\n?/g, '')
    .trim();
  parsed = JSON.parse(clean);
} catch(e) {
  throw new Error('LLM não retornou JSON válido. Resposta bruta: ' + raw.substring(0, 300));
}

// Preserva todos os campos originais da planilha
const sheetData = $('Code — Seleciona Linha (Rotação de Pilar)').first().json;

return [{
  json: {
    ...sheetData,
    texto_post: parsed.texto_post,
    prompt_imagem: parsed.prompt_imagem,
  }
}];`,
    };

    @node({
        id: 'b1a00006-0006-4006-8006-000000000006',
        webhookId: '5b87795d-3e0e-4cd3-b0e7-b48e7696a571',
        name: 'Telegram — Aprovação do Texto',
        type: 'n8n-nodes-base.telegram',
        version: 1.2,
        position: [992, 560],
        credentials: { telegramApi: { id: 'nA4a3QYYHD29nWe0', name: 'Telegram account' } },
        onError: 'continueErrorOutput',
    })
    TelegramAprovacaoDoTexto = {
        operation: 'sendAndWait',
        chatId: '={{ $env.TELEGRAM_CHAT_ID }}',
        message: `=📝 *Novo post pra revisar!*
🏷️ Pilar: *{{ $json.pilar }}* · 🔗 Fonte: {{ $json.link_fonte }}

{{ $json.texto_post }}

👇 Aprova ou reprova.`,
        responseType: 'approval',
        approvalOptions: {
            values: {
                approvalType: 'double',
                approveLabel: '✅ Aprovar',
                disapproveLabel: '❌ Reprovar',
            },
        },
        options: {},
    };

    @node({
        id: 'd4a00039-0039-4039-8039-000000000039',
        name: 'Merge — Restaura Campos Pós Aprovação do Texto',
        type: 'n8n-nodes-base.merge',
        version: 3.2,
        position: [1080, 560],
    })
    MergeRestauraCamposPosAprovacaoDoTexto = {
        mode: 'combine',
        combineBy: 'combineByPosition',
        numberInputs: 2,
        options: {},
    };

    @node({
        id: 'd4a00037-0037-4037-8037-000000000037',
        name: 'Code — Normaliza Decisão do Texto',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1152, 560],
        onError: 'continueErrorOutput',
    })
    CodeNormalizaDecisaoDoTexto = {
        jsCode: `// Lê a resposta do node "Send and Wait" no modo Approval (2 botões
// nativos do Telegram: Aprovar/Reprovar). Esse modo resolve de forma
// confiável com um booleano 'approved' — diferente do modo Custom Form
// usado antes, que em execução real (2026-07-27) resolvia com dados vazios
// ao simples abrir o link "Respond" no Telegram, sem esperar o usuário de
// fato escolher uma opção (qualquer clique virava aprovação por engano).
// ⚠️ CONFIRMADO em execução real (2026-07-27): o modo Approval devolve só
// { data: { approved, respondedAt } } — nem 'approved' fica no nível raiz
// do item, nem os campos originais (pilar, texto_post etc.) sobrevivem.
// Por isso um Merge (combineByPosition) logo antes deste node recompõe os
// campos originais, igual já era feito depois do fal.ai e do download da
// imagem. 'approved' pode vir tanto em .data.approved quanto solto —
// checamos os dois por segurança.
const dados = $input.first().json;
const approved = dados.data?.approved ?? dados.approved;
const decisao = approved === false ? 'reprovar' : 'aprovar';

return [{
  json: {
    ...dados,
    decisao,
    texto_final: dados.texto_post,
  }
}];`,
    };

    @node({
        id: 'd4a00038-0038-4038-8038-000000000038',
        name: 'IF — Texto Reprovado',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [1360, 560],
    })
    IfTextoReprovado = {
        conditions: {
            combinator: 'and',
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 3,
            },
            conditions: [
                {
                    leftValue: '={{ $json.decisao }}',
                    rightValue: 'reprovar',
                    operator: {
                        type: 'string',
                        operation: 'equals',
                    },
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'b1a00007-0007-4007-8007-000000000007',
        name: 'Sheets — Marcar Descartado',
        type: 'n8n-nodes-base.googleSheets',
        version: 4.5,
        position: [1760, 496],
        credentials: { googleSheetsOAuth2Api: { id: 'F1erZv6I4wGpkjvb', name: 'Google Sheets account' } },
    })
    SheetsMarcarDescartado = {
        operation: 'update',
        documentId: {
            __rl: true,
            value: '={{ $env.LINKEDIN_SHEET_ID }}',
            mode: 'id',
        },
        sheetName: {
            __rl: true,
            value: 'Backlog LinkedIn',
            mode: 'name',
        },
        columns: {
            mappingMode: 'defineBelow',
            value: {
                status: 'descartado',
                row_number: '={{ $json._rowIndex }}',
            },
            matchingColumns: ['row_number'],
            schema: [
                {
                    id: 'titulo',
                    displayName: 'titulo',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'link_fonte',
                    displayName: 'link_fonte',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'pilar',
                    displayName: 'pilar',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'status',
                    displayName: 'status',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
                {
                    id: 'contexto',
                    displayName: 'contexto',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'data_publicacao',
                    displayName: 'data_publicacao',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'texto_final',
                    displayName: 'texto_final',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'imagem_usada',
                    displayName: 'imagem_usada',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'tipo (informativo | noticia)',
                    displayName: 'tipo (informativo | noticia)',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'data_fonte',
                    displayName: 'data_fonte',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'row_number',
                    displayName: 'row_number',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'number',
                    canBeUsedToMatch: true,
                    readOnly: true,
                    removed: false,
                },
            ],
            attemptToConvertTypes: false,
            convertFieldsToString: false,
        },
        options: {},
    };

    @node({
        id: 'e5a00001-0001-4001-8001-000000000001',
        name: 'HTTP — Gera Imagem Recraft',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.2,
        position: [1280, 80],
        credentials: { httpHeaderAuth: { id: 'D5xBZ20MrinPb3UX', name: 'Header Auth account' } },
        onError: 'continueErrorOutput',
    })
    HttpGeraImagemRecraft = {
        method: 'POST',
        url: 'https://fal.run/fal-ai/recraft/v4/text-to-image',
        authentication: 'genericCredentialType',
        genericAuthType: 'httpHeaderAuth',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'Content-Type',
                    value: 'application/json',
                },
            ],
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody: '={{ JSON.stringify({ "prompt": $json.prompt_imagem }) }}',
        options: {},
    };

    @node({
        id: 'e5a00002-0002-4002-8002-000000000002',
        name: 'Code — Extrai URL Recraft',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1440, 80],
        onError: 'continueErrorOutput',
    })
    CodeExtraiUrlRecraft = {
        jsCode: 'return [{ json: { imagem1_url: $json.images[0].url } }];',
    };

    @node({
        id: 'e5a00003-0003-4003-8003-000000000003',
        name: 'HTTP — Gera Imagem Nano Banana',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.2,
        position: [1280, 240],
        credentials: { httpHeaderAuth: { id: 'D5xBZ20MrinPb3UX', name: 'Header Auth account' } },
        onError: 'continueErrorOutput',
    })
    HttpGeraImagemNanoBanana = {
        method: 'POST',
        url: 'https://fal.run/fal-ai/nano-banana-2',
        authentication: 'genericCredentialType',
        genericAuthType: 'httpHeaderAuth',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'Content-Type',
                    value: 'application/json',
                },
            ],
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody: '={{ JSON.stringify({ "prompt": $json.prompt_imagem }) }}',
        options: {},
    };

    @node({
        id: 'e5a00004-0004-4004-8004-000000000004',
        name: 'Code — Extrai URL Nano Banana',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1440, 240],
        onError: 'continueErrorOutput',
    })
    CodeExtraiUrlNanoBanana = {
        jsCode: 'return [{ json: { imagem2_url: $json.images[0].url } }];',
    };

    @node({
        id: 'e5a00005-0005-4005-8005-000000000005',
        name: 'Merge — Restaura Campos Pós Geração Dupla',
        type: 'n8n-nodes-base.merge',
        version: 3.2,
        position: [1600, 160],
    })
    MergeRestauraCamposPosGeracaoDupla = {
        mode: 'combine',
        combineBy: 'combineByPosition',
        numberInputs: 3,
        options: {},
    };

    @node({
        id: 'e5a00006-0006-4006-8006-000000000006',
        webhookId: 'e7688288-fe6a-431a-8cd3-292bb672888c',
        name: 'Telegram — Envia Imagem 1',
        type: 'n8n-nodes-base.telegram',
        version: 1.2,
        position: [1760, 80],
        credentials: { telegramApi: { id: 'nA4a3QYYHD29nWe0', name: 'Telegram account' } },
        onError: 'continueErrorOutput',
    })
    TelegramEnviaImagem1 = {
        operation: 'sendPhoto',
        chatId: '={{ $env.TELEGRAM_CHAT_ID }}',
        binaryData: false,
        file: '={{ $json.imagem1_url }}',
        additionalFields: {
            caption: '=Opção 1 — Recraft V4',
        },
    };

    @node({
        id: 'e5a00007-0007-4007-8007-000000000007',
        webhookId: 'e974177e-be6d-4041-9327-2e2387fa322c',
        name: 'Telegram — Envia Imagem 2',
        type: 'n8n-nodes-base.telegram',
        version: 1.2,
        position: [1760, 240],
        credentials: { telegramApi: { id: 'nA4a3QYYHD29nWe0', name: 'Telegram account' } },
        onError: 'continueErrorOutput',
    })
    TelegramEnviaImagem2 = {
        operation: 'sendPhoto',
        chatId: '={{ $env.TELEGRAM_CHAT_ID }}',
        binaryData: false,
        file: '={{ $json.imagem2_url }}',
        additionalFields: {
            caption: '=Opção 2 — Nano Banana',
        },
    };

    @node({
        id: 'e5a00008-0008-4008-8008-000000000008',
        webhookId: 'e5a00008-0008-4008-8008-000000000008',
        name: 'Telegram — Aprovação Imagem 1',
        type: 'n8n-nodes-base.telegram',
        version: 1.2,
        position: [1760, 400],
        credentials: { telegramApi: { id: 'nA4a3QYYHD29nWe0', name: 'Telegram account' } },
        onError: 'continueErrorOutput',
    })
    TelegramAprovacaoImagem1 = {
        operation: 'sendAndWait',
        chatId: '={{ $env.TELEGRAM_CHAT_ID }}',
        message: `=🖼️ Imagem enviada acima ⬆️ (Opção 1 — Recraft V4)

👇 Aprova?`,
        responseType: 'approval',
        approvalOptions: {
            values: {
                approvalType: 'double',
                approveLabel: '✅ Aprovar',
                disapproveLabel: '👉 Ver Próxima Opção',
            },
        },
        options: {},
    };

    @node({
        id: 'e5a00009-0009-4009-8009-000000000009',
        name: 'Merge — Restaura Pós Aprovação Imagem 1',
        type: 'n8n-nodes-base.merge',
        version: 3.2,
        position: [1920, 400],
    })
    MergeRestauraPosAprovacaoImagem1 = {
        mode: 'combine',
        combineBy: 'combineByPosition',
        options: {},
    };

    @node({
        id: 'e5a00010-0010-4010-8010-000000000010',
        name: 'Code — Decide Imagem 1',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [2080, 400],
        onError: 'continueErrorOutput',
    })
    CodeDecideImagem1 = {
        jsCode: `const dados = $input.first().json;
const aprovada = (dados.data?.approved ?? dados.approved) === true;
return [{
  json: {
    ...dados,
    imagem1_aprovada: aprovada,
    ...(aprovada ? { imagem_final_url: dados.imagem1_url, imagem_escolhida: 'Recraft V4' } : {}),
  }
}];`,
    };

    @node({
        id: 'e5a00011-0011-4011-8011-000000000011',
        name: 'IF — Imagem 1 Aprovada',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [2240, 400],
    })
    IfImagem1Aprovada = {
        conditions: {
            combinator: 'and',
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 3,
            },
            conditions: [
                {
                    leftValue: '={{ $json.imagem1_aprovada }}',
                    rightValue: true,
                    operator: {
                        type: 'boolean',
                        operation: 'equals',
                    },
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'e5a00012-0012-4012-8012-000000000012',
        webhookId: 'e5a00012-0012-4012-8012-000000000012',
        name: 'Telegram — Aprovação Imagem 2',
        type: 'n8n-nodes-base.telegram',
        version: 1.2,
        position: [2240, 560],
        credentials: { telegramApi: { id: 'nA4a3QYYHD29nWe0', name: 'Telegram account' } },
        onError: 'continueErrorOutput',
    })
    TelegramAprovacaoImagem2 = {
        operation: 'sendAndWait',
        chatId: '={{ $env.TELEGRAM_CHAT_ID }}',
        message: `=🖼️ Imagem enviada acima ⬆️ (Opção 2 — Nano Banana)

👇 Aprova?`,
        responseType: 'approval',
        approvalOptions: {
            values: {
                approvalType: 'double',
                approveLabel: '✅ Aprovar',
                disapproveLabel: '👉 Ver Próxima Opção',
            },
        },
        options: {},
    };

    @node({
        id: 'e5a00013-0013-4013-8013-000000000013',
        name: 'Merge — Restaura Pós Aprovação Imagem 2',
        type: 'n8n-nodes-base.merge',
        version: 3.2,
        position: [2400, 560],
    })
    MergeRestauraPosAprovacaoImagem2 = {
        mode: 'combine',
        combineBy: 'combineByPosition',
        options: {},
    };

    @node({
        id: 'e5a00014-0014-4014-8014-000000000014',
        name: 'Code — Decide Imagem 2',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [2560, 560],
        onError: 'continueErrorOutput',
    })
    CodeDecideImagem2 = {
        jsCode: `const dados = $input.first().json;
const aprovada = (dados.data?.approved ?? dados.approved) === true;
return [{
  json: {
    ...dados,
    imagem2_aprovada: aprovada,
    ...(aprovada ? { imagem_final_url: dados.imagem2_url, imagem_escolhida: 'Nano Banana' } : {}),
  }
}];`,
    };

    @node({
        id: 'e5a00015-0015-4015-8015-000000000015',
        name: 'IF — Imagem 2 Aprovada',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [2720, 560],
    })
    IfImagem2Aprovada = {
        conditions: {
            combinator: 'and',
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 3,
            },
            conditions: [
                {
                    leftValue: '={{ $json.imagem2_aprovada }}',
                    rightValue: true,
                    operator: {
                        type: 'boolean',
                        operation: 'equals',
                    },
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'e5a00016-0016-4016-8016-000000000016',
        webhookId: 'e5a00016-0016-4016-8016-000000000016',
        name: 'Telegram — Escalar Pra Ultra',
        type: 'n8n-nodes-base.telegram',
        version: 1.2,
        position: [2720, 720],
        credentials: { telegramApi: { id: 'nA4a3QYYHD29nWe0', name: 'Telegram account' } },
        onError: 'continueErrorOutput',
    })
    TelegramEscalarPraUltra = {
        operation: 'sendAndWait',
        chatId: '={{ $env.TELEGRAM_CHAT_ID }}',
        message:
            '=Nenhuma das duas agradou. Gerar a versão Ultra (GPT Image — mais cara e mais lenta, mas melhor qualidade) ou publicar sem imagem?',
        responseType: 'approval',
        approvalOptions: {
            values: {
                approvalType: 'double',
                approveLabel: '🎨 Gerar Ultra',
                disapproveLabel: '🚫 Sem imagem',
            },
        },
        options: {},
    };

    @node({
        id: 'e5a00017-0017-4017-8017-000000000017',
        name: 'Merge — Restaura Pós Escalar Ultra',
        type: 'n8n-nodes-base.merge',
        version: 3.2,
        position: [2880, 720],
    })
    MergeRestauraPosEscalarUltra = {
        mode: 'combine',
        combineBy: 'combineByPosition',
        options: {},
    };

    @node({
        id: 'e5a00018-0018-4018-8018-000000000018',
        name: 'IF — Gerar Ultra',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [3040, 720],
    })
    IfGerarUltra = {
        conditions: {
            combinator: 'and',
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 3,
            },
            conditions: [
                {
                    leftValue: '={{ $json.data?.approved ?? $json.approved }}',
                    rightValue: true,
                    operator: {
                        type: 'boolean',
                        operation: 'equals',
                    },
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'e5a00019-0019-4019-8019-000000000019',
        name: 'HTTP — Gera Imagem Ultra',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.2,
        position: [3200, 640],
        credentials: { httpHeaderAuth: { id: 'D5xBZ20MrinPb3UX', name: 'Header Auth account' } },
        onError: 'continueErrorOutput',
    })
    HttpGeraImagemUltra = {
        method: 'POST',
        url: 'https://fal.run/openai/gpt-image-2',
        authentication: 'genericCredentialType',
        genericAuthType: 'httpHeaderAuth',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'Content-Type',
                    value: 'application/json',
                },
            ],
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody: '={{ JSON.stringify({ "prompt": $json.prompt_imagem }) }}',
        options: {},
    };

    @node({
        id: 'e5a00024-0024-4024-8024-000000000024',
        name: 'Merge — Restaura Pós Geração Ultra',
        type: 'n8n-nodes-base.merge',
        version: 3.2,
        position: [3360, 640],
    })
    MergeRestauraPosGeracaoUltra = {
        mode: 'combine',
        combineBy: 'combineByPosition',
        options: {},
    };

    @node({
        id: 'e5a00020-0020-4020-8020-000000000020',
        name: 'Code — Define Imagem Ultra',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [3520, 640],
        onError: 'continueErrorOutput',
    })
    CodeDefineImagemUltra = {
        jsCode: `const dados = $input.first().json;
return [{
  json: {
    ...dados,
    imagem_final_url: dados.images[0].url,
    imagem_escolhida: 'GPT Image Ultra',
  }
}];`,
    };

    @node({
        id: 'e5a00021-0021-4021-8021-000000000021',
        name: 'IF — Tem Imagem Final',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [3200, 880],
    })
    IfTemImagemFinal = {
        conditions: {
            combinator: 'and',
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 3,
            },
            conditions: [
                {
                    leftValue: '={{ $json.imagem_final_url }}',
                    rightValue: '',
                    operator: {
                        type: 'string',
                        operation: 'notEmpty',
                        singleValue: true,
                    },
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'b1a00010-0010-4010-8010-000000000010',
        name: 'HTTP — Download Binário da Imagem Final',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.2,
        position: [3360, 880],
        onError: 'continueErrorOutput',
    })
    HttpDownloadBinarioDaImagemFinal = {
        url: '={{ $json.imagem_final_url }}',
        options: {
            response: {
                response: {
                    responseFormat: 'file',
                },
            },
        },
    };

    @node({
        id: 'b1a00021-0021-4021-8021-000000000021',
        name: 'Merge — Restaura Campos Pós Download',
        type: 'n8n-nodes-base.merge',
        version: 3.2,
        position: [3520, 880],
    })
    MergeRestauraCamposPosDownload = {
        mode: 'combine',
        combineBy: 'combineByPosition',
        options: {},
    };

    @node({
        id: 'b1a00011-0011-4011-8011-000000000011',
        name: 'LinkedIn — Publica Post',
        type: 'n8n-nodes-base.linkedIn',
        version: 1,
        position: [3680, 880],
        credentials: { linkedInOAuth2Api: { id: '3lfVTqWIu3aIZWZ0', name: 'LinkedIn account' } },
        onError: 'continueErrorOutput',
    })
    LinkedinPublicaPost = {
        person: '={{ $env.LINKEDIN_PERSON_URN }}',
        text: '={{ $json.texto_final }}',
        shareMediaCategory: "={{ $json.imagem_final_url ? 'IMAGE' : 'NONE' }}",
        additionalFields: {
            thumbnailBinaryPropertyName: 'data',
        },
    };

    @node({
        id: 'b1a00012-0012-4012-8012-000000000012',
        name: 'Sheets — Marcar Publicado',
        type: 'n8n-nodes-base.googleSheets',
        version: 4.5,
        position: [2128, 752],
        credentials: { googleSheetsOAuth2Api: { id: 'F1erZv6I4wGpkjvb', name: 'Google Sheets account' } },
    })
    SheetsMarcarPublicado = {
        operation: 'update',
        documentId: {
            __rl: true,
            value: '={{ $env.LINKEDIN_SHEET_ID }}',
            mode: 'id',
        },
        sheetName: {
            __rl: true,
            value: 'Backlog LinkedIn',
            mode: 'name',
        },
        columns: {
            mappingMode: 'defineBelow',
            value: {
                status: 'publicado',
                data_publicacao: "={{ new Date().toISOString().split('T')[0] }}",
                texto_final: '={{ $json.texto_final }}',
                imagem_usada: "={{ $json.imagem_escolhida || 'não' }}",
                row_number: '={{ $json._rowIndex }}',
            },
            matchingColumns: ['row_number'],
            schema: [
                {
                    id: 'titulo',
                    displayName: 'titulo',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'link_fonte',
                    displayName: 'link_fonte',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'pilar',
                    displayName: 'pilar',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'status',
                    displayName: 'status',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
                {
                    id: 'contexto',
                    displayName: 'contexto',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'data_publicacao',
                    displayName: 'data_publicacao',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
                {
                    id: 'texto_final',
                    displayName: 'texto_final',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
                {
                    id: 'imagem_usada',
                    displayName: 'imagem_usada',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
                {
                    id: 'tipo (informativo | noticia)',
                    displayName: 'tipo (informativo | noticia)',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'data_fonte',
                    displayName: 'data_fonte',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'row_number',
                    displayName: 'row_number',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'number',
                    canBeUsedToMatch: true,
                    readOnly: true,
                    removed: false,
                },
            ],
            attemptToConvertTypes: false,
            convertFieldsToString: false,
        },
        options: {},
    };

    @node({
        id: 'b1a00013-0013-4013-8013-000000000013',
        webhookId: '3709df31-1b6b-44f5-9389-9abd3a3acaef',
        name: 'Telegram — Notifica Erro',
        type: 'n8n-nodes-base.telegram',
        version: 1.2,
        position: [1760, 736],
        credentials: { telegramApi: { id: 'nA4a3QYYHD29nWe0', name: 'Telegram account' } },
    })
    TelegramNotificaErro = {
        chatId: '={{ $env.TELEGRAM_CHAT_ID }}',
        text: `=❌ **ERRO — LinkedIn AI POST**

**Node com falha:** {{ $prevNode.name }}
**Execução ID:** {{ $execution.id }}
**Erro:** {{ $json.error }}

Acesse o n8n para detalhes e reexecutar se necessário.`,
        additionalFields: {},
    };

    @node({
        id: 'c2b00014-0014-4014-8014-000000000014',
        name: 'IF — É Notícia Expirada',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [704, 112],
    })
    IfENoticiaExpirada = {
        conditions: {
            combinator: 'and',
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 3,
            },
            conditions: [
                {
                    leftValue: '={{ $json._tipo_saida }}',
                    rightValue: 'expirada',
                    operator: {
                        type: 'string',
                        operation: 'equals',
                    },
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'c2b00015-0015-4015-8015-000000000015',
        name: 'Schedule — Ingestão Semanal (Dom 20h BRT)',
        type: 'n8n-nodes-base.scheduleTrigger',
        version: 1.1,
        position: [112, 1248],
    })
    ScheduleIngestaoSemanalDom20hBrt = {
        rule: {
            interval: [
                {
                    field: 'cronExpression',
                    expression: '0 20 * * 0',
                },
            ],
        },
    };

    @node({
        id: 'c2b00016-0016-4016-8016-000000000016',
        name: 'RSS — Towards Data Science',
        type: 'n8n-nodes-base.rssFeedRead',
        version: 1.2,
        position: [352, 1168],
        onError: 'continueErrorOutput',
    })
    RssTowardsDataScience = {
        url: 'https://towardsdatascience.com/feed',
        options: {},
    };

    @node({
        id: 'c2b00017-0017-4017-8017-000000000017',
        name: 'RSS — The Hacker News',
        type: 'n8n-nodes-base.rssFeedRead',
        version: 1.2,
        position: [352, 1328],
        onError: 'continueErrorOutput',
    })
    RssTheHackerNews = {
        url: 'https://feeds.feedburner.com/TheHackersNews',
        options: {},
    };

    @node({
        id: 'c2b00018-0018-4018-8018-000000000018',
        name: 'Code — Normaliza TDS (Top 5)',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [592, 1168],
    })
    CodeNormalizaTdsTop5 = {
        jsCode: `// Pega os 5 itens mais recentes do feed e normaliza pro schema do Radar
const itens = $input.all().map(i => i.json).slice(0, 5);

return itens.map(item => ({
  json: {
    fonte: 'towards_data_science',
    titulo: item.title || '',
    link: item.link || '',
    resumo: (item.contentSnippet || item.content || '').substring(0, 300),
    data_fonte: item.isoDate || item.pubDate || '',
  }
}));`,
    };

    @node({
        id: 'c2b00019-0019-4019-8019-000000000019',
        name: 'Code — Normaliza HN (Top 5)',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [592, 1328],
    })
    CodeNormalizaHnTop5 = {
        jsCode: `// Pega os 5 itens mais recentes do feed e normaliza pro schema do Radar
const itens = $input.all().map(i => i.json).slice(0, 5);

return itens.map(item => ({
  json: {
    fonte: 'the_hacker_news',
    titulo: item.title || '',
    link: item.link || '',
    resumo: (item.contentSnippet || item.content || '').substring(0, 300),
    data_fonte: item.isoDate || item.pubDate || '',
  }
}));`,
    };

    @node({
        id: 'c2b00028-0028-4028-8028-000000000028',
        name: 'RSS — Blog n8n',
        type: 'n8n-nodes-base.rssFeedRead',
        version: 1.2,
        position: [352, 1488],
        onError: 'continueErrorOutput',
    })
    RssBlogN8n = {
        url: 'https://blog.n8n.io/rss/',
        options: {},
    };

    @node({
        id: 'c2b00029-0029-4029-8029-000000000029',
        name: 'RSS — Planet PostgreSQL',
        type: 'n8n-nodes-base.rssFeedRead',
        version: 1.2,
        position: [352, 1648],
        onError: 'continueErrorOutput',
    })
    RssPlanetPostgresql = {
        url: 'https://planet.postgresql.org/rss20.xml',
        options: {},
    };

    @node({
        id: 'c2b00030-0030-4030-8030-000000000030',
        name: 'Code — Normaliza n8n (Top 5)',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [592, 1488],
    })
    CodeNormalizaN8nTop5 = {
        jsCode: `// Pega os 5 itens mais recentes do feed e normaliza pro schema do Radar
const itens = $input.all().map(i => i.json).slice(0, 5);

return itens.map(item => ({
  json: {
    fonte: 'blog_n8n',
    titulo: item.title || '',
    link: item.link || '',
    resumo: (item.contentSnippet || item.content || '').substring(0, 300),
    data_fonte: item.isoDate || item.pubDate || '',
  }
}));`,
    };

    @node({
        id: 'c2b00031-0031-4031-8031-000000000031',
        name: 'Code — Normaliza SQL (Top 5)',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [592, 1648],
    })
    CodeNormalizaSqlTop5 = {
        jsCode: `// Pega os 5 itens mais recentes do feed e normaliza pro schema do Radar
const itens = $input.all().map(i => i.json).slice(0, 5);

return itens.map(item => ({
  json: {
    fonte: 'planet_postgresql',
    titulo: item.title || '',
    link: item.link || '',
    resumo: (item.contentSnippet || item.content || '').substring(0, 300),
    data_fonte: item.isoDate || item.pubDate || '',
  }
}));`,
    };

    @node({
        id: 'c2b00020-0020-4020-8020-000000000020',
        name: 'Merge — Fontes RSS',
        type: 'n8n-nodes-base.merge',
        version: 3.2,
        position: [832, 1248],
    })
    MergeFontesRss = {
        numberInputs: 4,
    };

    @node({
        id: 'c2b00023-0023-4023-8023-000000000023',
        name: 'Code — Prepara Itens Radar',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1056, 1328],
    })
    CodePreparaItensRadar = {
        jsCode: `// Ponto único de convergência entre a ingestão via RSS (semanal) e a
// ingestão via e-mail (event-driven) — garante forma consistente antes
// da classificação por IA. Serve também como referência estável pro
// Code — Parse Classificação Radar recuperar os campos originais.
return $input.all().map(item => ({
  json: {
    fonte: item.json.fonte || 'desconhecida',
    titulo: item.json.titulo || '',
    link: item.json.link || '',
    resumo: item.json.resumo || '',
    data_fonte: item.json.data_fonte || '',
  }
}));`,
    };

    @node({
        id: 'c2b00027-0027-4027-8027-000000000027',
        name: 'Sheets — Radar Grava Bruto',
        type: 'n8n-nodes-base.googleSheets',
        version: 4.5,
        position: [1296, 1328],
        credentials: { googleSheetsOAuth2Api: { id: 'F1erZv6I4wGpkjvb', name: 'Google Sheets account' } },
        onError: 'continueErrorOutput',
    })
    SheetsRadarGravaBruto = {
        operation: 'appendOrUpdate',
        documentId: {
            __rl: true,
            value: '={{ $env.LINKEDIN_SHEET_ID }}',
            mode: 'id',
        },
        sheetName: {
            __rl: true,
            value: 621608257,
            mode: 'list',
            cachedResultName: '`Radar de Conteúdo`',
            cachedResultUrl: 'https://docs.google.com/spreadsheets/d/SEU_SHEET_ID_AQUI/edit#gid=621608257',
        },
        columns: {
            mappingMode: 'defineBelow',
            value: {
                data_coleta: "={{ new Date().toISOString().split('T')[0] }}",
                fonte: '={{ $json.fonte }}',
                titulo: '={{ $json.titulo }}',
                link: '={{ $json.link }}',
                resumo: '={{ $json.resumo }}',
                data_fonte: '={{ $json.data_fonte }}',
                status_radar: 'bruto',
            },
            matchingColumns: ['link'],
            schema: [
                {
                    id: 'data_coleta',
                    displayName: 'data_coleta',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
                {
                    id: 'data_fonte',
                    displayName: 'data_fonte',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
                {
                    id: 'fonte',
                    displayName: 'fonte',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
                {
                    id: 'titulo',
                    displayName: 'titulo',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
                {
                    id: 'link',
                    displayName: 'link',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
                {
                    id: 'resumo',
                    displayName: 'resumo',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
                {
                    id: 'tipo',
                    displayName: 'tipo',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'pilar_sugerido',
                    displayName: 'pilar_sugerido',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'score_relevancia',
                    displayName: 'score_relevancia',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'status_radar',
                    displayName: 'status_radar',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
            ],
            attemptToConvertTypes: false,
            convertFieldsToString: false,
        },
        options: {},
    };

    @node({
        id: 'c2b00024-0024-4024-8024-000000000024',
        name: 'IA — Classifica Item Radar',
        type: '@n8n/n8n-nodes-langchain.googleGemini',
        version: 1,
        position: [1248, 1552],
        credentials: { googlePalmApi: { id: 'xLU03UjXUyC6LxM1', name: 'Google Gemini(PaLM) Api account' } },
        onError: 'continueErrorOutput',
        retryOnFail: true,
        maxTries: 3,
        waitBetweenTries: 5000,
    })
    IaClassificaItemRadar = {
        modelId: {
            __rl: true,
            value: 'models/gemini-3.5-flash',
            mode: 'list',
            cachedResultName: 'models/gemini-3.5-flash',
        },
        messages: {
            values: [
                {
                    content: `=Classifique o item de conteúdo abaixo, coletado para alimentar um radar de pautas de posts técnicos no LinkedIn (pilares possíveis: dado, ia, sql, n8n, tech).

Fonte: {{ $json.fonte }}
Título: {{ $json.titulo }}
Resumo: {{ $json.resumo }}

Avalie o potencial deste item virar um bom post de LinkedIn usando os 4 critérios abaixo (nota de 0 a 10 cada):

1. hook_potencial — dá pra abrir o post com um dado surpreendente, um ângulo contra-intuitivo ou uma pergunta provocativa nas 2 primeiras linhas? Conteúdo genérico ou óbvio pontua baixo.
2. especificidade — o item traz números, casos concretos, comparações ou evidências específicas (não apenas afirmações vagas ou hype)?
3. valor_pratico — um profissional de dados/tech aprende algo aplicável no dia a dia, ou é só uma notícia de superfície sem ensinamento nenhum?
4. atemporalidade — o conteúdo continua fazendo sentido daqui a 2-4 semanas, ou perde a validade rápido (lançamento, evento, fofoca de mercado)?

Calcule score_relevancia como média ponderada: hook_potencial*0.30 + especificidade*0.25 + valor_pratico*0.30 + atemporalidade*0.15 (arredonde para 1 casa decimal).

Responda EXCLUSIVAMENTE em JSON válido, sem markdown, sem explicações:
{
  "tipo": "informativo ou noticia — 'informativo' se for conteúdo educacional/atemporal (tutorial, conceito, boas práticas), 'noticia' se for um fato/anúncio/evento datado que perde relevância com o tempo",
  "pilar_sugerido": "um entre: dado, ia, sql, n8n, tech",
  "score_relevancia": "número de 0 a 10 (a média ponderada calculada acima)",
  "resumo": "resumo em 1 frase curta, em português"
}`,
                },
            ],
        },
        builtInTools: {
            googleSearch: false,
            urlContext: false,
            codeExecution: false,
        },
        options: {},
    };

    @node({
        id: 'c2b00025-0025-4025-8025-000000000025',
        name: 'Code — Parse Classificação Radar',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1600, 1296],
        onError: 'continueErrorOutput',
    })
    CodeParseClassificacaoRadar = {
        jsCode: `// Faz o parse do JSON de classificação da IA e junta de volta com os
// campos originais do item (fonte/titulo/link/data_fonte), pareando
// por índice com a saída do Code — Prepara Itens Radar (mesma ordem
// em que os itens entraram no node de classificação).
const originais = $('Code — Prepara Itens Radar').all().map(i => i.json);
const classificacoes = $input.all().map(i => i.json);

const hoje = new Date().toISOString().split('T')[0];

return originais.map((original, idx) => {
  const geminiOutput = classificacoes[idx] || {};
  const candidate = geminiOutput.content ? geminiOutput : (geminiOutput.candidates && geminiOutput.candidates[0]);
  const parts = (candidate && candidate.content && candidate.content.parts) || [];
  const raw = parts.map(p => p.text || '').join('') || geminiOutput.text || '';

  let parsed = { tipo: 'informativo', pilar_sugerido: 'tech', score_relevancia: 0, resumo: '' };
  try {
    const clean = raw.replace(/\`\`\`json\\n?/g, '').replace(/\`\`\`\\n?/g, '').trim();
    parsed = JSON.parse(clean);
  } catch (e) {
    // Se a IA não devolver JSON válido, mantém os defaults acima em vez
    // de derrubar a execução inteira por causa de 1 item ruim no lote.
  }

  return {
    json: {
      data_coleta: hoje,
      fonte: original.fonte,
      titulo: original.titulo,
      link: original.link,
      resumo: parsed.resumo || original.resumo,
      data_fonte: original.data_fonte,
      tipo: parsed.tipo,
      pilar_sugerido: parsed.pilar_sugerido,
      score_relevancia: parsed.score_relevancia,
      status_radar: 'novo',
    }
  };
});`,
    };

    @node({
        id: 'c2b00026-0026-4026-8026-000000000026',
        name: 'Sheets — Radar Append Or Update',
        type: 'n8n-nodes-base.googleSheets',
        version: 4.5,
        position: [1984, 1296],
        credentials: { googleSheetsOAuth2Api: { id: 'F1erZv6I4wGpkjvb', name: 'Google Sheets account' } },
        onError: 'continueErrorOutput',
    })
    SheetsRadarAppendOrUpdate = {
        operation: 'appendOrUpdate',
        documentId: {
            __rl: true,
            value: '={{ $env.LINKEDIN_SHEET_ID }}',
            mode: 'id',
        },
        sheetName: {
            __rl: true,
            value: 621608257,
            mode: 'list',
            cachedResultName: '`Radar de Conteúdo`',
            cachedResultUrl: 'https://docs.google.com/spreadsheets/d/SEU_SHEET_ID_AQUI/edit#gid=621608257',
        },
        columns: {
            mappingMode: 'defineBelow',
            value: {
                data_coleta: '={{ $json.data_coleta }}',
                fonte: '={{ $json.fonte }}',
                titulo: '={{ $json.titulo }}',
                link: '={{ $json.link }}',
                resumo: '={{ $json.resumo }}',
                data_fonte: '={{ $json.data_fonte }}',
                tipo: '={{ $json.tipo }}',
                pilar_sugerido: '={{ $json.pilar_sugerido }}',
                score_relevancia: '={{ $json.score_relevancia }}',
                status_radar: '={{ $json.status_radar }}',
            },
            matchingColumns: ['link'],
            schema: [
                {
                    id: 'data_coleta',
                    displayName: 'data_coleta',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
                {
                    id: 'fonte',
                    displayName: 'fonte',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
                {
                    id: 'titulo',
                    displayName: 'titulo',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
                {
                    id: 'link',
                    displayName: 'link',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
                {
                    id: 'resumo',
                    displayName: 'resumo',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
                {
                    id: 'tipo',
                    displayName: 'tipo',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
                {
                    id: 'pilar_sugerido',
                    displayName: 'pilar_sugerido',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
                {
                    id: 'score_relevancia',
                    displayName: 'score_relevancia',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
                {
                    id: 'status_radar',
                    displayName: 'status_radar',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
            ],
            attemptToConvertTypes: false,
            convertFieldsToString: false,
        },
        options: {},
    };

    @node({
        id: 'c2b00032-0032-4032-8032-000000000032',
        name: 'Sheets — Radar Lê Prontos',
        type: 'n8n-nodes-base.googleSheets',
        version: 4.5,
        position: [96, 496],
        credentials: { googleSheetsOAuth2Api: { id: 'F1erZv6I4wGpkjvb', name: 'Google Sheets account' } },
        onError: 'continueErrorOutput',
    })
    SheetsRadarLeProntos = {
        documentId: {
            __rl: true,
            value: '={{ $env.LINKEDIN_SHEET_ID }}',
            mode: 'id',
        },
        sheetName: {
            __rl: true,
            value: 621608257,
            mode: 'list',
            cachedResultName: '`Radar de Conteúdo`',
            cachedResultUrl: 'https://docs.google.com/spreadsheets/d/SEU_SHEET_ID_AQUI/edit#gid=621608257',
        },
        filtersUI: {
            values: [
                {
                    lookupColumn: 'status_radar',
                    lookupValue: 'pronto',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'c2b00033-0033-4033-8033-000000000033',
        name: 'IA — Traduz Título Pt-BR',
        type: '@n8n/n8n-nodes-langchain.googleGemini',
        version: 1,
        position: [112, 752],
        credentials: { googlePalmApi: { id: 'xLU03UjXUyC6LxM1', name: 'Google Gemini(PaLM) Api account' } },
        onError: 'continueErrorOutput',
        retryOnFail: true,
        maxTries: 3,
        waitBetweenTries: 5000,
    })
    IaTraduzTituloPtBr = {
        modelId: {
            __rl: true,
            value: 'models/gemini-2.5-flash',
            mode: 'list',
            cachedResultName: 'models/gemini-2.5-flash',
        },
        messages: {
            values: [
                {
                    content: `=Traduza o título abaixo para português do Brasil, adaptando de forma natural (não é tradução literal), mantendo o tom técnico apropriado para um post de LinkedIn sobre tecnologia/dados.

Responda APENAS com o título traduzido, sem aspas, sem markdown, sem explicações.

Título original: {{ $json.titulo }}`,
                },
            ],
        },
        builtInTools: {
            googleSearch: false,
            urlContext: false,
            codeExecution: false,
        },
        options: {},
    };

    @node({
        id: 'c2b00034-0034-4034-8034-000000000034',
        name: 'Code — Monta Linha do Backlog',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [464, 688],
        onError: 'continueErrorOutput',
    })
    CodeMontaLinhaDoBacklog = {
        jsCode: `// Junta a tradução do título (IA) com os dados originais da linha do
// Radar marcada como status_radar='pronto', montando o formato de
// linha do Backlog LinkedIn. Pareia por índice com a saída do
// Sheets — Radar Lê Prontos (mesma ordem em que os itens entraram
// no node de tradução).
const originais = $('Sheets — Radar Lê Prontos').all().map(i => i.json);
const traducoes = $input.all().map(i => i.json);

return originais.map((original, idx) => {
  const geminiOutput = traducoes[idx] || {};
  const candidate = geminiOutput.content ? geminiOutput : (geminiOutput.candidates && geminiOutput.candidates[0]);
  const parts = (candidate && candidate.content && candidate.content.parts) || [];
  const tituloTraduzido = (parts.map(p => p.text || '').join('') || geminiOutput.text || original.titulo).trim();

  return {
    json: {
      titulo: tituloTraduzido,
      link_fonte: original.link,
      pilar: original.pilar_sugerido,
      status: 'pronto',
      contexto: original.resumo,
      tipo: original.tipo,
      data_fonte: original.data_fonte,
      score_relevancia: original.score_relevancia,
      row_number: original.row_number,
    }
  };
});`,
    };

    @node({
        id: 'c2b00035-0035-4035-8035-000000000035',
        name: 'Sheets — Backlog Grava Migrados',
        type: 'n8n-nodes-base.googleSheets',
        version: 4.5,
        position: [752, 624],
        credentials: { googleSheetsOAuth2Api: { id: 'F1erZv6I4wGpkjvb', name: 'Google Sheets account' } },
        onError: 'continueErrorOutput',
    })
    SheetsBacklogGravaMigrados = {
        operation: 'appendOrUpdate',
        documentId: {
            __rl: true,
            value: '={{ $env.LINKEDIN_SHEET_ID }}',
            mode: 'id',
        },
        sheetName: {
            __rl: true,
            value: 'gid=0',
            mode: 'list',
            cachedResultName: 'Backlog LinkedIn',
            cachedResultUrl: 'https://docs.google.com/spreadsheets/d/SEU_SHEET_ID_AQUI/edit#gid=0',
        },
        columns: {
            mappingMode: 'defineBelow',
            value: {
                titulo: '={{ $json.titulo }}',
                link_fonte: '={{ $json.link_fonte }}',
                pilar: '={{ $json.pilar }}',
                status: '={{ $json.status }}',
                contexto: '={{ $json.contexto }}',
                'tipo (informativo | noticia)': '={{ $json.tipo }}',
                data_fonte: '={{ $json.data_fonte }}',
                score_relevancia: '={{ $json.score_relevancia }}',
            },
            matchingColumns: ['link_fonte'],
            schema: [
                {
                    id: 'titulo',
                    displayName: 'titulo',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
                {
                    id: 'link_fonte',
                    displayName: 'link_fonte',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
                {
                    id: 'pilar',
                    displayName: 'pilar',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
                {
                    id: 'status',
                    displayName: 'status',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
                {
                    id: 'contexto',
                    displayName: 'contexto',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
                {
                    id: 'data_publicacao',
                    displayName: 'data_publicacao',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
                {
                    id: 'texto_final',
                    displayName: 'texto_final',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
                {
                    id: 'imagem_usada',
                    displayName: 'imagem_usada',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
                {
                    id: 'tipo (informativo | noticia)',
                    displayName: 'tipo (informativo | noticia)',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
                {
                    id: 'data_fonte',
                    displayName: 'data_fonte',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
                {
                    id: 'score_relevancia',
                    displayName: 'score_relevancia',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
                {
                    id: 'row_number',
                    displayName: 'row_number',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'number',
                    canBeUsedToMatch: true,
                    readOnly: true,
                },
            ],
            attemptToConvertTypes: false,
            convertFieldsToString: false,
        },
        options: {},
    };

    @node({
        id: 'c2b00036-0036-4036-8036-000000000036',
        name: 'Sheets — Radar Marca Migrado',
        type: 'n8n-nodes-base.googleSheets',
        version: 4.5,
        position: [752, 832],
        credentials: { googleSheetsOAuth2Api: { id: 'F1erZv6I4wGpkjvb', name: 'Google Sheets account' } },
        onError: 'continueErrorOutput',
    })
    SheetsRadarMarcaMigrado = {
        operation: 'update',
        documentId: {
            __rl: true,
            value: '={{ $env.LINKEDIN_SHEET_ID }}',
            mode: 'id',
        },
        sheetName: {
            __rl: true,
            value: 621608257,
            mode: 'list',
            cachedResultName: '`Radar de Conteúdo`',
            cachedResultUrl: 'https://docs.google.com/spreadsheets/d/SEU_SHEET_ID_AQUI/edit#gid=621608257',
        },
        columns: {
            mappingMode: 'defineBelow',
            value: {
                status_radar: 'migrado',
            },
            matchingColumns: ['row_number'],
            schema: [
                {
                    id: 'data_coleta',
                    displayName: 'data_coleta',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
                {
                    id: 'fonte',
                    displayName: 'fonte',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
                {
                    id: 'titulo',
                    displayName: 'titulo',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
                {
                    id: 'link',
                    displayName: 'link',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
                {
                    id: 'resumo',
                    displayName: 'resumo',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
                {
                    id: 'data_fonte',
                    displayName: 'data_fonte',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
                {
                    id: 'tipo',
                    displayName: 'tipo',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
                {
                    id: 'pilar_sugerido',
                    displayName: 'pilar_sugerido',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
                {
                    id: 'score_relevancia',
                    displayName: 'score_relevancia',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
                {
                    id: 'status_radar',
                    displayName: 'status_radar',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
                {
                    id: 'row_number',
                    displayName: 'row_number',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'number',
                    canBeUsedToMatch: true,
                    readOnly: true,
                },
            ],
            attemptToConvertTypes: false,
            convertFieldsToString: false,
        },
        options: {},
    };

    @node({
        id: '2efcd48b-a592-426b-9305-766af9902ee8',
        name: 'Sticky Note',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [16, 80],
    })
    StickyNote = {
        height: 928,
        width: 2496,
        color: 4,
    };

    @node({
        id: 'c92e2744-9416-46ba-9215-7d5d96b867f6',
        name: 'Sticky Note1',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [32, 1104],
    })
    StickyNote1 = {
        content: `##INGERE DADOS NO MEU BANCO DE DADOS VIA SHEETS

**Double click** to edit me. [Guide](https://docs.n8n.io/workflows/components/sticky-notes/)`,
        height: 752,
        width: 2128,
        color: 4,
    };

    @node({
        id: 'e4410332-a2d6-42db-a8df-9e0c7da393ae',
        name: 'Sticky Note2',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [1680, 448],
    })
    StickyNote2 = {
        content: '',
        height: 480,
        width: 256,
        color: 3,
    };

    @node({
        id: 'b80e73e4-bcf9-44d1-93cd-7c5bfc90a82a',
        name: 'Sticky Note3',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [2048, 448],
    })
    StickyNote3 = {
        content: '#',
        height: 480,
        width: 256,
        color: '#3CC00C',
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.ScheduleSegQuaSex14hBrt.out(0).to(this.SheetsLerTodasAsLinhas.in(0));
        this.SheetsRadarLeProntos.out(0).to(this.IaTraduzTituloPtBr.in(0));
        this.SheetsRadarLeProntos.out(1).to(this.TelegramNotificaErro.in(0));
        this.IaTraduzTituloPtBr.out(0).to(this.CodeMontaLinhaDoBacklog.in(0));
        this.IaTraduzTituloPtBr.out(1).to(this.TelegramNotificaErro.in(0));
        this.CodeMontaLinhaDoBacklog.out(0).to(this.SheetsBacklogGravaMigrados.in(0));
        this.CodeMontaLinhaDoBacklog.out(0).to(this.SheetsRadarMarcaMigrado.in(0));
        this.CodeMontaLinhaDoBacklog.out(1).to(this.TelegramNotificaErro.in(0));
        this.SheetsBacklogGravaMigrados.out(1).to(this.TelegramNotificaErro.in(0));
        this.SheetsRadarMarcaMigrado.out(1).to(this.TelegramNotificaErro.in(0));
        this.SheetsLerTodasAsLinhas.out(0).to(this.CodeSelecionaLinhaRotacaoDePilar.in(0));
        this.SheetsLerTodasAsLinhas.out(1).to(this.TelegramNotificaErro.in(0));
        this.CodeSelecionaLinhaRotacaoDePilar.out(0).to(this.IfENoticiaExpirada.in(0));
        this.CodeSelecionaLinhaRotacaoDePilar.out(1).to(this.TelegramNotificaErro.in(0));
        this.IfENoticiaExpirada.out(0).to(this.SheetsMarcarDescartado.in(0));
        this.IfENoticiaExpirada.out(1).to(this.IaGeraTextoDoPostPromptDeImagem.in(0));
        this.IaGeraTextoDoPostPromptDeImagem.out(0).to(this.CodeParseJsonDoLlm.in(0));
        this.IaGeraTextoDoPostPromptDeImagem.out(1).to(this.TelegramNotificaErro.in(0));
        this.CodeParseJsonDoLlm.out(0).to(this.TelegramAprovacaoDoTexto.in(0));
        this.CodeParseJsonDoLlm.out(0).to(this.MergeRestauraCamposPosAprovacaoDoTexto.in(1));
        this.CodeParseJsonDoLlm.out(1).to(this.TelegramNotificaErro.in(0));
        this.TelegramAprovacaoDoTexto.out(0).to(this.MergeRestauraCamposPosAprovacaoDoTexto.in(0));
        this.TelegramAprovacaoDoTexto.out(1).to(this.TelegramNotificaErro.in(0));
        this.MergeRestauraCamposPosAprovacaoDoTexto.out(0).to(this.CodeNormalizaDecisaoDoTexto.in(0));
        this.CodeNormalizaDecisaoDoTexto.out(0).to(this.IfTextoReprovado.in(0));
        this.CodeNormalizaDecisaoDoTexto.out(1).to(this.TelegramNotificaErro.in(0));
        this.IfTextoReprovado.out(0).to(this.SheetsMarcarDescartado.in(0));
        this.IfTextoReprovado.out(1).to(this.HttpGeraImagemRecraft.in(0));
        this.IfTextoReprovado.out(1).to(this.HttpGeraImagemNanoBanana.in(0));
        this.IfTextoReprovado.out(1).to(this.MergeRestauraCamposPosGeracaoDupla.in(2));
        this.HttpGeraImagemRecraft.out(0).to(this.CodeExtraiUrlRecraft.in(0));
        this.HttpGeraImagemRecraft.out(1).to(this.TelegramNotificaErro.in(0));
        this.CodeExtraiUrlRecraft.out(0).to(this.MergeRestauraCamposPosGeracaoDupla.in(0));
        this.HttpGeraImagemNanoBanana.out(0).to(this.CodeExtraiUrlNanoBanana.in(0));
        this.HttpGeraImagemNanoBanana.out(1).to(this.TelegramNotificaErro.in(0));
        this.CodeExtraiUrlNanoBanana.out(0).to(this.MergeRestauraCamposPosGeracaoDupla.in(1));
        this.MergeRestauraCamposPosGeracaoDupla.out(0).to(this.TelegramEnviaImagem1.in(0));
        this.MergeRestauraCamposPosGeracaoDupla.out(0).to(this.TelegramAprovacaoImagem1.in(0));
        this.MergeRestauraCamposPosGeracaoDupla.out(0).to(this.MergeRestauraPosAprovacaoImagem1.in(1));
        this.TelegramEnviaImagem1.out(1).to(this.TelegramNotificaErro.in(0));
        this.TelegramEnviaImagem2.out(1).to(this.TelegramNotificaErro.in(0));
        this.TelegramAprovacaoImagem1.out(0).to(this.MergeRestauraPosAprovacaoImagem1.in(0));
        this.TelegramAprovacaoImagem1.out(1).to(this.TelegramNotificaErro.in(0));
        this.MergeRestauraPosAprovacaoImagem1.out(0).to(this.CodeDecideImagem1.in(0));
        this.CodeDecideImagem1.out(0).to(this.IfImagem1Aprovada.in(0));
        this.IfImagem1Aprovada.out(0).to(this.IfTemImagemFinal.in(0));
        this.IfImagem1Aprovada.out(1).to(this.TelegramEnviaImagem2.in(0));
        this.IfImagem1Aprovada.out(1).to(this.TelegramAprovacaoImagem2.in(0));
        this.IfImagem1Aprovada.out(1).to(this.MergeRestauraPosAprovacaoImagem2.in(1));
        this.TelegramAprovacaoImagem2.out(0).to(this.MergeRestauraPosAprovacaoImagem2.in(0));
        this.TelegramAprovacaoImagem2.out(1).to(this.TelegramNotificaErro.in(0));
        this.MergeRestauraPosAprovacaoImagem2.out(0).to(this.CodeDecideImagem2.in(0));
        this.CodeDecideImagem2.out(0).to(this.IfImagem2Aprovada.in(0));
        this.IfImagem2Aprovada.out(0).to(this.IfTemImagemFinal.in(0));
        this.IfImagem2Aprovada.out(1).to(this.TelegramEscalarPraUltra.in(0));
        this.IfImagem2Aprovada.out(1).to(this.MergeRestauraPosEscalarUltra.in(1));
        this.TelegramEscalarPraUltra.out(0).to(this.MergeRestauraPosEscalarUltra.in(0));
        this.TelegramEscalarPraUltra.out(1).to(this.TelegramNotificaErro.in(0));
        this.MergeRestauraPosEscalarUltra.out(0).to(this.IfGerarUltra.in(0));
        this.IfGerarUltra.out(0).to(this.HttpGeraImagemUltra.in(0));
        this.IfGerarUltra.out(0).to(this.MergeRestauraPosGeracaoUltra.in(1));
        this.IfGerarUltra.out(1).to(this.IfTemImagemFinal.in(0));
        this.HttpGeraImagemUltra.out(0).to(this.MergeRestauraPosGeracaoUltra.in(0));
        this.HttpGeraImagemUltra.out(1).to(this.TelegramNotificaErro.in(0));
        this.MergeRestauraPosGeracaoUltra.out(0).to(this.CodeDefineImagemUltra.in(0));
        this.CodeDefineImagemUltra.out(0).to(this.IfTemImagemFinal.in(0));
        this.IfTemImagemFinal.out(0).to(this.HttpDownloadBinarioDaImagemFinal.in(0));
        this.IfTemImagemFinal.out(0).to(this.MergeRestauraCamposPosDownload.in(1));
        this.IfTemImagemFinal.out(1).to(this.LinkedinPublicaPost.in(0));
        this.HttpDownloadBinarioDaImagemFinal.out(0).to(this.MergeRestauraCamposPosDownload.in(0));
        this.HttpDownloadBinarioDaImagemFinal.out(1).to(this.TelegramNotificaErro.in(0));
        this.MergeRestauraCamposPosDownload.out(0).to(this.LinkedinPublicaPost.in(0));
        this.LinkedinPublicaPost.out(0).to(this.SheetsMarcarPublicado.in(0));
        this.LinkedinPublicaPost.out(1).to(this.TelegramNotificaErro.in(0));
        this.ScheduleIngestaoSemanalDom20hBrt.out(0).to(this.RssTowardsDataScience.in(0));
        this.ScheduleIngestaoSemanalDom20hBrt.out(0).to(this.RssTheHackerNews.in(0));
        this.ScheduleIngestaoSemanalDom20hBrt.out(0).to(this.RssBlogN8n.in(0));
        this.ScheduleIngestaoSemanalDom20hBrt.out(0).to(this.RssPlanetPostgresql.in(0));
        this.RssTowardsDataScience.out(0).to(this.CodeNormalizaTdsTop5.in(0));
        this.RssTowardsDataScience.out(1).to(this.TelegramNotificaErro.in(0));
        this.RssTheHackerNews.out(0).to(this.CodeNormalizaHnTop5.in(0));
        this.RssTheHackerNews.out(1).to(this.TelegramNotificaErro.in(0));
        this.RssBlogN8n.out(0).to(this.CodeNormalizaN8nTop5.in(0));
        this.RssBlogN8n.out(1).to(this.TelegramNotificaErro.in(0));
        this.RssPlanetPostgresql.out(0).to(this.CodeNormalizaSqlTop5.in(0));
        this.RssPlanetPostgresql.out(1).to(this.TelegramNotificaErro.in(0));
        this.CodeNormalizaTdsTop5.out(0).to(this.MergeFontesRss.in(0));
        this.CodeNormalizaHnTop5.out(0).to(this.MergeFontesRss.in(1));
        this.CodeNormalizaN8nTop5.out(0).to(this.MergeFontesRss.in(2));
        this.CodeNormalizaSqlTop5.out(0).to(this.MergeFontesRss.in(3));
        this.MergeFontesRss.out(0).to(this.CodePreparaItensRadar.in(0));
        this.CodePreparaItensRadar.out(0).to(this.SheetsRadarGravaBruto.in(0));
        this.SheetsRadarGravaBruto.out(0).to(this.IaClassificaItemRadar.in(0));
        this.SheetsRadarGravaBruto.out(1).to(this.TelegramNotificaErro.in(0));
        this.IaClassificaItemRadar.out(0).to(this.CodeParseClassificacaoRadar.in(0));
        this.IaClassificaItemRadar.out(1).to(this.TelegramNotificaErro.in(0));
        this.CodeParseClassificacaoRadar.out(0).to(this.SheetsRadarAppendOrUpdate.in(0));
        this.CodeParseClassificacaoRadar.out(1).to(this.TelegramNotificaErro.in(0));
        this.SheetsRadarAppendOrUpdate.out(1).to(this.TelegramNotificaErro.in(0));
    }
}
