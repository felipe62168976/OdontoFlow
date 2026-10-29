# OdontoFlow (versão local: React + TypeScript + Tailwind, sem backend)

Todos os dados ficam no `localStorage` do navegador, separados por conta (`of_d_<id>`)

## Rodar
```
npm install
npm run dev
```

## Estrutura
- `src/store.tsx`: autenticação local e dados por clínica (persistência no localStorage)
- `src/components/ui.tsx`: Modal, FormModal, Table, Badge e demais componentes reutilizáveis
- `src/pages/*`: Landing, Auth, Dashboard, Patients, Agenda, Treatments, Finance, Reports, Settings
- `src/lib/*`: utilidades e notificações internas

## Limitações (importante)
- A "autenticação" é local: senha com hash SHA-256 no navegador. Serve para demonstração, não é segurança real, e quem acessa o navegador acessa os dados.
- Não há sincronização entre dispositivos nem recuperação de senha. Limpar os dados do navegador apaga tudo; use "Exportar dados".
- Sem permissões por perfil (administrador x profissional) e sem trilha de auditoria.
- Não há envio de e-mail/WhatsApp; os avisos são apenas internos.
- Para uso com dados reais de pacientes (LGPD), migre para um backend seguro e revise termos e retenção com assessoria jurídica.
