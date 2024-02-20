[h: macroArgs = trim(decode(replace(macro.args, "cachelib=false ;", "")))]
[h: dice = json.get(macroArgs, "dice")]
[h: modifier = json.get(macroArgs, "modifier")]
[h: advantage = json.get(macroArgs, "advantage")]
[h: sHighIsGood = json.get(macroArgs, "highIsGood")]
[h: highIsGood = if(sHighIsGood == "true", true, false)]

[h: times = abs(advantage) + 1)]
[h: takeHighest = if(advantage > 0, highIsGood, !highIsGood)]
[h: expression = ""]
[h, foreach(die, dice, ""), code: {
    [h: count = json.get(die, "count")]
    [h, if(count != 0), code: {
        [h: sides = json.get(die, "sides")]
        [h: expression = expression + strformat("%+dd%d", count, sides)]
    }]
}]
[h: expression = replace(expression, "^\\+", "")]
[h, if(modifier != 0): expression = expression + strformat("%+d", modifier)]
[h: results = "[]"]
[h: bestIndex = -1]
[h: best = if(takeHighest, -2147483647, 2147483647)]
[h, for(i, 0, times, 1, ""), code: {
    [h: result = eval(expression)]
    [h: assert(isNumber(result), "invalid dice expression")]
    [h: results = json.append(results, result)]
    [h, if((takeHighest && result > best) || (!takeHighest && result < best)), code : {
        [h: best = result]
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

[r: strformat("Rolls <b>%{expression}</b>%{advText} and gets: <b title='%{expression}'>%{best}</b>")]
[g, r: strformat("<br>('%{expression}' -> %{best}) [%{results}]"))]
