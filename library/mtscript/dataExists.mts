[h: namespace = arg(0)]
[h: fileName = arg(1)]
[h: allData = data.listData("addon:", namespace)]
[h, foreach(datum, allData), code: {
    [h, if(json.get(datum, "name") == fileName): return(0, true)]
}]
[h: return(0, false)]