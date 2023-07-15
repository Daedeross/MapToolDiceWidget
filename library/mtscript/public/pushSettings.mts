[h: settings = data.getData("addon:", "daedeross.roll", "currentSettings")]
[h: runJsFunction("Roll Toolbar", "overlay", "updateSettings", "null", json.append("[]", settings) )]