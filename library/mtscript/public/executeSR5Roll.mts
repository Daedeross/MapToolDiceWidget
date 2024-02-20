[h: macroArgs = trim(decode(replace(macro.args, "cachelib=false ;", "")))]
[h: dice = json.get(macroArgs, "dice")]
[h: advantage = json.get(macroArgs, "advantage")]

[h: pool = 0]
[h, foreach(die, dice, ""), code: {
    [h: count = json.get(die, "count")]
    [h, if(count != 0), code: {
        [h: pool = pool + count)]
    }]
}]

[r, if(advantage == 0), code: {
    Rolls a pool of <b>{pool}</b> dice and gets [sr5(pool)]
};{
    Rolls a pool of <b>{pool}</b> dice (with Rule of 6) and gets [sr5e(pool)]
}]