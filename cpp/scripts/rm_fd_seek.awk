BEGIN {
    fd_write[i]
    skip = 0
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
    if (match($0, /call 2$/)) {
        delete_it(8)
        skip = 13
    } else {
        while (skip > 0) {
            skip--
            next
        }
        fd_seek[NR] = $0
        position = NR
    }
}
END {
    print_it()
}