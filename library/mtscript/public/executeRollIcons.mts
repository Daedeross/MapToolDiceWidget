[h: macroArgs = trim(decode(replace(macro.args, "cachelib=false ;", "")))]
[h: dice = json.get(macroArgs, "dice")]
[h: modifier = json.get(macroArgs, "modifier")]
[h: advantage = json.get(macroArgs, "advantage")]
[h: sHighIsGood = json.get(macroArgs, "highIsGood")]
[h: highIsGood = if(sHighIsGood == "true", true, false)]

[h: img = "<img src='%s' height=30 width=30 />"]

[h: times = abs(advantage) + 1]
[h: takeHighest = if(advantage > 0, highIsGood, !highIsGood)]
[h: expression = ""]
[h: showExpression = ""]
[h, foreach(die, dice, ""), code: {
    [h: count = json.get(die, "count")]
    [h: sides = json.get(die, "sides")]
    [h, if(count != 0), code: {
        [h: expression = expression + strformat("%+dd%d", count, sides)]
    }]
    [h, for(i, 0, count), code: {
        [h: icon = strformat("<img src='%s' height=24 width=24 />", json.get(die, "icon"))]
        [h: sign = if(count > 0, '+', '-')]
        [h: showExpression = showExpression + strformat("%s%s", sign, icon)]
    }]
}]
[h: showExpression = replace(showExpression, "^\\+", "")]
[h: expression = replace(expression, "^\\+", "")]
[h, if(modifier != 0): expression = expression + strformat("%+d", modifier)]
[h, if(modifier != 0): showExpression = showExpression + strformat("%+d", modifier)]
[h: results = "[]"]
[h: resultTexts = "[]"]
[h: bestIndex = -1]
[h: bestText = ""]
[h: best = if(takeHighest, -2147483647, 2147483647)]
[h, for(i, 0, times, 1, ""), code: {
    [h: resultText = evalMacro(strformat("[%{expression}]"))]
    [h: result = extractResult(resultText)]
    [h: results = json.append(results, result)]
    [h: resultTexts = json.append(resultTexts, resultText)]
    [h, if((takeHighest && result > best) || (!takeHighest && result < best)), code : {
        [h: best = result]
        [h: bestText = resultText]
        [h: bestIndex = i]
    }]
}]

[h, if(advantage != 0), code: {
    [h, if(advantage > 0):
        advText = if(advantage == 1, " <i>with Advantage</i>", strformat(" <i>with Advantage×%{advantage}</i>"));
        advText = if(advantage == -1, " <i>with Disadvantage</i>", strformat(" <i>with Disadvantage×%d</i>", abs(advantage)))
    ]
}; {
    [h: advText = ""]
}]
[h: allResultsText = ""]
[h, for(i, 0, times, 1, ""), code: {
	[h, if(i == bestIndex): text = strformat("<b>%s</b>", json.get(resultTexts, i)) ; text = strformat("<strike>%s</strike>", json.get(resultTexts, i))]
	[h: allResultsText = allResultsText + " " + text]
}]

[r: strformat("Rolls <b>%{showExpression}</b>%{advText} and gets: %{allResultsText}")]
[g, r: strformat("<br>('%{expression}' -> %{best}) [%{results}]"))]
