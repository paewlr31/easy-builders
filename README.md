# Easy Builders

One-page (Usługi, O nas, Realizacje, Kontakt) i panel `/panel`. Treść siedzi w Neon, formularz idzie mailem przez Resend, strona chodzi na Vercelu.

Hasło do panelu jest w kodzie: `EasyBuilders570` (plik `lib/auth.ts`). Bez tego hasła panel się nie otwiera.

## Lokalny podgląd

Node.js 20 albo nowszy.

```powershell
cd C:\Users\pryce\Desktop\praca\stronyInternetowe\easyBuilders
npm install
npm run dev
```

Strona: http://localhost:3000  
Panel: http://localhost:3000/panel  
Hasło: `EasyBuilders570`

## 1. GitHub

Konto: https://github.com/paewlr31

1. Wejdź na https://github.com/new
2. Repository name: `easy-builders`
3. Zostaw repozytorium **Private**. Hasło panelu jest w kodzie, więc publiczne repo pokaże je każdemu.
4. Nie dodawaj README ani .gitignore. Create repository.
5. W katalogu projektu:

```powershell
cd C:\Users\pryce\Desktop\praca\stronyInternetowe\easyBuilders
git init
git add .
git commit -m "Strona Easy Builders z panelem, Neon i Resend"
git branch -M main
git remote add origin https://github.com/paewlr31/easy-builders.git
git push -u origin main
```

Plik `.env.local` nie wchodzi do gita.

## 2. Neon

1. Konto na https://console.neon.tech
2. New project. Nazwa: `easy-builders`. Region: **Europe (Frankfurt)**.
3. Skopiuj **Pooled connection** (w hoście jest `-pooler`), razem z `?sslmode=require`.
4. SQL nie odpalasz. Tabele tworzą się same przy pierwszym wejściu na stronę.

## 3. Resend

Formularz wysyła maila na adres z panelu, zakładka Kontakt, pole E-mail (na start `biuro@easybuilders.pl`). Odpowiedź z poczty trafia do osoby, która wypełniła formularz.

1. Konto na https://resend.com — zaloguj się mailem, na który chcesz dostawać testy.
2. Po lewej: **API Keys**.
3. **Create API Key**. Nazwa np. `easy-builders`. Uprawnienie: Sending access. Domena: All domains.
4. Skopiuj klucz od razu. Zaczyna się od `re_` i Resend pokazuje go tylko raz. Jak zniknie, skasuj klucz i zrób nowy.
5. Ten klucz wkleisz na Vercelu jako `RESEND_API_KEY`.

Sam klucz z `onboarding@resend.dev` wysyła maile **tylko na adres, którym założyłeś konto Resend**. Na `biuro@easybuilders.pl` i inne skrzynki Resend puści maila dopiero po podpięciu własnej domeny:

1. W Resend: **Domains** → **Add Domain**. Wpisz domenę firmy, np. `easybuilders.pl`.
2. Resend pokaże rekordy DNS (zwykle TXT i MX albo CNAME).
3. Wejdź tam, gdzie kupiona jest domena (home.pl, nazwa.pl, Cloudflare, OVH) i dodaj te rekordy dokładnie tak, jak pokazał Resend.
4. Wróć do Resend i kliknij **Verify**. Status ma być Verified. DNS potrafi iść kilka minut, czasem do kilku godzin.
5. Na Vercelu ustaw drugą zmienną: `RESEND_FROM` = `Easy Builders <biuro@twojadomena.pl>` (adres musi być na zweryfikowanej domenie).
6. Redeploy.

Dopóki domeny nie ma, zostaw nadawcę `Easy Builders <onboarding@resend.dev>` i testuj formularz na mailu z rejestracji Resend. W panelu, w polu E-mail, wpisz na ten czas ten sam adres.

## 4. Vercel

1. Konto na https://vercel.com połączone z GitHubem (paewlr31).
2. Add New → Project → import `paewlr31/easy-builders`. Framework: Next.js. Build: `next build`.
3. Environment Variables, środowisko Production:

| Nazwa | Wartość |
| --- | --- |
| `DATABASE_URL` | connection string pooled z Neon |
| `RESEND_API_KEY` | klucz `re_...` z Resend |
| `RESEND_FROM` | `Easy Builders <onboarding@resend.dev>` do testów, potem adres z własnej domeny |

4. Deploy.
5. Wejdź na `https://twoja-domena.vercel.app/panel`. Hasło: `EasyBuilders570`.

Zmiana tekstu, zdjęcia, linku albo koloru nie wymaga nowego deployu. Nowy deploy jest potrzebny po zmianie zmiennych środowiskowych albo kodu.

## Co zmienia się w panelu

Zakładka Kontakt: telefon, e-mail (to też skrzynka formularza), Facebook, Instagram, WhatsApp, adres, mapa, napisy na przyciskach. Puste pole ukrywa przycisk. Zakładka Kolory zmienia kolor konkretnych elementów. Zdjęcia wgrywa się albo wkleja jako adres URL.

WhatsApp na starcie: `+48 570 080 088`. Ten sam numer jest na przycisku Telefon. Oba da się rozdzielić w panelu.
