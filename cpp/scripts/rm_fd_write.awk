BEGIN {
    fd_seek[i]
}
function print_it() {
    for (i=0; i <= position ; i++) {
        if (!match(fd_seek[i], /^$/)) print fd_seek[i]
    }
}
function delete_it(n) {
    while(n > 0) {
        delete fd_seek[NR - n]
        n--
    }
}
{
    if (match($0, /call 1$/)) {
        delete_it(12)
    } else {
        fd_seek[NR] = $0
        position = NR
    }
}
END {
    print_it()
}