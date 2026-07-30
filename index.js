/* Cookie functions */

function setCookie(name, value, exp_days) {
  var d = new Date();
  d.setTime(d.getTime() + exp_days * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toGMTString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
  var cname = name + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(cname) == 0) {
      return c.substring(cname.length, c.length);
    }
  }
  return "";
}

function deleteCookie(name) {
  document.cookie = `${name}=; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Path=/`;

  window.localStorage.removeItem(name);
}

/* Engine selection */

const englist = [
  "DuckDuckGo", // default
  "Bing",
  "Brave",
  "Ecosia",
  "Google",
  "Karma",
  "Qwant",
  "Reddit",
  "Wikipedia",
  "Yahoo",
  "YouTube",
  "Custom",
];
const queryurl = [
  "https://duckduckgo.com/?q=",
  "https://www.bing.com/search?q=",
  "https://search.brave.com/search?q=",
  "https://www.ecosia.org/search?q=",
  "https://www.google.com/search?q=",
  "https://karmasearch.org/search?q=",
  "https://www.qwant.com/?q=",
  "https://www.reddit.com/search/?q=",
  "https://en.wikipedia.org/w/index.php?search=",
  "https://search.yahoo.com/search?p=",
  "https://www.youtube.com/results?search_query=",
  "",
];

function setSearchEngine(search) {
  if (englist.includes(search)) {
    setCookie("engine", search, 400);
    if (search == "Custom") {
      setCookie(
        "custom_url",
        document.getElementById("custom_url").value,
        400,
      );
      setCookie(
        "custom_placeholder",
        document.getElementById("custom_placeholder").value,
        400,
      );
    }
    return true;
  }
  return false;
}

const textarea1 = document.getElementById("custom_url");
const textarea2 = document.getElementById("custom_placeholder");

function setSelectDefault() {
  document.getElementById("settings_engine").value = getCookie("engine");
}

function getSearchEngine(init) {
  let engine = getCookie("engine");

  let baseurl = null;

  if (engine == "Custom") {
    baseurl = getCookie("custom_url");
    console.log("Custom search engine URL: " + baseurl);
    document.getElementById("custom_url").value = baseurl;
  } else {
    for (let k = 0; k < englist.length; k++) {
      if (engine == englist[k]) {
        baseurl = queryurl[k];
      }
    }
    if (!baseurl) {
      console.log("Invalid default search engine (got " + engine + ")");
      engine = englist[0]; // default to DuckDuckGo
    }
  }

  if (init) {
    setSearchEngine(engine);
    setPlaceholder(engine);
    setSelectDefault();
  }

  return baseurl;
}

function getQuickLinks() {
  let ql = document.querySelectorAll(".checkboxes_td input");
  for (let i = 0; i < ql.length; i++) {
    // get the name of all the possible quick links
    let style = !(getCookie(ql[i].id) == "false"); // set style to true if the cookie does not exist or is true
    let icon_class = document.getElementsByClassName(ql[i].id)[0];
    if (style) {
      icon_class.setAttribute(
        "style",
        "visibility: visible; display: inline-block",
      );
    } else {
      icon_class.setAttribute("style", "visibility: hidden; display: none");
    }
    document.getElementById(ql[i].id).checked = style;
  }
}

function onLoadWindow() {
  getSearchEngine(true);
  getQuickLinks();
  if (getCookie("engine") == "Custom") {
    textarea1.disabled = false;
    textarea2.disabled = false;
  }
}

function getTLD(url) {
  url = url.replace(/^(https?:\/\/|ftp:\/\/)/, "");
  let domain = url.split("/")[0];
  let parts = domain.split(".");
  return parts.length > 1 ? parts[parts.length - 1] : null;
}

const schemeRegex = /^(?:ftp|https?):\/\//i;

function isValidURL(url) {
    const urlRegex =
        /\b(?:https?|ftp):\/\/[^\s]+|\bwww\.[^\s]+|\b(?!\d+\.\d+$)(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^\s]*)?\b/;

    const rejectRegex = /\.[^a-zA-Z]{2,}$/;
    const tldRegex = /[^a-zA-Z]/;
    const ipRegex = /^([0-9]{1,3}\.){3}[0-9]{1,3}(?::\d{1,5})?$/;

    const tld = getTLD(url);
    const isIP = ipRegex.test(url);

    return (
        ((urlRegex.test(url) && !rejectRegex.test(url)) || isIP) &&
        !/\s/.test(url) &&
        ((!tldRegex.test(tld) &&
            tld.length >= 2 &&
            tld.length <= 63 &&
            !isIP) ||
            isIP)
    );
}

function searchWeb(event) {
    if (event.key !== "Enter") return;

    const textfield = document.getElementById("searchbar").value.trim();
    if (!textfield) return;

    let url;

    if (isValidURL(textfield)) {
        url = textfield;

        if (!schemeRegex.test(url)) {
            url = "http://" + url;
        }
    } else {
        url = getSearchEngine(false) + encodeURIComponent(textfield);
    }

    window.location.href = url;
}


function choose(val) {
  if (val) return "block";
  else return "none";
}

function showSettings() {
  if (typeof showSettings.openc == "undefined") showSettings.openc = 0;
  showSettings.openc++;

  showSettings.openc %= 2;

  let showMenu = `
        visibility: visible;
        transition: all 0.3s ease;
        transform: translateX(0px);

    `;
  let hideMenu = `
        visibility: hidden;
        transition: all 0.3s ease;
        transform: translateX(-100%);
    `;
  
  let settings_height = document.documentElement.getBoundingClientRect().height;
  document.querySelector(".settings_menu").style.cssText =
    "min-height: " + settings_height + "px";

  const settings = document.querySelector(".settings_menu");

  showSettings.openc
    ? (settings.style.cssText = showMenu)
    : (settings.style.cssText = hideMenu);

  document
    .getElementById("settings_open")
    .setAttribute("style", "display: " + choose(showSettings.openc));
  document
    .getElementById("settings")
    .setAttribute("style", "display: " + choose(!showSettings.openc));

  if (showSettings.openc == 1)
    // so the status message slides back in and disappears
    setStatus("");
}

function setPlaceholder(eng) {
  if(eng == "Custom") {
    eng = getCookie("custom_placeholder");
  }
  let searchbar = document.getElementById("searchbar");
  searchbar.placeholder = "Search with " + eng;
  searchbar.value = ""; // clear the search bar
}

function applyCheckbox() {
  let a = document.querySelectorAll(".checkboxes_td input");
  for (let i = 0; i < a.length; i++) {
    // loop over the elements
    let style = a[i].checked;
    setCookie(a[i].id, style, 400); // save the state of the checkbox
  }
  getQuickLinks();
}

function setStatus(text) {
  document.getElementById("status").innerHTML = text;
}

function applySettings() {
  let engine = document.getElementById("settings_engine").value;
  if (setSearchEngine(engine)) setStatus("Settings applied successfully");

  applyCheckbox();
  if (getCookie("engine") == "Custom") {
    setPlaceholder(document.getElementById("custom_placeholder").value);
  } else {
    setPlaceholder(engine);
  }
  setSelectDefault();
}

function resetSettings() {
  let engine = englist[0]; // reset to DuckDuckGo
  setCookie("engine", engine, 400);
  let ql = document.querySelectorAll(".checkboxes_td input");
  for (let i = 0; i < ql.length; i++) {
    // reset the quick links to default
    setCookie(ql[i].id, "true", 400);
  }
  getQuickLinks();
  setPlaceholder(engine);
  setSelectDefault();
  deleteCookie("custom_url");
  deleteCookie("custom_placeholder");
  textarea1.value = "";
  textarea1.disabled = true;
  textarea2.value = "";
  textarea2.disabled = true;

  setStatus("Settings reset to default");
}

window.addEventListener("load", onLoadWindow, false);

textarea1.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault(); // do not allow newlines in the URL textarea1, ignore enter key
  }
});

textarea1.addEventListener("input", () => {
  textarea1.value = textarea1.value.replace(/[\r\n]+/g, " "); // we replace newlines with spaces
});

textarea2.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault(); // do not allow newlines in the placeholder textarea2, ignore enter key
  }
});

textarea2.addEventListener("input", () => {
  textarea2.value = textarea2.value.replace(/[\r\n]+/g, " "); // we replace newlines with spaces
});

document.getElementById("settings_engine").onchange = function () {
  if (document.getElementById("settings_engine").value === "Custom") {
    textarea1.disabled = false;
    textarea2.disabled = false;
  } else {
    textarea1.disabled = true;
    textarea2.disabled = true;
  }
};

document.addEventListener("keydown", (e) => {
  const isCmdOrCtrl = e.ctrlKey || e.metaKey;
  if (isCmdOrCtrl && e.key.toLowerCase() === "k") {  // Ctrl-K to focus the search bar
    e.preventDefault();
    
    const searchbar = document.getElementById("searchbar");
    if (searchbar) {
      searchbar.focus();
      searchbar.select(); // selects previous text so the user can overwrite it easily
    }
  }
  if (isCmdOrCtrl && (e.key === "." || e.key === ",") ) {  // Both Ctrl-. or Ctrl-, to toggle settings menu!
    e.preventDefault();
    showSettings(); // Triggers your existing toggle function
  }
  if(showSettings.openc == 1 && e.key === "Escape") {
    e.preventDefault();
    showSettings(); // Close settings menu on Escape key
  }
});

