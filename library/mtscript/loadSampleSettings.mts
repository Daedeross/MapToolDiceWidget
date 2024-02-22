[h: macroArgs = trim(decode(replace(macro.args, "cachelib=false ;", "")))]
[h: assert(isGM(),"This macro is for GM use only.",0)]
[h: name = json.get(macroArgs, "name")]
[h, switch(name):
    case "dnd" : settings = data.getStaticData("daedeross.roll", "public/data/default-global-settings.json");
    case "sr5" : settings = data.getStaticData("daedeross.roll", "public/data/sr5-settings.json");
    default: settings = data.getData("addon:", "daedeross.roll", "data/global-settings.json")
]

[h: data.setData("addon:", "daedeross.roll", "data/global-settings.json", settings)]
[h, macro("pushSettings@this"):""]