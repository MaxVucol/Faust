import type { Locale } from "./config";

/**
 * Text for the informational pages linked from the footer. Kept to what the site actually does:
 * no online payment yet, what data the forms and cookies store. Business details (company name,
 * refund terms, legal wording) should be reviewed before launch.
 */
export type InfoSection = { title: string; body: string[] };
export type InfoPage = { title: string; description: string; intro: string; sections: InfoSection[] };
export type InfoPageKey = "delivery" | "privacy" | "terms";

export const INFO_PAGE_ROUTES: Record<InfoPageKey, string> = {
  delivery: "/livrare-si-plata",
  privacy: "/confidentialitate",
  terms: "/termeni",
};

export const infoPages: Record<Locale, Record<InfoPageKey, InfoPage>> = {
  ro: {
    delivery: {
      title: "Livrare și plată",
      description: "Cum primești jocurile cumpărate de la The Iron Vault și cum se face plata.",
      intro: "Toate produsele din magazin sunt digitale: primești o cheie de activare, nu un disc sau o cutie.",
      sections: [
        {
          title: "Livrare",
          body: [
            "Cheia de activare se trimite pe adresa de email indicată la comandă, după confirmarea plății.",
            "Nu există livrare fizică și nici costuri de transport.",
          ],
        },
        {
          title: "Plată",
          body: [
            "Plata online nu este încă disponibilă, așa că pe site nu se fac plăți. Trimiți comanda din coș, te contactăm pentru confirmare, iar plata se face după confirmare.",
            "Prețurile sunt stabilite în lei moldovenești (MDL). Afișarea în alte valute (RON, EUR, USD, RUB) folosește un curs de referință fix și are doar rol informativ.",
          ],
        },
        {
          title: "Întrebări",
          body: ["Pentru orice problemă legată de o comandă sau o cheie, scrie-ne prin pagina de contact."],
        },
      ],
    },
    privacy: {
      title: "Politica de confidențialitate",
      description: "Ce date colectează The Iron Vault, de ce și cum le poți șterge.",
      intro: "Colectăm doar datele de care avem nevoie pentru a procesa comenzile, a răspunde mesajelor și a trimite newsletterul.",
      sections: [
        {
          title: "Comenzi",
          body: ["Când trimiți o comandă, primim numele, telefonul, emailul, comentariul și jocurile din coș, ca să te contactăm pentru confirmare și plată."],
        },
        {
          title: "Formularul de contact",
          body: ["Când ne scrii, păstrăm numele, adresa de email, subiectul și mesajul, ca să îți putem răspunde."],
        },
        {
          title: "Newsletter",
          body: ["Dacă te abonezi, păstrăm adresa de email până când ne ceri să o ștergem."],
        },
        {
          title: "Cookie-uri și stocare locală",
          body: [
            "Folosim trei cookie-uri funcționale, valabile un an: limba (lang), valuta (currency) și lista jocurilor tale favorite (favorites).",
            "Coșul de cumpărături este salvat în browserul tău (localStorage); conținutul lui ne este trimis doar când trimiți o comandă.",
            "Nu folosim cookie-uri de publicitate sau de urmărire.",
          ],
        },
        {
          title: "Drepturile tale",
          body: ["Poți cere oricând accesul la datele tale sau ștergerea lor, scriindu-ne prin pagina de contact."],
        },
      ],
    },
    terms: {
      title: "Termeni și condiții",
      description: "Regulile de utilizare a magazinului The Iron Vault.",
      intro: "Folosind site-ul, accepți termenii de mai jos.",
      sections: [
        {
          title: "Produse",
          body: [
            "Magazinul vinde chei digitale de activare pentru jocuri video. Informațiile despre fiecare joc (platforme, cerințe de sistem, dată de lansare) sunt afișate pe pagina lui.",
          ],
        },
        {
          title: "Prețuri",
          body: [
            "Prețul de referință este cel în lei moldovenești. Conversia în alte valute este orientativă.",
            "Reducerile sunt valabile până la data afișată lângă preț.",
          ],
        },
        {
          title: "Comenzi",
          body: ["Comanda trimisă din coș ajunge la noi ca cerere de comandă. Te contactăm pentru confirmare, iar plata se face după aceea; plata online nu este încă disponibilă."],
        },
        {
          title: "Contact",
          body: ["Pentru întrebări despre acești termeni, scrie-ne prin pagina de contact."],
        },
      ],
    },
  },
  ru: {
    delivery: {
      title: "Доставка и оплата",
      description: "Как вы получаете игры, купленные в The Iron Vault, и как проходит оплата.",
      intro: "Все товары в магазине цифровые: вы получаете ключ активации, а не диск или коробку.",
      sections: [
        {
          title: "Доставка",
          body: [
            "Ключ активации отправляется на email, указанный при заказе, после подтверждения оплаты.",
            "Физической доставки нет, поэтому нет и расходов на пересылку.",
          ],
        },
        {
          title: "Оплата",
          body: [
            "Онлайн-оплата пока недоступна, поэтому на сайте платежи не принимаются. Вы отправляете заказ из корзины, мы связываемся с вами для подтверждения, а оплата проходит после подтверждения.",
            "Цены установлены в молдавских леях (MDL). Показ в других валютах (RON, EUR, USD, RUB) использует фиксированный справочный курс и носит информационный характер.",
          ],
        },
        {
          title: "Вопросы",
          body: ["По любым вопросам о заказе или ключе пишите нам через страницу контактов."],
        },
      ],
    },
    privacy: {
      title: "Политика конфиденциальности",
      description: "Какие данные собирает The Iron Vault, зачем и как их удалить.",
      intro: "Мы собираем только те данные, которые нужны, чтобы обрабатывать заказы, отвечать на сообщения и отправлять рассылку.",
      sections: [
        {
          title: "Заказы",
          body: ["Когда вы отправляете заказ, мы получаем имя, телефон, email, комментарий и игры из корзины, чтобы связаться с вами для подтверждения и оплаты."],
        },
        {
          title: "Форма обратной связи",
          body: ["Когда вы нам пишете, мы сохраняем имя, email, тему и текст сообщения, чтобы ответить вам."],
        },
        {
          title: "Рассылка",
          body: ["Если вы подписываетесь, мы храним ваш email, пока вы не попросите его удалить."],
        },
        {
          title: "Cookie и локальное хранилище",
          body: [
            "Мы используем три функциональных cookie, они хранятся один год: язык (lang), валюта (currency) и список избранных игр (favorites).",
            "Корзина сохраняется в вашем браузере (localStorage); её содержимое попадает к нам только при отправке заказа.",
            "Рекламных и отслеживающих cookie мы не используем.",
          ],
        },
        {
          title: "Ваши права",
          body: ["Вы можете в любой момент запросить доступ к своим данным или их удаление, написав нам через страницу контактов."],
        },
      ],
    },
    terms: {
      title: "Условия использования",
      description: "Правила пользования магазином The Iron Vault.",
      intro: "Пользуясь сайтом, вы принимаете условия ниже.",
      sections: [
        {
          title: "Товары",
          body: [
            "Магазин продаёт цифровые ключи активации для видеоигр. Сведения о каждой игре (платформы, системные требования, дата выхода) указаны на её странице.",
          ],
        },
        {
          title: "Цены",
          body: [
            "Базовая цена указана в молдавских леях. Пересчёт в другие валюты носит ориентировочный характер.",
            "Скидки действуют до даты, указанной рядом с ценой.",
          ],
        },
        {
          title: "Заказы",
          body: ["Заказ, отправленный из корзины, поступает к нам как заявка. Мы связываемся с вами для подтверждения, а оплата проходит после него; онлайн-оплата пока недоступна."],
        },
        {
          title: "Контакты",
          body: ["С вопросами об этих условиях пишите нам через страницу контактов."],
        },
      ],
    },
  },
  en: {
    delivery: {
      title: "Delivery and payment",
      description: "How you receive games bought from The Iron Vault and how payment works.",
      intro: "Everything in the store is digital: you receive an activation key, not a disc or a box.",
      sections: [
        {
          title: "Delivery",
          body: [
            "The activation key is sent to the email address given with the order, once payment is confirmed.",
            "There is no physical delivery and no shipping cost.",
          ],
        },
        {
          title: "Payment",
          body: [
            "Online payment is not available yet, so no payments are taken on the site. You send the order from the cart, we contact you to confirm it, and payment follows confirmation.",
            "Prices are set in Moldovan lei (MDL). Showing them in other currencies (RON, EUR, USD, RUB) uses a fixed reference rate and is for information only.",
          ],
        },
        {
          title: "Questions",
          body: ["For anything about an order or a key, write to us through the contact page."],
        },
      ],
    },
    privacy: {
      title: "Privacy policy",
      description: "What data The Iron Vault collects, why, and how to have it deleted.",
      intro: "We only collect the data we need to handle orders, answer messages and send the newsletter.",
      sections: [
        {
          title: "Orders",
          body: ["When you send an order, we receive your name, phone, email, comment and the games in your cart, so we can contact you to confirm it and arrange payment."],
        },
        {
          title: "Contact form",
          body: ["When you write to us, we keep your name, email address, subject and message so we can reply."],
        },
        {
          title: "Newsletter",
          body: ["If you subscribe, we keep your email address until you ask us to remove it."],
        },
        {
          title: "Cookies and local storage",
          body: [
            "We use three functional cookies, kept for one year: your language (lang), currency (currency) and your list of favourite games (favorites).",
            "Your cart is saved in your browser (localStorage); its contents reach us only when you send an order.",
            "We don't use advertising or tracking cookies.",
          ],
        },
        {
          title: "Your rights",
          body: ["You can ask at any time to see or delete your data by writing to us through the contact page."],
        },
      ],
    },
    terms: {
      title: "Terms and conditions",
      description: "The rules for using The Iron Vault store.",
      intro: "By using the site, you accept the terms below.",
      sections: [
        {
          title: "Products",
          body: [
            "The store sells digital activation keys for video games. Details for each game (platforms, system requirements, release date) are shown on its page.",
          ],
        },
        {
          title: "Prices",
          body: [
            "The reference price is in Moldovan lei. Conversion to other currencies is approximate.",
            "Discounts are valid until the date shown next to the price.",
          ],
        },
        {
          title: "Orders",
          body: ["An order sent from the cart reaches us as an order request. We contact you to confirm it, and payment follows confirmation; online payment is not available yet."],
        },
        {
          title: "Contact",
          body: ["For questions about these terms, write to us through the contact page."],
        },
      ],
    },
  },
};
