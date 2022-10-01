/* Cookie functions */

function setCookie(name, value, exp_days) {
    var d = new Date();
    d.setTime(d.getTime() + (exp_days*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    var cname = name + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++){
        var c = ca[i];
        while(c.charAt(0) == ' '){
            c = c.substring(1);
        }
        if(c.indexOf(cname) == 0){
            return c.substring(cname.length, c.length);
        }
    }
    return "";
}

/* Engine selection */

const englist = [
    "DuckDuckGo", 
    "Google", 
    "Ecosia", 
    "Yahoo", 
    "Brave",
];
const searchurl = [
    "https://duckduckgo.com/?q=",
    "https://www.google.com/search?q=",
    "https://www.ecosia.org/search?q=",
    "https://search.yahoo.com/search?p=",
    "https://search.brave.com/search?q="
];

function setSearchEngine(search)
{
    for(let k = 0; k < englist.length; k++)
    {
        if(search == englist[k])
        {
            setCookie("engine", search, 20000);
            return true;
        }
    }
    return false;
}


function setSelectDefault()
{
    document.getElementById('settings_engine').value = getCookie("engine");

}

function getSearchEngine()
{
    let engine = getCookie("engine");
    
    let baseurl = null;
    for(let k = 0; k < englist.length; k++)
    {
        if(engine == englist[k])
        {
            baseurl = searchurl[k]; 
        }
    }
    if(!baseurl)
    {
        console.log("Invalid default search engine (got " + engine + ")");
        engine = "DuckDuckGo";
    }

    setSearchEngine(engine);
    setPlaceholder(engine);
    setSelectDefault();
    return baseurl;
}

const searchBox = document.getElementById('searchbar')

searchBox.addEventListener('keydown', (e) => {
    if (e.code == 'Enter')
    {
        let textfield = document.getElementById('searchbar').value;
        if(textfield)
        {
            var regex = new RegExp('^(http://|https://|www)');
            let url;
            if(regex.test(textfield))
            {
                url = textfield;
            } else {
                url = getSearchEngine() + encodeURIComponent(textfield);
            }
            window.location.href = url;
        }
     
  }
})

function choose(val)
{
    if(val)
    {
        return "block";
    } else {
        return "none";
    }
}

function showSettings()
{
    if (typeof showSettings.openc == 'undefined')
    {
        showSettings.openc = 0;
    }
    showSettings.openc++;

    showSettings.openc %= 2;

    document.getElementById("settings_menu").setAttribute("style", "display: " + choose(showSettings.openc)); 

    document.getElementById("settings_open").setAttribute("style", "display: " + choose(showSettings.openc));
    document.getElementById("settings").setAttribute("style", "display: " + choose(!showSettings.openc));

    // Hide "Settings applied"
    document.getElementById("settings_applied").setAttribute("style", "display: none"); 
}

function setPlaceholder(eng)
{
    let searchbar = document.getElementById("searchbar");
    searchbar.placeholder = 'Search with ' + eng;
}


function applySettings()
{
    let engine = document.getElementById("settings_engine").value;
    if(setSearchEngine(engine))
    {
      document.getElementById("settings_applied").setAttribute("style", "display: block");    
    }

    setPlaceholder(engine);
    setSelectDefault();
}

window.onload = getSearchEngine();