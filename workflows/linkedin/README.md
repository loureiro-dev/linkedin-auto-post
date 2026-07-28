# Linkedin AI POST — notas de implementação

## Aprovação do texto com 3 opções (Aprovar / Reprovar / Enviar texto corrigido)

O node `Discord — Aprovação do Texto` (`DiscordAprovacaoDoTexto`) precisava de uma 3ª
opção além de aprovar/reprovar: permitir que o usuário envie um texto corrigido que
substitui o gerado pela IA e segue o fluxo normal (geração de imagem, aprovação da
imagem, publicação).

### Abordagens consideradas

O node Discord "Send and Wait for a Response" do n8n suporta 3 `responseType`:

| responseType   | O que oferece                                                  | Limite relevante aqui |
|----------------|-----------------------------------------------------------------|------------------------|
| `approval`     | 1 ou 2 botões (`approvalType: 'single' \| 'double'`)             | **Máximo 2 botões** — não dá pra ter Aprovar/Reprovar/Editar num só node. Essa limitação já tinha sido confirmada neste mesmo workflow no node `Discord — Aprovação da Imagem` (só tem Aprovar/Publicar sem imagem por isso). |
| `freeText`     | Um campo de texto livre, sem opções pré-definidas                | Não dá pra distinguir aprovar/reprovar/editar sozinho — precisaria de outro node antes pra decidir o quê fazer com o texto. |
| `customForm`   | Formulário com múltiplos campos (texto, textarea, select, número, data...) | Suporta um campo de seleção com N opções **e** um campo de texto livre **na mesma interação**. |

### Decisão: `customForm`, um único node

Em vez de encadear 2 nodes de Discord (1º com botões Aprovar/Reprovar/Editar — que não é
suportado nativamente — e um 2º só disparado se "Editar" for clicado, esperando uma
mensagem de texto solta no canal), optamos por um único node com `responseType:
'customForm'` e 2 campos:

- `decisao` (select): `aprovar` | `reprovar` | `editar`
- `texto_corrigido` (textarea, opcional): preenchido só quando a opção for `editar`

Isso resolve a aprovação em **uma única interação** (a pessoa escolhe a opção e, se for o
caso, já cola o texto corrigido no mesmo formulário), em vez de exigir 2-3 mensagens
trocadas no Discord. É a implementação mais simples que atende o comportamento pedido.

### Fluxo depois da decisão

```
Discord — Aprovação do Texto (customForm: decisao + texto_corrigido)
  → Code — Normaliza Decisão do Texto
      · decisao === 'editar'  → texto_final = texto_corrigido (ignora o texto da IA)
      · decisao !== 'editar'  → texto_final = texto_post (gerado pela IA)
  → IF — Texto Reprovado
      · decisao === 'reprovar' → Sheets — Marcar Descartado (status=descartado) → fim
      · caso contrário (aprovar OU editar) → fal.ai — Gera Imagem (Flux), exatamente
        como se tivesse sido aprovado, usando `texto_final` do node de normalização
```

O `prompt_imagem` (gerado pela IA) nunca muda — só o texto do post é substituído quando
a opção escolhida é "editar". Os nodes `LinkedIn — Publica Post` e `Sheets — Marcar
Publicado` foram atualizados para ler `texto_final` do node `Code — Normaliza Decisão do
Texto` em vez do `texto_post` bruto do LLM.

### ⚠️ Ponto em aberto — validar em execução real

O formato exato do JSON devolvido pelo node Discord no modo `customForm` (se os campos
vêm direto no item ou aninhados em `.data`, e a chave exata de cada campo) não pôde ser
confirmado sem rodar uma aprovação real no Discord. O `Code — Normaliza Decisão do
Texto` já checa as duas variações mais prováveis (`dados.decisao` e `dados['Decisão']`,
direto ou dentro de `.data`), com fallback seguro para `'aprovar'` se nada for
reconhecido — mas **o primeiro teste ponta a ponta em produção deve confirmar que os
campos estão sendo lidos corretamente** antes de confiar 100% no fluxo. Se os nomes
vierem diferentes, ajustar apenas esse Code node.

## Prompt do node de geração de texto

O system prompt do node `IA — Gera Texto do Post + Prompt de Imagem` foi reescrito para:

- Escrever em primeira pessoa, com opinião própria (não resumo neutro de notícia).
- Seguir uma estrutura fixa: gancho → ponto de vista → detalhe técnico concreto →
  convite ao debate → link único no fim → até 3 hashtags específicos.
- Proibir explicitamente expressões de "AI slop" (`é crucial`, `revolucionário`, etc.) e
  fechamentos motivacionais genéricos.
- Limitar emojis a 2-3 por post.
- Incluir 3 exemplos (few-shot) de posts reais do usuário, com instrução explícita de
  priorizar imitar esse tom sobre as regras gerais.

Os inputs do node (`titulo`, `link_fonte`, `contexto`, `pilar`) e o formato de saída em
JSON (`texto_post` + `prompt_imagem`, consumido por `Code — Parse JSON do LLM`) não
mudaram.
