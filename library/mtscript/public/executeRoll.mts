[h: macroArgs = trim(decode(replace(macro.args, "cachelib=false ;", "")))]
[h: dice = json.get(macroArgs, "dice")]
[h: modifier = json.get(macroArgs, "modifier")]
[h: advantage = json.get(macroArgs, "advantage")]
[h: highIsGood = json.get(macroArgs, "highIsGood")]

[h: times = abs(advantage) + 1)]
[h: takeHighest = if(advantage > 0, highIsGood, !highIsGood)]
[h: expression = ""]
[h, foreach(die, dice, ""), code: {
    [h: count = json.get(die, "count")]
    [h, if(count != 0), code: {
        [h: sides = json.get(die, "sides")]
        [h: expression = expression + strformat("%+d%d", count, sides)]
    }]
}]
[h, if(modifier != 0): expression = expression + strformat("%+d", modifier)]
[h: results = "[]"]
[h: bestIndex = -1]
[h: best = if(takeHighest, -2147483647, 2147483647)]
[h, for(i, 0, times, 1, ""), code: {
    [h: result = eval(expression)]
    [h: assert(isNumber(result), "invalid dice expression")]
    [h: results = json.append(results, result)]
    [h, if((takeHighest && result > best) || (!takeHighest && result < best), code : {
        [h: best = result]
        [h: bestIndex = i]
    }]
}]

[r: strformat("Rolls <b>%{expression}</b> and gets: <b title='%{expression}'>%{result}</b>")]
[g: strformat("('%{expression}' -> %{result}"))]
