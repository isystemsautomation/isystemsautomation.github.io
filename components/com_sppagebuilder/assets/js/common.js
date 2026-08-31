window.addEventListener("DOMContentLoaded",(()=>{const d=document.body.classList;d.contains("com-sppagebuilder")||d.add("com-sppagebuilder")}));

/* ---------------------------------------------------------------------------
 * Site repairs applied on top of the static export.
 *
 * 1. Top navigation. The injected XSS lived in the Helix menu-layout params of
 *    the CONTACT item, which stopped the megamenu module from rendering; the
 *    header was left with only the offcanvas hamburger. The menu is rebuilt
 *    here and inserted into #sp-menu.
 * 2. Three carousel slides carry background-image: url(//images/...), which a
 *    browser resolves as the host "images". Normalised to a root-relative path.
 *
 * Temporary: both belong in the HTML itself. Bake them in on the next rebuild.
 * ------------------------------------------------------------------------- */
(function () {
  var MENU = [
    ["HOME", "/", []],
    ["INDUSTRIES", "/industries.html", [
      ["Power Generation", "/industries/power-generation.html"],
      ["Oil and Gas", "/industries/oil-and-gas.html"],
      ["Cement and Coal", "/industries/cement-and-coal.html"],
      ["Control Centers", "/industries/control-centers.html"],
      ["Smart Home Automation", "/industries/smart-home-automation.html"]
    ]],
    ["SERVICE", "/service.html", [
      ["Process Automation", "/service/process-automation.html"],
      ["Process optimization / Advanced process control", "/service/process-optimization-advanced-process-control.html"],
      ["MES (Manufacturing Execution System)", "/service/manufacturing-execution-system.html"],
      ["Safety Systems and Burner Management Systems", "/service/safety-systems-burner-management-systems.html"],
      ["Industrial furniture / Control centers", "/service/industrial-furniture-control-centers.html"],
      ["Maintenance", "/service/maintenance.html"]
    ]],
    ["COMPANY", "/company.html", []],
    ["CONTACT", "/contact.html", []]
  ];

  var CSS = [
    "#sp-menu > .sp-column{display:flex;align-items:center;justify-content:flex-end}",
    "#sp-menu .sp-megamenu-parent{display:inline-flex;flex-wrap:wrap;align-items:center;list-style:none;margin:0;padding:0}",
    "#sp-menu .sp-megamenu-parent > li{position:relative;list-style:none}",
    "#sp-menu .sp-megamenu-parent > li > a{display:block;padding:0 15px;line-height:90px;font-size:14px;font-weight:600;letter-spacing:.5px;text-transform:uppercase}",
    "#sp-menu .sp-dropdown{position:absolute;top:100%;left:0;z-index:9999;visibility:hidden;opacity:0;transition:opacity .2s ease}",
    "#sp-menu .sp-megamenu-parent > li:hover > .sp-dropdown{visibility:visible;opacity:1}",
    "#sp-menu .sp-dropdown-inner{background:#fff;box-shadow:0 3px 10px rgba(0,0,0,.15);padding:10px 0;border-radius:3px}",
    "#sp-menu .sp-dropdown-items{list-style:none;margin:0;padding:0}",
    "#sp-menu .sp-dropdown-items > li > a{display:block;padding:8px 20px;font-size:13px;line-height:1.4;white-space:normal;color:#333}",
    "#sp-menu .sp-dropdown-items > li > a:hover{background:#f5f5f5}",
    "@media(max-width:991px){#sp-menu .sp-megamenu-parent{display:none}}",
    "@media(min-width:992px){#sp-menu #offcanvas-toggler{display:none}}"
  ].join("");

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function currentPath() {
    var p = window.location.pathname;
    if (p === "" || p === "/" || /\/index\.html$/.test(p)) return "/";
    return p;
  }

  function buildMenu() {
    var cur = currentPath(), out = ['<ul class="sp-megamenu-parent menu-slide-down">'];
    MENU.forEach(function (item) {
      var label = item[0], href = item[1], kids = item[2];
      var active = href === cur || kids.some(function (k) { return k[1] === cur; });
      var cls = "sp-menu-item" + (active ? " current-item active" : "") + (kids.length ? " sp-has-child" : "");
      out.push('<li class="' + cls + '"><a href="' + href + '">' + esc(label) + "</a>");
      if (kids.length) {
        out.push('<div class="sp-dropdown sp-dropdown-main sp-menu-right" style="width:280px"><div class="sp-dropdown-inner"><ul class="sp-dropdown-items">');
        kids.forEach(function (k) {
          out.push('<li class="sp-menu-item' + (k[1] === cur ? " current-item active" : "") +
                   '"><a href="' + k[1] + '">' + esc(k[0]) + "</a></li>");
        });
        out.push("</ul></div></div>");
      }
      out.push("</li>");
    });
    out.push("</ul>");
    return out.join("");
  }

  function restoreMenu() {
    var holder = document.querySelector("#sp-menu .sp-column");
    if (!holder || holder.querySelector(".sp-megamenu-parent")) return;
    var style = document.createElement("style");
    style.id = "restored-menu-css";
    style.textContent = CSS;
    document.head.appendChild(style);
    holder.insertAdjacentHTML("afterbegin", buildMenu());
  }

  function fixBackgrounds() {
    var nodes = document.querySelectorAll('[style*="url(//images/"]');
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].setAttribute("style",
        nodes[i].getAttribute("style").split("url(//images/").join("url(/images/"));
    }
  }

  function run() { restoreMenu(); fixBackgrounds(); }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
