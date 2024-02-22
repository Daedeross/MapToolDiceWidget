[h: macroArgs = trim(decode(replace(macro.args, "cachelib=false ;", "")))]
[h: broadcast(macroArgs)]
[h: fileName = strformat("data/%s/user-settings.json", player.getName())]
[h: data.setData("addon:", "daedeross.roll", fileName, macroArgs)]