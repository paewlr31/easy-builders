import type { SiteContent } from "./types";

function photo(id: string, width = 1400) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=75`;
}

export const defaultContent: SiteContent = {
  colors: {
    headerBg: "#3c2918",
    headerText: "#f7f1e6",
    headerBrand: "#f7f1e6",
    pageBg: "#ffffff",
    heading: "#3c2918",
    text: "#3c2918",
    muted: "#6d5646",
    serviceTitle: "#3c2918",
    heroText: "#ffffff",
    heroScrim: "#1c1008",
    bandBg: "#3c2918",
    bandText: "#f7f1e6",
    cardBg: "#f4e6c8",
    cardText: "#3c2918",
    cardNumber: "#3c2918",
    lineButtonText: "#f7f1e6",
    lineButtonBorder: "#f7f1e6",
    lineButtonHoverText: "#3c2918",
    solidButtonBg: "#f4e6c8",
    solidButtonText: "#3c2918",
    footerBg: "#3c2918",
    footerText: "#f7f1e6",
    footerMuted: "#e4d3b4",
    inputBg: "#f4e6c8",
    inputText: "#3c2918",
    inputBorder: "#e4d3b4",
    whatsappBg: "#ffffff",
    whatsappText: "#25d366",
    projectNumber: "#6d5646",
  },
  header: {
    brand: "easy builders",
    nav: [
      { id: "nav-uslugi", label: "Usługi", href: "#uslugi" },
      { id: "nav-onas", label: "O nas", href: "#o-nas" },
      { id: "nav-realizacje", label: "Realizacje", href: "#realizacje" },
      { id: "nav-kontakt", label: "Kontakt", href: "#kontakt" },
    ],
  },
  hero: {
    visible: true,
    title: "easy builders",
    subtitle: "INSTALACJE",
    image: photo("photo-1600607687939-ce8a6c25118c", 2000),
    imageAlt: "Jasne wnętrze z dużymi oknami i zielenią za szybą",
  },
  services: {
    visible: true,
    title: "Usługi",
    intro:
      "Sześć zakresów, jedna ekipa. Od ustaleń po uruchomienie: elektryka, woda, klimatyzacja, wentylacja, ogrzewanie i sterowanie domem.",
    items: [
      {
        id: "svc-1",
        number: "01",
        title: "Elektryka",
        description:
          "Rozdzielnice, oświetlenie, gniazda i obwody w domach i mieszkaniach. Prowadzone pod układ pomieszczeń, nie jak wyjdzie na budowie.",
        image: photo("photo-1600210492486-724fe5c67fb0"),
        imageAlt: "Jasny salon z dużymi oknami",
      },
      {
        id: "svc-2",
        number: "02",
        title: "Hydraulika i kanalizacja",
        description:
          "Woda, odpływy i podejścia sanitarne. Szczelnie, ze spadkami i z dostępem w miejscach, do których kiedyś wróci serwis.",
        image: photo("photo-1552321554-5fefe8c9ef14"),
        imageAlt: "Nowoczesna łazienka",
      },
      {
        id: "svc-3",
        number: "03",
        title: "Klimatyzacja",
        description:
          "Dobór i montaż tak, żeby chłodzenie i dogrzewanie było ciche, a urządzenie nie dominowało ściany.",
        image: photo("photo-1618221195710-dd6b41faaea6"),
        imageAlt: "Wnętrze z wysokimi oknami",
      },
      {
        id: "svc-4",
        number: "04",
        title: "Wentylacja i rekuperacja",
        description:
          "Wymiana powietrza z odzyskiem ciepła, liczona pod metraż, liczbę osób i realny sposób użytkowania budynku.",
        image: photo("photo-1600585154340-be6161a56a0c"),
        imageAlt: "Nowoczesny dom z dużymi przeszkleniami",
      },
      {
        id: "svc-5",
        number: "05",
        title: "Ogrzewanie",
        description:
          "Podłogówka, grzejniki i źródło ciepła spięte w jeden układ, który da się ustawić bez instrukcji na półkę.",
        image: photo("photo-1600121848594-d8644e57abab"),
        imageAlt: "Klasyczne wnętrze z kominkiem",
      },
      {
        id: "svc-6",
        number: "06",
        title: "Smart home",
        description:
          "Światło, rolety, ogrzewanie i klimatyzacja w jednym sterowaniu. Tyle automatyki, ile dom naprawdę potrzebuje.",
        image: photo("photo-1600566753190-17f0baa2a6c3"),
        imageAlt: "Nowoczesna kuchnia w zabudowie",
      },
    ],
  },
  about: {
    visible: true,
    bandTitle: "O nas",
    bandText:
      "Pomagamy tworzyć sprawne i funkcjonalne instalacje. Zapewniamy staranne wykonanie, jasną komunikację i sprawną realizację każdego projektu.",
    bandButtonLabel: "Więcej o nas",
    bandButtonHref: "#dlaczego",
    title: "Dlaczego my",
    intro:
      "Easy Builders sp. z o.o. działa we Wrocławiu. Instalacje prowadzimy jako jedną robotę: od tras i ustaleń, przez montaż, po uruchomienie.",
    items: [
      {
        id: "about-1",
        number: "01",
        title: "Kompleksowe podejście",
        description:
          "Elektryka, woda, klimat, wentylacja, ogrzewanie i smart home ustalamy razem. Instalacje nie kolidują ze sobą w ścianie ani w terminie.",
        image: photo("photo-1600566753086-00f18fb6b3ea"),
        imageAlt: "Kuchnia z drewnem i ciepłym światłem",
      },
      {
        id: "about-2",
        number: "02",
        title: "Precyzyjne wykonanie",
        description:
          "Trasy, spadki, podejścia i rozdzielnice robimy tak, jak zostały ustalone. Po zakończeniu zostaje działająca instalacja, nie lista niedoróbek.",
        image: photo("photo-1600489000022-c2086d79f9d4"),
        imageAlt: "Elewacja domu jednorodzinnego",
      },
      {
        id: "about-3",
        number: "03",
        title: "Sprawna realizacja",
        description:
          "Jeden kontakt, jasna kolejność prac i terminy, których da się dotrzymać. Wiadomo, co jest gotowe i kiedy mogą wchodzić kolejne ekipy.",
        image: photo("photo-1600573472592-401b489a3cdc"),
        imageAlt: "Wnętrze domu w trakcie wykończenia",
      },
    ],
  },
  projects: {
    visible: true,
    title: "Realizacje",
    intro: "Wybrane zakresy prac w domach i mieszkaniach.",
    items: [
      {
        id: "prj-1",
        number: "01",
        title: "Dom jednorodzinny",
        description:
          "Komplet instalacji: elektryka, ogrzewanie podłogowe, rekuperacja i przygotowanie pod klimatyzację.",
        image: photo("photo-1600585154526-990dced4db0d"),
        imageAlt: "Biały dom z ogrodem",
      },
      {
        id: "prj-2",
        number: "02",
        title: "Mieszkanie",
        description:
          "Nowa hydraulika i kanalizacja, rozdzielnica oraz oświetlenie prowadzone bez zbędnego rozkuwania.",
        image: photo("photo-1505691938895-1758d7feb511"),
        imageAlt: "Salon w mieszkaniu",
      },
      {
        id: "prj-3",
        number: "03",
        title: "Zabudowa szeregowa",
        description: "Wentylacja z odzyskiem ciepła i ogrzewanie ustawiane strefami.",
        image: photo("photo-1600210492493-0946911123ea"),
        imageAlt: "Jasne wnętrze szeregowca",
      },
      {
        id: "prj-4",
        number: "04",
        title: "Apartament",
        description: "Klimatyzacja, rolety i oświetlenie zebrane w jednym sterowaniu.",
        image: photo("photo-1560185007-cde436f6a4d0"),
        imageAlt: "Nowoczesny apartament",
      },
    ],
  },
  contact: {
    visible: true,
    brand: "easy builders",
    subtitle: "INSTALACJE",
    tagline: "Wiodąca firma instalacyjna w Twojej okolicy.",
    companyName: "Easy Builders sp. z o.o.",
    street: "Plac Świętego Macieja 7/6",
    postalCode: "50-244",
    city: "Wrocław",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Plac%20%C5%9Awi%C4%99tego%20Macieja%207%2F6%2C%2050-244%20Wroc%C5%82aw",
    phone: "+48 570 080 088",
    phoneLabel: "+48 570 080 088",
    phone2: "+48 661 304 330",
    phone2Label: "+48 661 304 330",
    email: "biuro@easybuilders.pl",
    emailLabel: "E-mail",
    facebookUrl: "https://www.facebook.com/share/1GsEgY9Tew/?mibextid=wwXIfr",
    facebookLabel: "Facebook",
    instagramUrl: "https://www.instagram.com/easy.builders/",
    instagramLabel: "Instagram",
    whatsappNumber: "+48 570 080 088",
    whatsappLabel: "WhatsApp",
    formTitle: "Napisz do nas",
    formNameLabel: "Imię",
    formEmailLabel: "E-mail",
    formMessageLabel: "Treść wiadomości",
    formSubmitLabel: "Wyślij",
    formSuccess: "Dziękujemy. Wiadomość została wysłana.",
    formNote:
      "Wysyłając wiadomość, przekazujesz imię i adres e-mail wyłącznie po to, żebyśmy mogli odpowiedzieć.",
  },
  seo: {
    title: "Easy Builders — instalacje we Wrocławiu",
    description:
      "Elektryka, hydraulika, klimatyzacja, wentylacja, ogrzewanie i smart home. Easy Builders sp. z o.o., Plac Świętego Macieja 7/6, Wrocław.",
  },
};
