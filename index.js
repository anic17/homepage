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


function setSearchEngine(search)
{
    if(search == "DuckDuckGo" || search == "Google" || search == "Ecosia" || search == "Yahoo") 
    {
        console.log(getCookie("engine"));
        setCookie("engine", search, 20000);
        return true;
    }
    return false;
}

function getSearchEngine()
{
    let engine = getCookie("engine");

    let baseurl = "https://duckduckgo.com/?q="
    if(engine == "Google")
    {
        baseurl = "https://www.google.com/search?q=";
    } else if(engine == "Ecosia")
    {
        baseurl = "https://www.ecosia.org/search?q=";
    } else if(engine == "Yahoo")
    {
        baseurl = "https://search.yahoo.com/search?p=";
    } else {
        if(engine != "DuckDuckGo")
        {
            console.log("Invalid default search engine (got " + engine + ")");
        }
        engine = "DuckDuckGo";
        setSearchEngine(engine);
    }
    setPlaceholder(engine);
    return baseurl;
}

const searchBox = document.getElementById('searchbar')

searchBox.addEventListener('keydown', (e) => {
  if (e.code == 'Enter') {
        var regex = new RegExp('^(http://|https://|www)');
        let textfield = document.getElementById('searchbar').value;
        let url;
        if(regex.test(textfield))
        {
            url = textfield;
        } else {
            url = getSearchEngine() + encodeURIComponent(textfield);
        }
        window.location = url;
  }
})

function lowerCase(event) {
    if(event == 13)
    {
        let baseurl = getSearchEngine();
        let textfield = document.getElementById('searchbar').value;
        let url = baseurl + encodeURIComponent(textfield);
        window.location.href = url;
    }
}

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
    setPlaceholder(getCookie("engine"));
}

window.onload = getSearchEngine();