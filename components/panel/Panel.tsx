"use client";

import { FormEvent, useEffect, useId, useState } from "react";
import { defaultContent } from "@/lib/default-content";
import { blankAbout, blankNav, blankProject, blankService, moveItem } from "@/lib/factories";
import { mapsLink } from "@/lib/links";
import { sanitizeContent } from "@/lib/sanitize";
import { colorFields } from "@/lib/theme";
import type { AboutItem, Colors, InboxMessage, NavItem, ProjectItem, ServiceItem, SiteContent } from "@/lib/types";
import "./panel.css";

type TabId = "colors" | "header" | "hero" | "services" | "about" | "projects" | "contact" | "seo" | "messages";

const tabs: { id: TabId; label: string }[] = [
  { id: "colors", label: "Kolory" },
  { id: "header", label: "Nagłówek" },
  { id: "hero", label: "Hero" },
  { id: "services", label: "Usługi" },
  { id: "about", label: "O nas" },
  { id: "projects", label: "Realizacje" },
  { id: "contact", label: "Kontakt" },
  { id: "seo", label: "SEO" },
  { id: "messages", label: "Wiadomości" },
];

async function readError(response: Response) {
  const data = (await response.json().catch(() => null)) as { error?: string } | null;
  return data?.error || "Nie udało się wykonać operacji.";
}

async function fileToDataUrl(file: File, large: boolean) {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
    throw new Error("Użyj pliku JPG, PNG albo WEBP.");
  }
  const bitmap = await createImageBitmap(file);
  const maxSide = large ? 1800 : 1200;
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Nie udało się odczytać zdjęcia.");
  context.fillStyle = "#f4e6c8";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const limit = large ? 320_000 : 180_000;
  let quality = 0.72;
  let url = canvas.toDataURL("image/jpeg", quality);
  while (url.length > limit && quality > 0.42) {
    quality -= 0.08;
    url = canvas.toDataURL("image/jpeg", quality);
  }
  if (url.length > limit + 40_000) {
    throw new Error("To zdjęcie jest za ciężkie. Wklej adres URL albo wybierz mniejszy plik.");
  }
  return url;
}

function Field({
  label,
  value,
  onChange,
  hint,
  rows,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  rows?: number;
}) {
  const id = useId();
  return (
    <label className="pf" htmlFor={id}>
      <span>{label}</span>
      {rows ? (
        <textarea id={id} rows={rows} value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input id={id} value={value} onChange={(event) => onChange(event.target.value)} />
      )}
      {hint ? <small className="hint">{hint}</small> : null}
    </label>
  );
}

function ImageField({
  image,
  alt,
  onImage,
  onAlt,
  large,
}: {
  image: string;
  alt: string;
  onImage: (value: string) => void;
  onAlt: (value: string) => void;
  large?: boolean;
}) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError("");
    setBusy(true);
    try {
      onImage(await fileToDataUrl(file, Boolean(large)));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Nie udało się wgrać zdjęcia.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {image ? <img className="img-preview" src={image} alt="" /> : <div className="img-preview" />}
      <Field label="Adres zdjęcia" value={image.startsWith("data:") ? "" : image} onChange={onImage} hint="Wklej adres https albo wgraj plik. Puste pole usuwa zdjęcie." />
      <label className="pf">
        <span>{busy ? "Zmniejszam zdjęcie…" : "Wgraj plik"}</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            void onFile(file);
          }}
        />
      </label>
      <Field label="Opis zdjęcia (alt)" value={alt} onChange={onAlt} />
      {image ? (
        <button type="button" className="p-text-btn p-danger" onClick={() => onImage("")}>
          Usuń zdjęcie
        </button>
      ) : null}
      {error ? <p className="p-notice bad">{error}</p> : null}
    </div>
  );
}

function ItemActions({
  index,
  total,
  onUp,
  onDown,
  onRemove,
}: {
  index: number;
  total: number;
  onUp: () => void;
  onDown: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="p-actions">
      <button type="button" disabled={index === 0} onClick={onUp}>
        Wyżej
      </button>
      <button type="button" disabled={index === total - 1} onClick={onDown}>
        Niżej
      </button>
      <button
        type="button"
        className="p-danger"
        onClick={() => {
          if (window.confirm("Usunąć tę pozycję?")) onRemove();
        }}
      >
        Usuń
      </button>
    </div>
  );
}

export function Panel() {
  const [phase, setPhase] = useState<"loading" | "login" | "ready">("loading");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [baseline, setBaseline] = useState("");
  const [tab, setTab] = useState<TabId>("colors");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [noticeOk, setNoticeOk] = useState(false);
  const [saving, setSaving] = useState(false);
  const [db, setDb] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [messages, setMessages] = useState<InboxMessage[] | null>(null);
  const [messageError, setMessageError] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);

  const dirty = content ? JSON.stringify(content) !== baseline : false;

  function apply(data: { content: SiteContent; updatedAt: string | null; db: boolean }) {
    const clean = sanitizeContent(data.content);
    setContent(clean);
    setBaseline(JSON.stringify(clean));
    setDb(Boolean(data.db));
    setUpdatedAt(data.updatedAt ?? null);
    setPhase("ready");
  }

  async function pull() {
    const response = await fetch("/api/admin/content", { cache: "no-store" });
    if (response.status === 401) {
      setPhase("login");
      return;
    }
    const data = (await response.json().catch(() => null)) as { content?: SiteContent; updatedAt?: string | null; db?: boolean; error?: string } | null;
    if (!response.ok || !data?.content) {
      setError(data?.error || "Nie udało się wczytać treści.");
      setPhase("login");
      return;
    }
    apply({ content: data.content, updatedAt: data.updatedAt ?? null, db: Boolean(data.db) });
  }

  useEffect(() => {
    let cancelled = false;
    pull()
      .catch(() => {
        if (!cancelled) {
          setError("Nie udało się wczytać panelu.");
          setPhase("login");
        }
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  useEffect(() => {
    if (tab !== "messages" || phase !== "ready") return;
    let cancelled = false;
    setMessageError("");
    fetch("/api/admin/messages", { cache: "no-store" })
      .then(async (response) => {
        const data = (await response.json().catch(() => null)) as { messages?: InboxMessage[]; error?: string } | null;
        if (cancelled) return;
        if (!response.ok) {
          setMessages([]);
          setMessageError(data?.error || "Nie udało się pobrać wiadomości.");
          return;
        }
        setMessages(data?.messages ?? []);
      })
      .catch(() => {
        if (!cancelled) setMessageError("Nie udało się pobrać wiadomości.");
      });
    return () => {
      cancelled = true;
    };
  }, [tab, phase]);

  async function onLogin(event: FormEvent) {
    event.preventDefault();
    setLoginBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        setError(await readError(response));
        return;
      }
      setPassword("");
      await pull();
    } catch {
      setError("Nie udało się zalogować.");
    } finally {
      setLoginBusy(false);
    }
  }

  async function onSave() {
    if (!content) return;
    setSaving(true);
    setNotice("");
    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = (await response.json().catch(() => null)) as { content?: SiteContent; updatedAt?: string | null; error?: string } | null;
      if (!response.ok || !data?.content) {
        setNoticeOk(false);
        setNotice(data?.error || "Nie udało się zapisać.");
        return;
      }
      apply({ content: data.content, updatedAt: data.updatedAt ?? null, db: true });
      setNoticeOk(true);
      setNotice("Zapisano w Neon. Odśwież podgląd strony, żeby zobaczyć zmiany.");
    } catch {
      setNoticeOk(false);
      setNotice("Nie udało się zapisać.");
    } finally {
      setSaving(false);
    }
  }

  async function onLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setContent(null);
    setPhase("login");
  }

  function restore(key: keyof SiteContent) {
    if (!window.confirm("Przywrócić wzór tej sekcji? Zapis do bazy nastąpi dopiero po kliknięciu „Zapisz zmiany”.")) return;
    setContent((current) => (current ? { ...current, [key]: structuredClone(defaultContent[key]) } : current));
  }

  function downloadCopy() {
    if (!content) return;
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "easy-builders-tresc.json";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  async function importCopy(file: File | undefined) {
    if (!file) return;
    try {
      const raw = JSON.parse(await file.text()) as { content?: unknown; colors?: unknown };
      const candidate = raw && typeof raw === "object" && "colors" in raw ? raw : raw?.content;
      if (!candidate || typeof candidate !== "object" || !("colors" in candidate) || !("hero" in (candidate as object))) {
        throw new Error("Ten plik nie wygląda jak kopia treści Easy Builders.");
      }
      if (!window.confirm("Zastąpić bieżącą treść w panelu danymi z pliku? Zapis do bazy nastąpi dopiero po kliknięciu „Zapisz zmiany”.")) return;
      setContent(sanitizeContent(candidate));
      setNoticeOk(true);
      setNotice("Wczytano plik. Kliknij „Zapisz zmiany”, żeby trafił do Neon.");
    } catch (reason) {
      setNoticeOk(false);
      setNotice(reason instanceof Error ? reason.message : "Nie udało się wczytać pliku.");
    }
  }

  if (phase === "loading") {
    return <main className="login"><p className="p-loading">Wczytywanie…</p></main>;
  }

  if (phase === "login" || !content) {
    return (
      <main className="login">
        <form onSubmit={onLogin}>
          <p className="login-brand">easy builders</p>
          <h1>Panel</h1>
          <label className="pf">
            <span>Hasło</span>
            <input
              type="password"
              value={password}
              autoFocus
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {error ? <p role="alert">{error}</p> : null}
          <button type="submit" disabled={loginBusy}>
            {loginBusy ? "Sprawdzam…" : "Wejdź"}
          </button>
        </form>
      </main>
    );
  }

  const savedLabel = updatedAt
    ? new Date(updatedAt).toLocaleString("pl-PL", { dateStyle: "medium", timeStyle: "short" })
    : "jeszcze nie zapisano";

  return (
    <div className="panel-shell">
      <aside className="panel-side">
        <p className="panel-brand">
          easy builders
          <span>Panel</span>
        </p>
        <div className="p-nav">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-current={tab === item.id ? "page" : undefined}
              onClick={() => {
                setTab(item.id);
                window.scrollTo(0, 0);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="p-side-actions">
          <a className="p-side-link" href="/" target="_blank" rel="noreferrer">
            Podgląd strony
          </a>
          <button type="button" className="p-side-link" onClick={downloadCopy}>
            Pobierz kopię JSON
          </button>
          <label className="p-side-link">
            Wgraj kopię JSON
            <input
              type="file"
              accept="application/json"
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                void importCopy(file);
              }}
            />
          </label>
          <button type="button" className="p-logout" onClick={() => void onLogout()}>
            Wyloguj
          </button>
        </div>
      </aside>

      <div className="panel-main">
        <h2>{tabs.find((item) => item.id === tab)?.label}</h2>
        <p className="lede">
          Każdy tekst, zdjęcie, przycisk i kolor zapisuje się w Neon i od razu jest treścią strony. Kolory zmieniają stronę, nie ten panel.
        </p>
        {!db ? (
          <p className="p-banner">
            Baza Neon nie jest podłączona. Ustaw DATABASE_URL na Vercelu i zrób redeploy. Bez tego da się oglądać wzór, ale nie da się go zapisać.
          </p>
        ) : null}

        {tab === "colors" ? <ColorsTab content={content} setContent={setContent} /> : null}
        {tab === "header" ? <HeaderTab content={content} setContent={setContent} /> : null}
        {tab === "hero" ? <HeroTab content={content} setContent={setContent} /> : null}
        {tab === "services" ? <ServicesTab content={content} setContent={setContent} /> : null}
        {tab === "about" ? <AboutTab content={content} setContent={setContent} /> : null}
        {tab === "projects" ? <ProjectsTab content={content} setContent={setContent} /> : null}
        {tab === "contact" ? <ContactTab content={content} setContent={setContent} /> : null}
        {tab === "seo" ? <SeoTab content={content} setContent={setContent} /> : null}
        {tab === "messages" ? (
          <MessagesTab
            messages={messages}
            error={messageError}
            onDelete={async (id) => {
              const response = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
              if (!response.ok) {
                setMessageError(await readError(response));
                return;
              }
              setMessages((current) => current?.filter((item) => item.id !== id) ?? current);
            }}
          />
        ) : (
          <button type="button" className="p-text-btn" onClick={() => restore(tab === "header" ? "header" : tab)}>
            Przywróć wzór tej sekcji
          </button>
        )}
      </div>

      <div className="p-savebar">
        <div>
          <div>Ostatni zapis: {savedLabel}</div>
          {notice ? <div className={noticeOk ? "p-notice ok" : "p-notice bad"}>{notice}</div> : null}
          {dirty ? <div>Masz niezapisane zmiany.</div> : null}
        </div>
        <button type="button" className="p-save" disabled={!dirty || saving || !db} onClick={() => void onSave()}>
          {saving ? "Zapisuję…" : "Zapisz zmiany"}
        </button>
      </div>
    </div>
  );
}

function ColorsTab({ content, setContent }: { content: SiteContent; setContent: (value: SiteContent) => void }) {
  const groups: string[] = [];
  colorFields.forEach((field) => {
    if (!groups.includes(field.group)) groups.push(field.group);
  });

  function commit(key: keyof Colors, raw: string) {
    let value = raw.trim();
    if (/^[0-9a-fA-F]{6}$/.test(value)) value = `#${value}`;
    if (/^#[0-9a-fA-F]{6}$/.test(value)) {
      setContent({ ...content, colors: { ...content.colors, [key]: value.toLowerCase() } });
    }
  }

  return (
    <div>
      {groups.map((group) => (
        <section key={group}>
          <h3 className="p-group">{group}</h3>
          <div className="color-grid">
            {colorFields
              .filter((field) => field.group === group)
              .map((field) => (
                <label className="color-row" key={field.key}>
                  <span>{field.label}</span>
                  <span className="color-controls">
                    <input
                      type="color"
                      value={content.colors[field.key]}
                      onChange={(event) => commit(field.key, event.target.value)}
                      aria-label={field.label}
                    />
                    <input
                      type="text"
                      key={content.colors[field.key]}
                      defaultValue={content.colors[field.key]}
                      spellCheck={false}
                      onBlur={(event) => commit(field.key, event.target.value)}
                      aria-label={`${field.label}, kod hex`}
                    />
                  </span>
                </label>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function HeaderTab({ content, setContent }: { content: SiteContent; setContent: (value: SiteContent) => void }) {
  const nav = content.header.nav;
  function update(next: NavItem[]) {
    setContent({ ...content, header: { ...content.header, nav: next } });
  }
  return (
    <div>
      <Field
        label="Napis po lewej stronie paska"
        value={content.header.brand}
        onChange={(brand) => setContent({ ...content, header: { ...content.header, brand } })}
        hint="Na stronie stoi po lewej stronie brązowego paska. Zostaw puste, żeby go schować."
      />
      {nav.map((item, index) => (
        <div className="p-item" key={item.id}>
          <Field label="Nazwa w menu" value={item.label} onChange={(label) => update(nav.map((entry) => (entry.id === item.id ? { ...entry, label } : entry)))} />
          <Field label="Cel linku" value={item.href} onChange={(href) => update(nav.map((entry) => (entry.id === item.id ? { ...entry, href } : entry)))} hint="Np. #uslugi, #o-nas, #realizacje, #kontakt" />
          <ItemActions
            index={index}
            total={nav.length}
            onUp={() => update(moveItem(nav, index, -1))}
            onDown={() => update(moveItem(nav, index, 1))}
            onRemove={() => update(nav.filter((entry) => entry.id !== item.id))}
          />
        </div>
      ))}
      <button type="button" className="p-add" onClick={() => update([...nav, blankNav()])}>
        Dodaj link
      </button>
    </div>
  );
}

function HeroTab({ content, setContent }: { content: SiteContent; setContent: (value: SiteContent) => void }) {
  const hero = content.hero;
  function patch(next: Partial<typeof hero>) {
    setContent({ ...content, hero: { ...hero, ...next } });
  }
  return (
    <div>
      <label className="toggle">
        <input type="checkbox" checked={hero.visible} onChange={(event) => patch({ visible: event.target.checked })} />
        Widoczny na stronie
      </label>
      <Field label="Duży napis" value={hero.title} onChange={(title) => patch({ title })} />
      <Field label="Podpis pod napisem" value={hero.subtitle} onChange={(subtitle) => patch({ subtitle })} />
      <ImageField large image={hero.image} alt={hero.imageAlt} onImage={(image) => patch({ image })} onAlt={(imageAlt) => patch({ imageAlt })} />
    </div>
  );
}

function ServicesTab({ content, setContent }: { content: SiteContent; setContent: (value: SiteContent) => void }) {
  const services = content.services;
  function patch(next: Partial<typeof services>) {
    setContent({ ...content, services: { ...services, ...next } });
  }
  function update(items: ServiceItem[]) {
    patch({ items });
  }
  return (
    <div>
      <label className="toggle">
        <input type="checkbox" checked={services.visible} onChange={(event) => patch({ visible: event.target.checked })} />
        Widoczna na stronie
      </label>
      <Field label="Nagłówek" value={services.title} onChange={(title) => patch({ title })} />
      <Field label="Wstęp" value={services.intro} onChange={(intro) => patch({ intro })} rows={4} />
      {services.items.map((item, index) => (
        <div className="p-item" key={item.id}>
          <Field label="Numer" value={item.number} onChange={(number) => update(services.items.map((entry) => (entry.id === item.id ? { ...entry, number } : entry)))} />
          <Field label="Nazwa" value={item.title} onChange={(title) => update(services.items.map((entry) => (entry.id === item.id ? { ...entry, title } : entry)))} />
          <Field label="Opis" value={item.description} rows={4} onChange={(description) => update(services.items.map((entry) => (entry.id === item.id ? { ...entry, description } : entry)))} />
          <ImageField
            image={item.image}
            alt={item.imageAlt}
            onImage={(image) => update(services.items.map((entry) => (entry.id === item.id ? { ...entry, image } : entry)))}
            onAlt={(imageAlt) => update(services.items.map((entry) => (entry.id === item.id ? { ...entry, imageAlt } : entry)))}
          />
          <ItemActions index={index} total={services.items.length} onUp={() => update(moveItem(services.items, index, -1))} onDown={() => update(moveItem(services.items, index, 1))} onRemove={() => update(services.items.filter((entry) => entry.id !== item.id))} />
        </div>
      ))}
      <button type="button" className="p-add" onClick={() => update([...services.items, blankService()])}>
        Dodaj usługę
      </button>
    </div>
  );
}

function AboutTab({ content, setContent }: { content: SiteContent; setContent: (value: SiteContent) => void }) {
  const about = content.about;
  function patch(next: Partial<typeof about>) {
    setContent({ ...content, about: { ...about, ...next } });
  }
  function update(items: AboutItem[]) {
    patch({ items });
  }
  return (
    <div>
      <label className="toggle">
        <input type="checkbox" checked={about.visible} onChange={(event) => patch({ visible: event.target.checked })} />
        Widoczna na stronie
      </label>
      <Field label="Tytuł w brązowym pasie" value={about.bandTitle} onChange={(bandTitle) => patch({ bandTitle })} />
      <Field label="Tekst w brązowym pasie" value={about.bandText} onChange={(bandText) => patch({ bandText })} rows={5} />
      <Field label="Przycisk w pasie" value={about.bandButtonLabel} onChange={(bandButtonLabel) => patch({ bandButtonLabel })} />
      <Field label="Cel przycisku" value={about.bandButtonHref} onChange={(bandButtonHref) => patch({ bandButtonHref })} hint="Domyślnie #dlaczego, czyli blok poniżej." />
      <Field label="Nagłówek pod pasem" value={about.title} onChange={(title) => patch({ title })} />
      <Field label="Wstęp" value={about.intro} onChange={(intro) => patch({ intro })} rows={4} />
      {about.items.map((item, index) => (
        <div className="p-item" key={item.id}>
          <Field label="Numer" value={item.number} onChange={(number) => update(about.items.map((entry) => (entry.id === item.id ? { ...entry, number } : entry)))} />
          <Field label="Tytuł" value={item.title} onChange={(title) => update(about.items.map((entry) => (entry.id === item.id ? { ...entry, title } : entry)))} />
          <Field label="Opis" value={item.description} rows={4} onChange={(description) => update(about.items.map((entry) => (entry.id === item.id ? { ...entry, description } : entry)))} />
          <ImageField
            image={item.image}
            alt={item.imageAlt}
            onImage={(image) => update(about.items.map((entry) => (entry.id === item.id ? { ...entry, image } : entry)))}
            onAlt={(imageAlt) => update(about.items.map((entry) => (entry.id === item.id ? { ...entry, imageAlt } : entry)))}
          />
          <ItemActions index={index} total={about.items.length} onUp={() => update(moveItem(about.items, index, -1))} onDown={() => update(moveItem(about.items, index, 1))} onRemove={() => update(about.items.filter((entry) => entry.id !== item.id))} />
        </div>
      ))}
      <button type="button" className="p-add" onClick={() => update([...about.items, blankAbout()])}>
        Dodaj punkt
      </button>
    </div>
  );
}

function ProjectsTab({ content, setContent }: { content: SiteContent; setContent: (value: SiteContent) => void }) {
  const projects = content.projects;
  function patch(next: Partial<typeof projects>) {
    setContent({ ...content, projects: { ...projects, ...next } });
  }
  function update(items: ProjectItem[]) {
    patch({ items });
  }
  return (
    <div>
      <label className="toggle">
        <input type="checkbox" checked={projects.visible} onChange={(event) => patch({ visible: event.target.checked })} />
        Widoczna na stronie
      </label>
      <Field label="Nagłówek" value={projects.title} onChange={(title) => patch({ title })} />
      <Field label="Wstęp" value={projects.intro} onChange={(intro) => patch({ intro })} rows={3} />
      {projects.items.map((item, index) => (
        <div className="p-item" key={item.id}>
          <Field label="Numer" value={item.number} onChange={(number) => update(projects.items.map((entry) => (entry.id === item.id ? { ...entry, number } : entry)))} />
          <Field label="Tytuł" value={item.title} onChange={(title) => update(projects.items.map((entry) => (entry.id === item.id ? { ...entry, title } : entry)))} />
          <Field label="Opis" value={item.description} rows={4} onChange={(description) => update(projects.items.map((entry) => (entry.id === item.id ? { ...entry, description } : entry)))} />
          <ImageField
            image={item.image}
            alt={item.imageAlt}
            onImage={(image) => update(projects.items.map((entry) => (entry.id === item.id ? { ...entry, image } : entry)))}
            onAlt={(imageAlt) => update(projects.items.map((entry) => (entry.id === item.id ? { ...entry, imageAlt } : entry)))}
          />
          <ItemActions index={index} total={projects.items.length} onUp={() => update(moveItem(projects.items, index, -1))} onDown={() => update(moveItem(projects.items, index, 1))} onRemove={() => update(projects.items.filter((entry) => entry.id !== item.id))} />
        </div>
      ))}
      <button type="button" className="p-add" onClick={() => update([...projects.items, blankProject()])}>
        Dodaj realizację
      </button>
    </div>
  );
}

function ContactTab({ content, setContent }: { content: SiteContent; setContent: (value: SiteContent) => void }) {
  const contact = content.contact;
  function patch(next: Partial<typeof contact>) {
    setContent({ ...content, contact: { ...contact, ...next } });
  }
  return (
    <div>
      <p className="p-banner">
        Tu zmieniasz telefon, e-mail, Facebook, Instagram, WhatsApp i adres, na który Resend wysyła formularz. Puste pole ukrywa dany przycisk.
      </p>
      <label className="toggle">
        <input type="checkbox" checked={contact.visible} onChange={(event) => patch({ visible: event.target.checked })} />
        Stopka z kontaktem widoczna na stronie
      </label>
      <Field label="Napis w stopce" value={contact.brand} onChange={(brand) => patch({ brand })} />
      <Field label="Podtytuł w stopce" value={contact.subtitle} onChange={(subtitle) => patch({ subtitle })} />
      <Field label="Hasło pod nazwą" value={contact.tagline} onChange={(tagline) => patch({ tagline })} rows={3} />
      <Field label="Nazwa firmy" value={contact.companyName} onChange={(companyName) => patch({ companyName })} />
      <Field label="Ulica i numer" value={contact.street} onChange={(street) => patch({ street })} />
      <Field label="Kod pocztowy" value={contact.postalCode} onChange={(postalCode) => patch({ postalCode })} />
      <Field label="Miasto" value={contact.city} onChange={(city) => patch({ city })} />
      <Field label="Link do mapy" value={contact.mapsUrl} onChange={(mapsUrl) => patch({ mapsUrl })} />
      <button
        type="button"
        className="p-text-btn"
        onClick={() => patch({ mapsUrl: mapsLink(contact.street, contact.postalCode, contact.city) })}
      >
        Ustaw mapę z adresu
      </button>
      <Field label="Numer telefonu" value={contact.phone} onChange={(phone) => patch({ phone })} hint="Przycisk jest w stopce i nie jedzie za scrollem. Puste pole ukrywa przycisk." />
      <Field label="Etykieta przycisku telefonu" value={contact.phoneLabel} onChange={(phoneLabel) => patch({ phoneLabel })} />
      <Field label="E-mail" value={contact.email} onChange={(email) => patch({ email })} />
      <Field label="Etykieta przycisku e-mail" value={contact.emailLabel} onChange={(emailLabel) => patch({ emailLabel })} />
      <Field label="Facebook, pełny adres" value={contact.facebookUrl} onChange={(facebookUrl) => patch({ facebookUrl })} hint="Puste pole ukrywa przycisk. Przycisk zostaje w stopce." />
      <Field label="Etykieta Facebook" value={contact.facebookLabel} onChange={(facebookLabel) => patch({ facebookLabel })} />
      <Field label="Instagram, pełny adres" value={contact.instagramUrl} onChange={(instagramUrl) => patch({ instagramUrl })} />
      <Field label="Etykieta Instagram" value={contact.instagramLabel} onChange={(instagramLabel) => patch({ instagramLabel })} />
      <Field
        label="Numer WhatsApp"
        value={contact.whatsappNumber}
        onChange={(whatsappNumber) => patch({ whatsappNumber })}
        hint="Numer z kierunkowym, np. +48 570 080 088. Ten przycisk jest przypięty do rogu i jedzie ze scrollem. Puste pole go chowa."
      />
      <Field label="Etykieta WhatsApp" value={contact.whatsappLabel} onChange={(whatsappLabel) => patch({ whatsappLabel })} />
      <Field label="Tytuł formularza" value={contact.formTitle} onChange={(formTitle) => patch({ formTitle })} />
      <Field label="Etykieta pola imienia" value={contact.formNameLabel} onChange={(formNameLabel) => patch({ formNameLabel })} />
      <Field label="Etykieta pola e-mail" value={contact.formEmailLabel} onChange={(formEmailLabel) => patch({ formEmailLabel })} />
      <Field label="Etykieta treści" value={contact.formMessageLabel} onChange={(formMessageLabel) => patch({ formMessageLabel })} />
      <Field label="Napis na przycisku wysyłki" value={contact.formSubmitLabel} onChange={(formSubmitLabel) => patch({ formSubmitLabel })} />
      <Field label="Komunikat po wysłaniu" value={contact.formSuccess} onChange={(formSuccess) => patch({ formSuccess })} rows={3} />
      <Field label="Dopisek pod formularzem" value={contact.formNote} onChange={(formNote) => patch({ formNote })} rows={3} />
    </div>
  );
}

function SeoTab({ content, setContent }: { content: SiteContent; setContent: (value: SiteContent) => void }) {
  return (
    <div>
      <Field label="Tytuł w karcie przeglądarki" value={content.seo.title} onChange={(title) => setContent({ ...content, seo: { ...content.seo, title } })} />
      <Field label="Opis dla Google" value={content.seo.description} rows={4} onChange={(description) => setContent({ ...content, seo: { ...content.seo, description } })} />
    </div>
  );
}

function MessagesTab({
  messages,
  error,
  onDelete,
}: {
  messages: InboxMessage[] | null;
  error: string;
  onDelete: (id: number) => Promise<void>;
}) {
  if (error) return <p className="p-notice bad">{error}</p>;
  if (!messages) return <p>Wczytywanie wiadomości…</p>;
  if (!messages.length) return <p>Brak wiadomości.</p>;
  return (
    <div>
      {messages.map((message) => (
        <article className="p-item msg" key={message.id}>
          <p className="msg-meta">
            {new Date(message.createdAt).toLocaleString("pl-PL", { dateStyle: "medium", timeStyle: "short" })} · {message.name} · {message.email}
          </p>
          <p>{message.body}</p>
          <div className="p-actions">
            <a href={`mailto:${message.email}?subject=${encodeURIComponent("Easy Builders")}`}>Odpowiedz</a>
            <button
              type="button"
              className="p-danger"
              onClick={() => {
                if (window.confirm("Usunąć tę wiadomość?")) void onDelete(message.id);
              }}
            >
              Usuń
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
