export type NavItem = {
  id: string;
  label: string;
  href: string;
};

export type ServiceItem = {
  id: string;
  number: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
};

export type AboutItem = {
  id: string;
  number: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
};

export type ProjectItem = {
  id: string;
  number: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
};

export type Colors = {
  headerBg: string;
  headerText: string;
  headerBrand: string;
  pageBg: string;
  heading: string;
  text: string;
  muted: string;
  serviceTitle: string;
  heroText: string;
  heroScrim: string;
  bandBg: string;
  bandText: string;
  cardBg: string;
  cardText: string;
  cardNumber: string;
  lineButtonText: string;
  lineButtonBorder: string;
  lineButtonHoverText: string;
  solidButtonBg: string;
  solidButtonText: string;
  footerBg: string;
  footerText: string;
  footerMuted: string;
  inputBg: string;
  inputText: string;
  inputBorder: string;
  whatsappBg: string;
  whatsappText: string;
  projectNumber: string;
};

export type SiteContent = {
  colors: Colors;
  header: {
    brand: string;
    nav: NavItem[];
  };
  hero: {
    visible: boolean;
    title: string;
    subtitle: string;
    image: string;
    imageAlt: string;
  };
  services: {
    visible: boolean;
    title: string;
    intro: string;
    items: ServiceItem[];
  };
  about: {
    visible: boolean;
    bandTitle: string;
    bandText: string;
    bandButtonLabel: string;
    bandButtonHref: string;
    title: string;
    intro: string;
    items: AboutItem[];
  };
  projects: {
    visible: boolean;
    title: string;
    intro: string;
    items: ProjectItem[];
  };
  contact: {
    visible: boolean;
    brand: string;
    subtitle: string;
    tagline: string;
    companyName: string;
    street: string;
    postalCode: string;
    city: string;
    mapsUrl: string;
    phone: string;
    phoneLabel: string;
    phone2: string;
    phone2Label: string;
    email: string;
    emailLabel: string;
    facebookUrl: string;
    facebookLabel: string;
    instagramUrl: string;
    instagramLabel: string;
    whatsappNumber: string;
    whatsappLabel: string;
    formTitle: string;
    formNameLabel: string;
    formEmailLabel: string;
    formMessageLabel: string;
    formSubmitLabel: string;
    formSuccess: string;
    formNote: string;
  };
  seo: {
    title: string;
    description: string;
  };
};

export type InboxMessage = {
  id: number;
  name: string;
  email: string;
  body: string;
  createdAt: string;
};
