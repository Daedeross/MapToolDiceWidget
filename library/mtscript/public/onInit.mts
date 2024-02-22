[h: defineFunction("data.exists", "dataExists@this", true)]

[h: exists = data.exists("daedeross.roll", "data/global-settings.json")]
[h, if(!exists), code: {
    [h: global = data.getStaticData("daedeross.roll", "public/data/default-global-settings.json")]

    [h: data.setData("addon:", "daedeross.roll", "data/global-settings.json", global)]
}]

[h: fileName = strformat("data/%s/user-settings.json", player.getName())]
[h, if(!data.exists("daedeross.roll", fileName)), code: {
    [h: user = data.getStaticData("daedeross.roll", "public/data/default-user-settings.json")]
    [h: data.setData("addon:", "daedeross.roll", fileName, user)]
}]

[h, macro("showRollOverlay@this"): ""]
