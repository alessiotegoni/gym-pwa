# 🏋️ Tabata – Gym PWA

**Tabata** è un'applicazione web progressiva (PWA) pensata per la palestra e i loro clienti. L'app permette agli utenti di registrarsi, visualizzare i corsi disponibili, prenotare le lezioni, gestire il proprio abbonamento tramite Stripe, ricevere notifiche push e monitorare i propri progressi. I trainer (admin) possono gestire corsi, utenti, prenotazioni ed eventi tramite un'area amministrativa dedicata.

---

## 🚀 Funzionalità Principali

- 👤 Registrazione e login utenti con autenticazione via **NextAuth**
- 📅 Visualizzazione corsi, prenotazioni e gestione calendario
- 💳 Pagamenti sicuri e integrazione con **Stripe**
- 📈 Statistiche utente e storico delle attività
- 🧑‍🏫 Area admin per trainer: gestione corsi, utenti e iscrizioni
- 🌐 UI responsive e moderna con **ShadCN UI** e **Tailwind CSS**
- 🔔 **Push Notifications** in tempo reale per ricordare corsi e aggiornamenti
- 🗂️ Validazione form avanzata con **React Hook Form** + **Zod**
- 💽 Gestione dati con **PostgreSQL** e ORM **Drizzle**
- ⚡ Performance ottimizzata con caching lato server e PWA support

---

## 🧰 Tech Stack

### Frontend
- [Next.js 15](https://nextjs.org/)
- [React 19](https://reactjs.org/)
- [ShadCN UI](https://ui.shadcn.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- Push Notifications API

### Backend / DB
- [PostgreSQL](https://www.postgresql.org/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [NextAuth.js](https://next-auth.js.org/)
- [Stripe](https://stripe.com/)

---

## 📦 Installazione

1. Clona la repository

```bash
git clone https://github.com/alessiotegoni/gym-pwa-tabata.git
cd gym-pwa-tabata
