[h: assert(argCount() == 1, "'extractResult' Invalid Arg Count")]
[h: id = strfind(arg(0), "(?:\\x1F|=)\\s*(-?\\d+)\\x1E")]
[h, if(getFindCount(id) == 0), code: {
    [h: macro.return = 0]
};{
    [h: result = number(getGroup(id, 1, 1))]
    [h: assert(isNumber(result), "invalid dice expression")]
    [h: macro.return = result]
}]
