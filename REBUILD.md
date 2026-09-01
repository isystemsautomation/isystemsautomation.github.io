# Пересборка сайта isystemsautomation.com на Eleventy — техническое задание

> Этот файл самодостаточен. Ничего прикладывать не нужно: все результаты аудита,
> вся дизайн-система и готовый CSS находятся внутри.
>
> Как использовать: положи файл в корень репозитория как `REBUILD.md`, открой Cursor
> в режиме Agent и дай команду:
> **«Прочитай REBUILD.md целиком. Выполни этап 0, покажи результат приёмки и
> остановись.»**
> Дальше веди по одному этапу за раз. Не проси сделать всё одним заходом: этап 2
> (перенос текста) обязан быть проверен до того, как начнётся вёрстка.

---

## 1. Задача

Ты пересобираешь корпоративный сайт промышленного системного интегратора с нуля на
Eleventy (11ty), **сохраняя весь текст дословно и все URL без изменений**.

Компания: **ISYSTEMS AUTOMATION S.R.L.**, Плоешти, Румыния, с 2007 года. АСУ ТП: DCS,
ESD и системы управления горелками, системы безопасности SIL 2 / SIL 3 по IEC 61511,
расчёт технико-экономических показателей энергоблоков, поставка операторских.
Платформы: Emerson Ovation, ABB Industrial IT 800xA, ABB Symphony, Siemens PCS7,
Siemens TIA Portal, Yokogawa Centum VP, HIMA HIQuad, Foxboro Triconex.

Аудитория: инженеры АСУ ТП, специалисты КИПиА и отделы закупок электростанций, НПЗ и
химических производств. Не потребители. Они ищут названия платформ, номера стандартов
и доказательства, что подрядчик уже делал такие проекты.

Цель: **чтобы через секунду после загрузки, ещё до того как считывается логотип,
страница читалась как работа инженерной фирмы, а не как купленная тема.** Этот эффект
дают типографика, сдержанность и последовательность — не графика. Сайт не должен
стать больше или ярче, он должен стать точнее.

---

## 2. Что есть сейчас

Репозиторий `isystemsautomation/isystemsautomation.github.io`, ветка `main`,
GitHub Pages за Cloudflare, `CNAME` → `www.isystemsautomation.com`.

Текущее состояние — статический экспорт Joomla, шаблон Helix3 «shaper_tixon»,
конструктор SP Page Builder. Каждая страница — отдельный HTML на 64–165 КБ, в котором
шапка, подвал и стили продублированы.

### Инвентарь — 23 страницы, все URL обязаны сохраниться побайтово

**Корень (12):**

```
/index.html                                     165 КБ
/404.html                                        64 КБ
/advanced-controllers-cfb-boiler.html            87 КБ
/company.html                                    67 КБ
/contact.html                                    82 КБ
/cookies.html                                    66 КБ
/industries.html                                100 КБ
/power-plant-performance-calculation.html       107 КБ
/privacy.html                                    68 КБ
/references.html                                 78 КБ
/service.html                                    93 КБ
/virtual-power-plant.html                        88 КБ
```

**/service/ (6):**

```
/service/industrial-furniture-control-centers.html
/service/maintenance.html
/service/manufacturing-execution-system.html
/service/process-automation.html
/service/process-optimization-advanced-process-control.html
/service/safety-systems-burner-management-systems.html
```

**/industries/ (5):**

```
/industries/cement-and-coal.html
/industries/control-centers.html
/industries/oil-and-gas.html
/industries/power-generation.html
/industries/smart-home-automation.html
```

Служебные файлы, которые обязаны остаться: `CNAME`, `.nojekyll`, `robots.txt`,
`sitemap.xml`.

---

## 3. Результаты аудита — что именно чинится

Сайт измерен в браузере на 9 страницах при 1440×900, 768×1024 и 375×812. Все числа
ниже получены из вычисленных стилей и геометрии, а не из исходника. Перепроверять не
нужно — используй как данность.

### 3.1 Дефект, ради которого всё затевается

На `index.html` четыре блока имеют инлайновый `style="visibility:hidden"`, записанный
SP Page Builder для скролл-анимации. Библиотека, которая должна снимать этот стиль
(WOW.js), в статический экспорт не попала: `window.WOW` — `undefined`, скрипт анимации
не запрашивается. **Эти блоки не видны никогда, ни при каком скролле, ни при какой
загрузке.** Секция резервирует 693 px высоты и рисует только свой заголовок.

Скрыт единственный на главной текст, написанный для инженера (570 знаков):

> **Certified functional safety** — SIL 2 and SIL 3 applications certified to IEC 61511,
> on HIMA HIQuad, Foxboro Triconex and ABB AC800.
>
> **Six DCS platforms** — Emerson Ovation, ABB Industrial IT 800xA, ABB Symphony,
> Siemens PCS7, Siemens TIA Portal and Yokogawa Centum VP, in production plants.
>
> **Remote and autonomous operation** — Plants dispatched over IEC 60870-5-104 across
> four redundant communication channels.
>
> **Measured handover** — Turbines accepted on measured criteria: primary and secondary
> frequency regulation, rate of load change, generator disconnection from the grid,
> emergency stops.

В пересобранном сайте этот текст обязан быть виден. Это пункт приёмки.

### 3.2 Типографика

- Объявлено 174 `@font-face` (Poppins 54 + Open Sans 120), реально скачивается 4 файла.
- Большая часть текста рисуется шрифтом операционной системы посетителя: стек
  `system-ui, -apple-system, "Segoe UI", Roboto` приходит из `bootstrap.min.css`.
  На главной так рисуются 23 ссылки меню, 15 абзацев и все `<strong>`. У сайта нет
  своей типографики — он одалживает шрифт у читателя.
- Кнопка героя «View Details» рисуется **Times New Roman** 600 — единственная засечная
  надпись на сайте.
- Длина строки 133–137 знаков при 1440 px в новых секциях и на `company.html`
  и `privacy.html`. Комфортный предел — 90.
- На `company.html` нет ни одного `h1`, `h3`, `h4`: разделы обозначены `<strong>`
  16 px с нулевым верхним отступом, типографически неотличимым от абзаца.
- Размеры заголовков дрейфуют по секциям: на одной странице `h2` встречается 36 px и
  48 px, `h3` — 28, 34, 28 и 16 px.

### 3.3 Цвет

- Синие цвета логотипа #0C6CB4 и #24A8D8 в интерфейсе практически не используются.
- Фактический акцент — оранжевый **#EF6D00** на всех кнопках, к бренду отношения не
  имеющий. В героя добавлен красный **#FF2C00**.
- Провалы контраста, измеренные: пункты выпадающего меню `#9D9D9D` на белом —
  **2.71:1**; подписи вкладок `#9B9B9B` на `#FBFBFB` — **2.69:1**; белый на оранжевом
  #EF6D00 — **3.06:1**; логотип в подвале на `#333333` — 2.62:1. Норма 4.5:1.
- Ссылки в тексте не отличаются от текста ничем, кроме цвета — подчёркивания нет
  нигде.
- Заголовки страниц лежат на фотографии без затемнения: `.sppb-row-overlay`
  вычисляется в `rgba(0,0,0,0)`, `text-shadow: none`. Измерено 1.47:1 на 1440 и
  **1.00:1 на 375** при норме 3:1.

### 3.4 Сетка и отступы

- На одной странице сосуществуют контейнеры 1140 / 1320 / 1170 / 1170 px с левыми
  краями 143 / 53 / 128 / 155. Ни одна секция не выравнена с соседней.
- Отступы секций: 0/0, 75/0, 0/75, 120/90, 100/100, 5/5 — шкалы нет. SP Page Builder
  пишет их инлайном в каждую секцию.
- 15 различных значений отступов на главной, из них в активном ходу 8, 9 и 10 px.
- Главная — 4918 px при 1440 и **9959 px при 375** (12 экранов), `references.html` —
  12938 px.
- На `contact.html` при 1440 четыре блока `col-md-6` разложены во всю ширину и
  становятся двухколоночными только **ниже** 1200 px: правые 60 % экрана пустые.

### 3.5 Навигация

- **При 768 и 375 навигации не видно вообще.** Десктопное меню `display: none`, а
  заменяющий его гамбургер белый на белой шапке: глиф рисует
  `i.fa-bars::before` цветом `#FFFFFF` — контраст **1:1**, зона 26×70 px, без
  доступного имени.
- Панель off-canvas имеет `background: transparent`. Она открывается, но её белые
  пункты ложатся прямо на страницу: «HOME» попадает на логотип, «COMPANY» и
  «CONTACT» — на белый фон при 1:1. Читаемы только те три пункта, под которыми
  случайно оказалась тёмная фотография.
- Активная страница не отмечена ничем: `.current-item.active` вычисляется идентично
  неактивным по цвету, фону, границе и обоим псевдоэлементам.
- На `privacy.html` в меню продублирован пункт REFERENCES — 7 `<li>` вместо 6, вся
  панель смещена на 119 px.
- Ссылки меню имеют `line-height: 90px` внутри шапки высотой 70 px: они висят на
  10.3 px ниже оптического центра логотипа и выступают за шапку на 20 px.
- Подвал вложен в `#sp-main-body` на `privacy.html` и `404.html`, но не на
  `contact.html` — при переходе он прыгает вбок на 12 px.

### 3.6 Компоненты

- Таблица референсов — единственная на сайте и главная для закупок — **не имеет
  визуальной шапки**: все 78 ячеек делят одинаковую границу
  `border-bottom: 0.571px rgba(0,0,0,.1)`, все 26 строк прозрачны, `th` и `td`
  совпадают по отступам, кеглю и цвету. Отличие только в начертании.
- Колонки инвертированы: «Годы» занимает 363 px под содержимое шириной 83 px (256 px
  пустоты в каждой из 25 строк), «Проект» переносится в три строки.
- Таблица не прокручивается, а сплющивается: `overflow-x: auto` не срабатывает, потому
  что `table-layout: auto` сжимает её до 332 px при 375 px, и она вытягивается на
  3714 px — 29 % всего документа.
- Кнопок пять видов: оранжевая таблетка радиусом 30 px с тенью, призрачная таблетка с
  границей 1.7 px, квадратная, 14 «таблеток» в подвале и обычная.
- Подписи карточек в блоке «Our Services» вылезают за пределы своей рамки.
- Низы карточек в ряду расходятся до 44 px.
- Подвал тяжелее содержимого на каждой странице: 670 px против 739 px на
  `contact.html`, и **1205 px против 428 px на `404.html` при 375** — 71 % документа.
- Иконка фирменного блока на `contact.html` — `fa-house-damage`, глиф «треснувший
  дом» из набора «стихийные бедствия» Font Awesome.
- Герой главной — карусель из двух слайдов; на главной есть набор вкладок «What We
  Do», первая из которых у интегратора систем безопасности называется «Smart Home
  Automation».
- Загружается `animate.min.css` — 69 КБ библиотеки анимаций на страницах без анимаций.
- Объявлены четыре шрифта иконок, из которых **не загружается ни одно начертание**,
  но их таблицы стилей всё равно скачиваются и разбираются, включая
  `basic-iconfont-ecom.css` — набор иконок интернет-магазина.

### 3.7 Изображения

- Единственная настоящая схема сайта — экран контура регулирования Emerson Ovation
  1577×793 — вставлена в квадрат 570×570 с `object-fit: cover`: теряется **49.7 %
  ширины** (65.6 % при 768). Подписи высотой 8 px в исходнике превращаются в 5.8 px
  при 1440, 5.1 px при 768 и **3.3 px при 375**. Ни лайтбокса, ни подписи, ни ссылки
  на полный размер.
- **Эта же схема обёрнута в `<a href="https://www.joomshaper.com">`** — клик по схеме
  установки уводит на сайт продавца шаблона.
- В галерее плитки 1.75:1, а 5 из 9 исходников — портреты 0.75–0.82: `cover` срезает
  у них около 57 %, у соседних 1.33 — 24 %.
- В `/images` лежат файлы прямо с камеры: `20160124_111013.jpg` 777 КБ,
  `P00129-140137.jpg` 530 КБ, `P00110-105955.jpg` 494 КБ, `P01104-082706.jpg` 427 КБ,
  `20161006_114122.jpg` 422 КБ. На `references.html` десять самых тяжёлых изображений
  дают 3057 КБ.
- Первая из трёх карточек новостей на главной — радужная AI-иконка «умного дома»
  рядом с фотографией установки и скриншотом P&ID.
- Одна фотография `steam-turbine-generator-hall-wide.jpg` служит фоном заголовка
  минимум на трёх страницах.
- Ни один `<img>` не имеет `width` и `height`, отложенная загрузка не используется.

### 3.8 Вес

| Страница | Запросов | Распаковано | CSS | JS | Изображения |
|---|---|---|---|---|---|
| references.html | 84 | 4843 КБ | 52 файла, 686 КБ | 11 файлов, 268 КБ | 15 файлов, 3763 КБ |
| cfb-boiler | 72 | — | 52 файла, 689 КБ | 13 файлов, 290 КБ | — |
| 404.html | 51 | 683 КБ | — | — | — |

Три файла дают 494 КБ: `sppagebuilder.css` 194 КБ, `bootstrap.min.css` 160 КБ,
`template.css` 140 КБ. `404.html` тянет весь этот груз ради 80 знаков текста.

### 3.9 Что работает и ломать не надо

Горизонтального переполнения нет ни на одной странице ни при одной ширине:
`scrollWidth` не выходит за `innerWidth`. Меню собирается на `onload` без сдвига
макета. Тексты, заголовки страниц и meta description выверены — их не трогаем.

---

## 4. Жёсткие правила

Нарушение любого — повод откатить работу целиком.

1. **Ни одно слово не теряется.** Весь текст со всех 23 страниц, включая скрытые
   570 знаков, переносится дословно. Пересборка — смена разметки и стилей, не
   редактура. Правки текста, даже улучшающие, запрещены: они ломают автоматическую
   проверку полноты переноса.
2. **Ни один URL не меняется**, включая расширение `.html`. `/references.html`
   остаётся `/references.html`, а не становится `/references/`.
3. **Никаких JS-библиотек.** jQuery, Bootstrap JS, WOW.js, animate.css, SP Page
   Builder не переносятся. Никаких слайдеров, каруселей, счётчиков и скролл-эффектов.
   Карусель героя превращается в два обычных блока друг под другом — контент
   сохраняется.
4. **Шрифты лежат в репозитории.** Никаких запросов к `fonts.googleapis.com` и
   `fonts.gstatic.com`: компания продаёт в ЕС, и вопрос о передаче IP-адресов
   посетителей третьей стороне ей не нужен.
5. **Никаких сторонних CDN.** Всё своё.
6. **Сайт полностью работает с отключённым JavaScript**: меню открывается, все
   разделы доступны, весь текст виден. Мобильная навигация — на HTML и CSS. Свой JS
   допустим только как необязательное улучшение.
7. **Никакого контента, зависящего от JS.** Ровно эта ошибка спрятала 570 знаков.
8. **Каждый этап заканчивается зелёной приёмкой** из раздела 10.

---

## 5. Архитектура

Eleventy выбран потому, что шапка и подвал должны существовать в одном экземпляре.
Сейчас они скопированы 23 раза — отсюда дубль REFERENCES на `privacy.html` и
прыгающий подвал. Этот класс дефектов должен стать структурно невозможным.

```
.
├── .eleventy.js
├── package.json
├── .github/workflows/build-deploy.yml
├── src/
│   ├── _data/
│   │   ├── site.json          # реквизиты, контакты, домен
│   │   └── nav.json           # ЕДИНСТВЕННЫЙ источник меню
│   ├── _includes/
│   │   ├── base.njk           # <html>, <head>, скип-линк, шапка, подвал
│   │   └── partials/{header,footer,nav,icon}.njk
│   ├── assets/
│   │   ├── css/isa.css        # ЕДИНСТВЕННАЯ таблица стилей (раздел 7)
│   │   ├── fonts/             # 2 файла .woff2
│   │   └── img/
│   ├── index.njk
│   ├── ... (все 23 страницы)
│   ├── service/
│   └── industries/
├── static/                    # CNAME, robots.txt, .nojekyll — копируются как есть
└── legacy/                    # полная копия текущего сайта, только для сверки
```

Решения:

- **Страницы в Nunjucks (`.njk`), не в Markdown.** На страницах таблицы, галереи и
  блоки со смешанной структурой; Markdown заставит вкладывать в него HTML.
- **Permalink задаётся явно на каждой странице**, чтобы совпадение URL читалось
  глазами:

  ```njk
  ---
  layout: base.njk
  permalink: /references.html
  title: References and Projects — ISYSTEMS AUTOMATION
  description: <существующий meta description, дословно>
  ---
  ```

  Главная — `permalink: /index.html`, ошибка — `permalink: /404.html`.
- **`nav.json` — единственный источник меню**: шесть пунктов верхнего уровня (Home,
  Industries, Service, References, Company, Contact) с вложенностью у Industries и
  Service. Состав подпунктов брать из живого меню, а не из `privacy.html` — там оно
  сломано.
- **`sitemap.xml` генерируется** из коллекции страниц.
- Сборка `npx @11ty/eleventy` в `_site`, деплой через GitHub Actions, `.nojekyll`
  обязателен.

---

## 6. Этапы

### Этап 0 — Каркас и страховка

1. `git checkout -b rebuild-11ty`. `main` не трогаем: с него публикуется Pages.
2. Скопируй **весь текущий сайт** в `legacy/` одним коммитом — это эталон для сверки
   текста. Удалишь последним коммитом перед merge.
3. Подними Eleventy, passthrough для `static/` и `src/assets/`, выход в `_site`.
4. Сделай одну тестовую страницу и убедись, что она собирается по нужному permalink.

### Этап 1 — Инвентаризация

Собери из `legacy/` таблицу: файл → URL → `<title>` → meta description → canonical →
OG-теги, сохрани как `content/_inventory.json`. Титулы и описания уже выверены —
переноси дословно.

### Этап 2 — Перенос текста. Самый ответственный этап

Напиши `tools/extract-content.mjs` (`jsdom` или `cheerio` как dev-зависимость):

- берёт `#sp-main-body` и подвал отдельно;
- **выбрасывает** `<script>`, `<style>`, `<noscript>`, обёртки SP Page Builder,
  атрибуты `style`, классы `sppb-*`, `wow`, `animate*`, `col-md-*`;
- **сохраняет** текст, `href`, `src`, `alt`, структуру заголовков, списки, таблицы;
- **обязательно включает узлы с `visibility:hidden` и `display:none`** — иначе
  потеряются те самые 570 знаков;
- пишет `content/<slug>.json` как дерево блоков.

Затем перенеси блоки в `.njk` семантической разметкой: `<section>`, `<h1>`–`<h4>`,
`<p>`, `<ul>`, `<table>`, `<figure>`/`<figcaption>`. Никаких `<div class="sppb-...">`.

Иерархия заголовков: ровно один `<h1>` на страницу, дальше без пропуска уровней.
На `company.html` разделы, обозначенные `<strong>`, поднимаются в настоящие `<h2>` —
меняется тег, не текст.

### Этап 3 — Стили

Создай `src/assets/css/isa.css` по разделу 7 целиком. Это единственная таблица стилей
проекта.

### Этап 4 — Компоненты и разметка

Свёрстай компоненты по контрактам разметки из раздела 8.

### Этап 5 — Изображения

По разделу 9.

### Этап 6 — Бюджет, sitemap, деплой

По разделу 10 и финальной приёмке.

---

## 7. Готовая таблица стилей

Это стартовый `isa.css` целиком. Значения выведены из аудита и проверены по контрасту;
не заменяй их на «примерно такие же». Дополнять можно, менять числа — нет.

```css
/* ============================================================
   ISYSTEMS AUTOMATION — единственная таблица стилей
   ============================================================ */

/* --- Шрифт. Только два начертания, latin + latin-ext (нужны ș ț ă î â) --- */
@font-face{
  font-family:"IBM Plex Sans";
  src:url("../fonts/ibm-plex-sans-400.woff2") format("woff2");
  font-weight:400; font-style:normal; font-display:swap;
}
@font-face{
  font-family:"IBM Plex Sans";
  src:url("../fonts/ibm-plex-sans-600.woff2") format("woff2");
  font-weight:600; font-style:normal; font-display:swap;
}

/* --- Токены --- */
:root{
  --font:"IBM Plex Sans", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;

  /* цвет: выведен из логотипа #0C6CB4 / #24A8D8 / #6C6C6C */
  --brand-900:#063A63;   /* тёмный фон: подвал, скрим героя */
  --brand-700:#0C6CB4;   /* основной: ссылки, кнопки, фокус */
  --brand-600:#095289;   /* наведение */
  --brand-400:#24A8D8;   /* акцент: ТОЛЬКО линейки, маркеры, иконки на тёмном */
  --ink-900:#16202A;     /* заголовки */
  --ink-700:#33414F;     /* основной текст */
  --ink-500:#6C6C6C;     /* приглушённый текст, подписи */
  --ink-300:#C9CFD6;     /* границы, линейки */
  --ink-100:#EDF0F3;     /* фон чередующейся секции, шапка таблицы */
  --paper:#FFFFFF;

  /* отступы: одна шкала на весь проект */
  --s1:4px; --s2:8px;  --s3:12px; --s4:16px;
  --s5:24px; --s6:32px; --s7:48px; --s8:64px; --s9:96px;

  --container:1200px;
  --gutter:24px;
  --section-y:64px;
  --header-h:72px;
  --measure:68ch;        /* лечит нынешние 137 знаков в строке */
}
@media (max-width:1023px){ :root{ --section-y:48px; } }
@media (max-width:767px){  :root{ --gutter:16px; --section-y:40px; --header-h:56px; } }

/* --- База --- */
*,*::before,*::after{ box-sizing:border-box; }
html{ font-size:16px; -webkit-text-size-adjust:100%; scroll-behavior:smooth; }
@media (prefers-reduced-motion:reduce){ html{ scroll-behavior:auto; } }
body{
  margin:0; font-family:var(--font); font-size:1.0625rem; line-height:1.6;
  color:var(--ink-700); background:var(--paper);
  -webkit-font-smoothing:antialiased;
}
img{ max-width:100%; height:auto; display:block; }
svg{ fill:currentColor; }

/* --- Типографика. Шаг 1.25 от базы 17px --- */
h1,h2,h3,h4{
  margin:0 0 var(--s3); font-weight:600; line-height:1.2;
  color:var(--ink-900); letter-spacing:-0.011em;
}
h2,h3,h4{ margin-top:var(--s6); }
h1{ font-size:2.5625rem; line-height:1.15; }   /* 41px */
h2{ font-size:2.0625rem; }                      /* 33px */
h3{ font-size:1.625rem;  line-height:1.30; }    /* 26px */
h4{ font-size:1.3125rem; line-height:1.35; }    /* 21px */
p{ margin:0 0 var(--s4); }
strong,b{ font-weight:600; color:var(--ink-900); }
small,.caption{ font-size:0.875rem; line-height:1.5; color:var(--ink-500); }

@media (max-width:767px){
  h1{ font-size:1.875rem;  line-height:1.20; }  /* 30px */
  h2{ font-size:1.5625rem; line-height:1.25; }  /* 25px */
  h3{ font-size:1.3125rem; }                     /* 21px */
  h4{ font-size:1.125rem; }                      /* 18px */
  h2,h3,h4{ margin-top:var(--s5); }
}

/* Длина строки. Действует только там, где колонка шире меры. */
.prose p, .prose li{ max-width:var(--measure); }

/* --- Ссылки и фокус --- */
.prose a, main p a, main li a, main td a{
  color:var(--brand-700);
  text-decoration:underline; text-underline-offset:.15em; text-decoration-thickness:1px;
}
.prose a:hover, main p a:hover{ color:var(--brand-600); text-decoration-thickness:2px; }

:where(a,button,summary,input,select,textarea,[tabindex]):focus-visible{
  outline:3px solid var(--brand-700); outline-offset:2px; border-radius:2px;
}
.site-footer :focus-visible, .hero :focus-visible{ outline-color:var(--brand-400); }

.skip-link{
  position:absolute; left:-9999px; top:0; z-index:200;
  background:var(--paper); color:var(--brand-700);
  padding:var(--s3) var(--s4); font-weight:600;
}
.skip-link:focus{ left:0; }

/* --- Раскладка --- */
.container{
  width:100%; max-width:var(--container);
  margin-inline:auto; padding-inline:var(--gutter);
}
.section{ padding-block:var(--section-y); }
.section--tint{ background:var(--ink-100); }   /* единственный альтернативный фон */
.section--flush{ padding-block:0; }            /* для полноэкранного героя */

.grid{ display:grid; gap:var(--s5); }
.grid--2{ grid-template-columns:repeat(2,1fr); }
.grid--3{ grid-template-columns:repeat(3,1fr); }
@media (max-width:1023px){ .grid--3{ grid-template-columns:repeat(2,1fr); } }
@media (max-width:767px){
  .grid--2,.grid--3{ grid-template-columns:1fr; gap:var(--s4); }
}

/* --- Заголовок секции: один размер на весь сайт --- */
.section-title{ margin:0 0 var(--s5); text-align:left; }
.section-title::after{
  content:""; display:block; width:48px; height:3px;
  background:var(--brand-400); margin-top:var(--s3);
}

/* --- Шапка --- */
.site-header{
  position:sticky; top:0; z-index:100;
  height:var(--header-h); background:var(--paper);
  border-bottom:1px solid var(--ink-300); box-shadow:none;
}
.site-header .container{
  height:100%; display:flex; align-items:center; justify-content:space-between; gap:var(--s5);
}
.site-header .logo img{ height:40px; width:auto; }
@media (max-width:767px){ .site-header .logo img{ height:32px; } }

/* --- Меню, десктоп --- */
.nav{ display:flex; align-items:center; gap:var(--s1); }
.nav ul{ display:flex; align-items:center; gap:var(--s1); list-style:none; margin:0; padding:0; }
.nav a{
  display:flex; align-items:center; height:var(--header-h);
  padding-inline:var(--s4);
  font-size:0.9375rem; font-weight:600; line-height:1.2;
  color:var(--ink-900); text-decoration:none; text-transform:none;
}
.nav a:hover{ color:var(--brand-700); }
.nav [aria-current="page"]{
  color:var(--brand-700);
  box-shadow:inset 0 -3px 0 var(--brand-400);   /* активная страница была не отмечена ничем */
}
.nav li{ position:relative; }
.nav ul ul{                                     /* выпадающее */
  display:none; position:absolute; top:100%; left:0; min-width:260px;
  flex-direction:column; align-items:stretch; gap:0;
  background:var(--paper); border:1px solid var(--ink-300);
  box-shadow:0 8px 24px rgba(22,32,42,.12); padding:var(--s2) 0;
}
.nav li:hover > ul, .nav li:focus-within > ul{ display:flex; }
.nav ul ul a{
  height:auto; min-height:44px; padding:var(--s3) var(--s5);
  font-weight:400; color:var(--ink-700);       /* было #9D9D9D — 2.71:1 */
}
.nav ul ul a:hover{ background:var(--ink-100); color:var(--brand-700); }

/* --- Меню, мобильное. Без JS: <details> --- */
.nav-toggle{ display:none; }
@media (max-width:991px){
  .nav{ display:none; }
  .nav-toggle{ display:block; position:relative; }
  .nav-toggle > summary{
    list-style:none; cursor:pointer;
    width:44px; height:44px;                    /* было 26×70 */
    display:flex; align-items:center; justify-content:center;
    color:var(--ink-900);                       /* было #FFFFFF на белом — 1:1 */
  }
  .nav-toggle > summary::-webkit-details-marker{ display:none; }
  .nav-panel{
    position:fixed; inset:var(--header-h) 0 0 auto;
    width:min(320px,86vw); overflow-y:auto;
    background:var(--brand-900);                /* панель была прозрачной */
    box-shadow:-8px 0 32px rgba(0,0,0,.35);
    padding:var(--s5);
  }
  .nav-panel ul{ list-style:none; margin:0; padding:0; }
  .nav-panel a{
    display:flex; align-items:center; min-height:48px;
    color:var(--paper); font-size:1.0625rem; font-weight:600; text-decoration:none;
    border-bottom:1px solid rgba(255,255,255,.14);
  }
  .nav-panel ul ul a{ font-weight:400; padding-left:var(--s4); }
  .nav-panel summary{ 
    min-height:48px; display:flex; align-items:center; cursor:pointer;
    color:var(--paper); font-weight:600;
    border-bottom:1px solid rgba(255,255,255,.14);
  }
}

/* --- Герой и заголовок страницы на фотографии --- */
.hero{ position:relative; display:grid; align-items:center; min-height:420px; overflow:hidden; }
.hero > img{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; z-index:0; }
.hero::before{                                  /* скрим: overlay был rgba(0,0,0,0) */
  content:""; position:absolute; inset:0; z-index:1;
  background:linear-gradient(90deg, rgba(6,58,99,.82) 0%, rgba(6,58,99,.62) 55%, rgba(6,58,99,.35) 100%);
}
.hero .container{ position:relative; z-index:2; padding-block:var(--s8); }
.hero h1,.hero p{ color:var(--paper); text-shadow:none; }
.hero p{ max-width:56ch; }
@media (max-width:767px){ .hero{ min-height:280px; } }

/* --- Кнопки: два вида вместо пяти --- */
.btn{
  display:inline-flex; align-items:center; justify-content:center;
  min-height:44px; padding:0 var(--s5);
  font-family:var(--font); font-size:0.9375rem; font-weight:600; line-height:1.2;
  text-transform:none; letter-spacing:0; text-decoration:none;
  border-radius:3px;                            /* было 30px — форма таблетки */
  border:1px solid transparent; box-shadow:none; cursor:pointer;
  transition:background-color .12s linear, border-color .12s linear;
}
.btn--primary{ background:var(--brand-700); color:var(--paper); border-color:var(--brand-700); }
.btn--primary:hover{ background:var(--brand-600); border-color:var(--brand-600); }
.btn--quiet{ background:transparent; color:var(--brand-700); border-color:var(--ink-300); }
.btn--quiet:hover{ background:var(--ink-100); border-color:var(--brand-700); }

/* --- Карточки --- */
.card{
  display:flex; flex-direction:column; height:100%;   /* низы карточек расходились до 44px */
  background:var(--paper); border:1px solid var(--ink-300); border-radius:3px;
  overflow:hidden;
}
.card > img{ width:100%; aspect-ratio:4/3; object-fit:cover; }
.card__body{ padding:var(--s5); display:flex; flex-direction:column; gap:var(--s3); flex:1; }
.card__body > :last-child{ margin-top:auto; }        /* кнопки выравниваются по низу */
.card h3{ margin:0; font-size:1.375rem; }
@media (max-width:767px){ .card__body{ padding:var(--s4); } }

/* --- Таблица референсов --- */
.table-scroll{ overflow-x:auto; -webkit-overflow-scrolling:touch; }
.table{
  width:100%; min-width:720px;                  /* иначе сплющивается до 332px */
  border-collapse:collapse; table-layout:fixed;
  font-size:0.9375rem; font-variant-numeric:tabular-nums;
}
.table th{
  background:var(--ink-100); color:var(--ink-900);
  font-weight:600; text-align:left;
  padding:var(--s3) var(--s4);
  border-bottom:2px solid var(--brand-700);     /* шапки не было видно вообще */
  position:sticky; top:var(--header-h); z-index:1;
}
.table td{
  padding:var(--s3) var(--s4); vertical-align:top;
  border-bottom:1px solid var(--ink-300); color:var(--ink-700);
}
.table tbody tr:nth-child(even){ background:#F7F9FA; }
.table th:nth-child(1),.table td:nth-child(1){ width:14%; }  /* «Годы»: было 363px под 83px */
.table th:nth-child(2),.table td:nth-child(2){ width:44%; }
.table th:nth-child(3),.table td:nth-child(3){ width:42%; }
@media (max-width:767px){
  .table{ font-size:0.875rem; }
  .table th{ position:static; }
  .table th,.table td{ padding:var(--s3); }
}

/* --- Рисунки и схемы --- */
figure{ margin:0 0 var(--s5); }
figcaption{ margin-top:var(--s3); font-size:0.875rem; color:var(--ink-500); }
.figure--schematic img{                          /* схему НИКОГДА не кадрируем */
  width:100%; height:auto; aspect-ratio:auto; object-fit:contain;
  border:1px solid var(--ink-300); background:var(--paper);
}
.gallery img{ width:100%; aspect-ratio:3/2; object-fit:cover; }

/* --- Подвал --- */
.site-footer{
  background:var(--brand-900); color:rgba(255,255,255,.86);  /* 9.0:1 */
  padding-block:var(--s8); border-top:none;
}
.site-footer a{ color:var(--paper); text-decoration:none; }  /* 11.7:1 */
.site-footer a:hover{ text-decoration:underline; text-decoration-color:var(--brand-400); }
.site-footer h2,.site-footer h3{ color:var(--paper); font-size:1.0625rem; margin:0 0 var(--s3); }
.site-footer ul{ list-style:none; margin:0; padding:0; display:grid; gap:var(--s2); }
.site-footer .legal{ font-size:0.875rem; color:rgba(255,255,255,.72); }  /* 6.8:1 */
@media (max-width:767px){ .site-footer{ padding-block:40px; } }

/* --- Служебное --- */
.visually-hidden{
  position:absolute; width:1px; height:1px; overflow:hidden;
  clip:rect(0 0 0 0); clip-path:inset(50%); white-space:nowrap;
}
```

### Проверенные контрасты — не пересчитывай

| Пара | Отношение | Назначение |
|---|---|---|
| `--ink-900` на белом | 16.5:1 | заголовки |
| `--ink-700` на белом | 10.5:1 | основной текст |
| `--ink-700` на `--ink-100` | 9.1:1 | текст на чередующейся секции |
| `--ink-500` на белом | 5.3:1 | подписи |
| `--ink-500` на `--ink-100` | 4.6:1 | запас мал — фон не затемнять |
| `--brand-700` на белом | 5.5:1 | ссылки |
| белый на `--brand-700` | 5.5:1 | текст основной кнопки |
| белый на `--brand-900` | 11.7:1 | текст подвала |
| белый 86 % на `--brand-900` | 9.0:1 | основной текст подвала |
| белый 72 % на `--brand-900` | 6.8:1 | юридический текст подвала |
| `--brand-400` на `--brand-900` | 4.3:1 | крупный текст и линейки на тёмном |
| **`--brand-400` на белом** | **2.7:1** | **текстом на светлом — никогда** |

Цвета, которых на сайте больше не существует: `#EF6D00`, `#FF2C00`, `#9B9B9B`,
`#9D9D9D`, `#212529`, `#303030`, `#464855`, `#38434a`.

---

## 8. Контракты разметки

Классы из раздела 7 предполагают такую разметку. Держись её.

**Шапка и меню:**

```html
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <div class="container">
    <a class="logo" href="/index.html">
      <img src="/assets/img/isystems-automation-logo.svg" alt="ISYSTEMS AUTOMATION"
           width="180" height="40">
    </a>

    <nav class="nav" aria-label="Main">
      <ul>
        <li><a href="/index.html">Home</a></li>
        <li>
          <a href="/industries.html">Industries</a>
          <ul>…подпункты…</ul>
        </li>
        …
      </ul>
    </nav>

    <details class="nav-toggle">
      <summary aria-label="Menu">
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2"
                fill="none" stroke-linecap="round"/>
        </svg>
      </summary>
      <nav class="nav-panel" aria-label="Main">…то же меню…</nav>
    </details>
  </div>
</header>
<main id="main">…</main>
```

У ссылки текущей страницы ставь `aria-current="page"` — на ней держится подсветка
активного пункта.

**Секция:**

```html
<section class="section">
  <div class="container prose">
    <h2 class="section-title">Why Choose Us</h2>
    …
  </div>
</section>
```

Чередование фона — `section--tint` через одну. Третьего фона не существует.

**Таблица:**

```html
<div class="table-scroll">
  <table class="table">
    <thead><tr><th>Years</th><th>Project</th><th>Platform</th></tr></thead>
    <tbody>…</tbody>
  </table>
</div>
```

`<thead>` обязателен — сейчас у таблицы нет строки заголовков в принципе.

**Схема:**

```html
<figure class="figure--schematic">
  <a href="/assets/img/ovation-control-loop-full.jpg">
    <img src="/assets/img/ovation-control-loop.jpg" alt="…"
         width="1577" height="793" loading="lazy" decoding="async">
  </a>
  <figcaption>Emerson Ovation — контур регулирования. Открыть в полном размере.</figcaption>
</figure>
```

---

## 9. Изображения

Цели: герой 2400×800 (3:1, ≤220 КБ), карточка 800×600 (4:3, ≤90 КБ), плитка галереи
1140×760 (3:2, ≤120 КБ), схема — исходные пропорции, ширина ≤1600, ≤250 КБ,
**никогда не кадрируется**.

- Пережать всё из `/images`: длинная сторона ≤1600 px, JPEG качество 72, EXIF снять,
  переименовать по смыслу. Ожидаемо 3057 КБ → около 700 КБ на `references.html`.
- Схему Ovation 1577×793 показывать во всю ширину с подписью и ссылкой на полный
  размер. **Убрать обёртку `<a href="https://www.joomshaper.com">`.**
- Портретные исходники галереи (5 из 9) перекадрировать в 3:2.
- Два скриншота HMI, которые в плитке дают 3–4 px текста, из галереи убрать; оставить
  на технической странице во всю ширину.
- Радужную AI-иконку «умного дома» на главной заменить фотографией оборудования.
- `steam-turbine-generator-hall-wide.jpg` развести хотя бы на двух из трёх страниц.
- У каждого `<img>` обязательны `width` и `height`. Ниже первого экрана —
  `loading="lazy" decoding="async"`; у героя — `fetchpriority="high"`, без lazy.
- Логотип перевести в SVG.

---

## 10. Бюджет и приёмка

| Метрика | Сейчас | Цель |
|---|---|---|
| CSS файлов | 52 | **1** |
| CSS распаковано | 686 КБ | **≤ 40 КБ** |
| JS файлов | 10–13 | **0–1** |
| JS распаковано | 268 КБ | **≤ 10 КБ** |
| Файлов шрифтов | 4 | **2** |
| Объявлений `@font-face` | 151–181 | **2** |
| Запросов | 51–84 | **≤ 20** |
| Изображений на страницу | до 3763 КБ | **≤ 700 КБ** |
| Вес страницы | 4843 КБ | **≤ 900 КБ** |
| LCP | — | **≤ 1.8 с** на 4G |

Бюджет достигается тем, что Bootstrap, SP Page Builder, Font Awesome, animate.css и
jQuery просто не переносятся.

### Приёмка по этапам

**Этап 0.** `npx @11ty/eleventy` собирается. В `legacy/` все 23 HTML.

**Этап 1.** В `content/_inventory.json` ровно 23 записи, каждый URL из раздела 2
встречается ровно один раз.

**Этап 2 — главная проверка проекта.** Напиши `tools/verify-content.mjs` и включи в
CI. Для каждой страницы он берёт текст из `legacy/<файл>` и из `_site/<тот же путь>`,
извлекает его из DOM **включая скрытые узлы**, исключая `<script>`, `<style>`,
`<noscript>`, `<head>`, нормализует и сравнивает:

```js
const norm = s => s
  .replace(/ /g,' ')
  .replace(/[«»""„]/g,'"').replace(/['']/g,"'")
  .replace(/[–—]/g,'-')
  .replace(/\s+/g,' ').trim().toLowerCase();

const missing = [...legacyWords].filter(w => !newWords.has(w));
if (missing.length){ console.error(page,'ПОТЕРЯН ТЕКСТ:',missing); process.exitCode = 1; }
```

Критерий: **пустой список потерь на всех 23 страницах.** Расхождение в обратную
сторону допустимо только для 570 знаков из пункта 3.1 — оформи их отдельным списком
исключений с комментарием, а не общим послаблением.

Отдельным тестом проверь, что строки `SIL 2 and SIL 3`, `IEC 61511`, `HIMA HIQuad`,
`Foxboro Triconex`, `ABB AC800`, `Emerson Ovation`, `IEC 60870-5-104` присутствуют в
`_site/index.html` **и ни у одного их предка нет `visibility:hidden`, `display:none`
или нулевой прозрачности.**

**Этап 3.** Ни один элемент ни на одной странице не вычисляется в `system-ui`,
Times New Roman, Poppins или Open Sans. Абзацы при 1440 укладываются в 65–72 знака.
Заголовки идут 41 / 33 / 26 / 21 px без дрейфа между секциями.

**Этап 4.** Прогон по контрасту на 23 страницах при 1440 / 768 / 375: ни одной пары
ниже 4.5:1 для обычного текста и 3:1 для крупного, кроме текста на фотографии —
его смотри глазами по скриншоту. При 375 и 768 гамбургер виден, панель со сплошным
фоном, пункты ≥48 px. **С отключённым JavaScript** меню открывается и весь текст на
месте. Ни одной зоны нажатия меньше 44 px. `scrollWidth` не превышает `innerWidth`.
Меню одинаковое на всех 23 страницах, без дубля REFERENCES. Подвал начинается с
одного левого края везде.

**Этап 5.** У каждого `<img>` есть `width` и `height`. Ни одно изображение не
отдаётся крупнее двойного размера отрисовки. Подписи на схеме Ovation не меньше 10 px
при 1440. `grep -r joomshaper _site` — пусто.

**Финальная.** Список файлов в `_site` совпадает со списком из раздела 2 в обе
стороны. `CNAME`, `.nojekyll`, `robots.txt`, `sitemap.xml` на месте, в sitemap те же
23 URL. Бюджет выдержан на `index.html`, `references.html` и
`advanced-controllers-cfb-boiler.html` — это три самые тяжёлые страницы. Скриншоты
всех 23 страниц при трёх ширинах просмотрены. `legacy/` удалён последним коммитом.

---

## 11. Чего делать не нужно

- Не менять структуру разделов и не переписывать тексты. Три вещи — пустая колонка
  «Platform» в 9 строках из 25, смартхоум-маркетинг впереди SIL-компетенций и
  шаблонный тон заголовка героя «Unveiling Cutting-Edge Process Optimization
  Solutions» — решения владельца сайта. Вынеси их отдельным списком в конце работы.
- Не добавлять формы, карты, чаты, куки-баннеры и аналитику, если о них не просили.
- Не вводить CSS-фреймворк взамен удалённого. Одна таблица стилей, написанная руками.
- Не добавлять тёмную тему.
- Не заниматься обрезкой чужого CSS: чужой CSS сюда не переносится.

---

## 12. Порядок коммитов

Ветка `rebuild-11ty`, по коммиту на этап, в сообщении — номер этапа и результат
приёмки. Merge в `main` только после финальной приёмки целиком: с `main` публикуется
GitHub Pages, промежуточные состояния туда попадать не должны.