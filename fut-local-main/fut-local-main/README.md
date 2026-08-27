# Field Finder

Prompt — Web SaaS FutRapa

Crie um Web SaaS moderno, responsivo e profissional chamado FutRapa, focado em conectar jogadores de futebol a quadras públicas e privadas disponíveis na região.

O objetivo da plataforma é permitir que usuários encontrem locais para jogar futebol, organizem partidas e marquem horários de forma simples.

1. Identidade visual

Nome da plataforma: FutRapa

Criar uma identidade visual moderna, jovem e esportiva, inspirada em aplicativos de futebol e comunidades esportivas.

Utilizar:

Tema escuro como padrão

Verde relacionado a campo de futebol como cor principal

Preto e tons de cinza para o fundo

Branco para textos e informações importantes

Detalhes modernos com efeitos sutis de brilho

Interface limpa e intuitiva

Design responsivo para desktop e principalmente celular

Criar uma logo moderna para FutRapa, podendo utilizar elementos relacionados a:

Bola de futebol

Campo

Localização

Jogadores

2. Página inicial

Criar uma landing page apresentando o FutRapa.

Headline principal:

Encontre uma quadra. Marque a partida. Jogue futebol.

Subtexto:

Encontre quadras públicas e privadas próximas, organize partidas e reúna jogadores em um só lugar.

Adicionar botões:

Encontrar quadras

Criar partida

Entrar / Criar conta

Também incluir uma seção explicando como funciona:

1. Encontre

Encontre quadras disponíveis na sua região.

2. Organize

Escolha data, horário e informações da partida.

3. Jogue

Convide jogadores e reúna sua equipe.

3. Sistema de localização

O sistema deve identificar automaticamente a localização aproximada do usuário.

Prioridade de localização:

Solicitar permissão de localização pelo navegador.

Caso o usuário não permita, utilizar uma localização aproximada baseada no IP, quando tecnicamente disponível.

Sempre informar ao usuário quando a localização for aproximada.

Permitir que o usuário altere manualmente cidade, estado ou região.

Com base na localização, mostrar quadras próximas em formato de:

Mapa interativo

Lista de quadras

Cards modernos

Cada card deve mostrar:

Nome da quadra

Tipo: Pública ou Privada

Endereço ou região

Distância aproximada

Foto

Avaliação, se disponível

Horários disponíveis

Botão: Ver detalhes

Botão: Criar partida

Criar filtros como:

Públicas

Privadas

Mais próximas

Melhor avaliadas

Campo society

Futsal

Grama

Areia

4. Sistema de partidas

Criar uma funcionalidade onde usuários cadastrados possam criar partidas.

Campos necessários:

Nome da partida

Local / quadra

Data

Horário

Número máximo de jogadores

Tipo de futebol

Descrição opcional

Nível dos jogadores: Iniciante, Intermediário ou Avançado

Após criar uma partida, ela deve aparecer na plataforma para outros usuários.

Outros jogadores devem poder:

Visualizar a partida

Participar

Cancelar participação

Ver quantidade de vagas restantes

Exemplo:

Fut na Arena Central

📍 Arena Central
📅 15/09/2026
⏰ 19:00
👥 8/10 jogadores

Botão:

Entrar na partida

5. Sistema de autenticação

Criar páginas completas de:

Login

Cadastro

Recuperação de senha

Perfil do usuário

Permitir cadastro utilizando:

Nome

E-mail

Senha

Foto de perfil opcional

Cidade

Após o login, o usuário deve possuir uma área personalizada.

6. Banco de dados

Utilizar um backend com banco de dados real, preferencialmente Supabase, para armazenar todas as informações.

Criar tabelas estruturadas para:

Usuários

ID

Nome

E-mail

Foto

Cidade

Data de criação

Quadras

ID

Nome

Tipo: Pública ou Privada

Endereço

Cidade

Latitude

Longitude

Foto

Informações adicionais

Partidas

ID

Criador da partida

Quadra

Data

Horário

Número máximo de jogadores

Número atual de jogadores

Nível

Status

Participantes

ID

ID da partida

ID do usuário

Data de entrada

Implementar autenticação e regras de segurança para garantir que os usuários possam editar apenas suas próprias informações e partidas quando forem os criadores.

7. Dashboard do usuário

Após fazer login, criar um dashboard contendo:

Minhas próximas partidas

Mostrar todas as partidas em que o usuário está participando.

Minhas partidas criadas

Permitir:

Editar

Cancelar

Ver participantes

Partidas próximas

Mostrar partidas acontecendo próximas da localização do usuário.

Meu perfil

Permitir editar:

Nome

Foto

Cidade

Informações do perfil

8. FutRapa+

Criar uma página especial chamada:

FutRapa+

Essa será a futura área premium da plataforma.

Por enquanto, a funcionalidade deve estar em modo de manutenção.

Criar uma página moderna e visualmente chamativa contendo:

🚧 FutRapa+ está chegando.

Texto:

Estamos preparando novas funcionalidades para levar sua experiência no futebol para o próximo nível.

Adicionar elementos visuais relacionados a:

Futebol

Tecnologia

Premium

Estatísticas

Comunidade

Criar uma seção com algumas funcionalidades marcadas como:

EM BREVE

Exemplos:

Estatísticas avançadas

Perfil de jogador

Ranking de jogadores

Sistema de times

Histórico de partidas

Recursos exclusivos

Organização avançada de campeonatos

Essas funcionalidades devem aparecer apenas como preview visual e não precisam estar implementadas neste momento.

Deixar a estrutura preparada para que, futuramente, seja fácil remover o modo de manutenção e adicionar novas funcionalidades e planos pagos.

9. Navegação

Criar um menu moderno contendo:

Início

Quadras

Partidas

FutRapa+

Meu perfil

No celular, utilizar um menu responsivo ou navegação inferior moderna.

10. Funcionalidades extras

Adicionar:

Sistema de busca por cidade ou nome da quadra

Filtros avançados

Estados de carregamento

Mensagens de erro amigáveis

Estados vazios quando não houver quadras ou partidas

Notificações visuais de sucesso e erro

Interface totalmente responsiva

Animações suaves

Skeleton loading

Dark mode como padrão

11. Estrutura técnica

Utilizar uma arquitetura organizada e escalável.

Preferencialmente utilizar:

React

TypeScript

Tailwind CSS

Componentes reutilizáveis

Supabase para autenticação e banco de dados

Separar corretamente:

Componentes

Páginas

Serviços

Tipos

Hooks

Integrações

Não utilizar apenas dados falsos como solução final. Criar uma estrutura preparada para conectar dados reais de quadras, localização e partidas.

Caso APIs externas de mapas ou locais sejam necessárias, criar uma camada de integração configurável através de variáveis de ambiente.

Objetivo final

O resultado deve parecer um SaaS real e pronto para evoluir, com visual profissional semelhante a uma startup moderna.

A experiência principal deve seguir este fluxo:

Usuário entra no FutRapa → permite ou informa sua localização → encontra quadras próximas → cria ou encontra uma partida → escolhe data e horário → outros jogadores entram → todos se organizam para jogar.

O sistema deve ser construído de forma modular e escalável, permitindo futuramente adicionar:

Planos pagos

FutRapa+

Sistema de assinatura

Chat entre jogadores

Avaliações de quadras

Ranking

Estatísticas

Times

Campeonatos

Notificações

Priorizar uma interface bonita, moderna, intuitiva e com aparência de produto SaaS profissional, e não apenas um site estático.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b748fd68-cf33-4327-bbfd-cdc0db98da1f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
