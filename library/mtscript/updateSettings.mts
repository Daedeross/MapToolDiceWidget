[h: macroArgs = trim(decode(replace(macro.args, "cachelib=false ;", "")))]
[h: data.setData("addon:", "daedeross.roll", "data/current-settings.json", macroArgs)]