[h: macroArgs = trim(decode(replace(macro.args, "cachelib=false ;", "")))]
[h: name = json.get(macroArgs, "name")]
[h, switch(name):
    case "dnd" : settings = data.getStaticData("daedeross.roll", "public/data/default-settings.json");
    case "sr5" : settings = data.getStaticData("daedeross.roll", "public/data/sr5-settings.json");
    default: settings = data.getData("addon:", "daedeross.roll", "currentSettings")
]

[h: data.setData("addon:", "daedeross.roll", "currentSettings", settings)]
[h, macro("pushSettings@this"):""]