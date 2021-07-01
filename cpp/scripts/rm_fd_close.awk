# removal of fd_close from wat file
{
    fd_close[0]
    if (match($0, /call 0$/)) {
        fd_close[0] = 0
        next
    }
    if (fd_close[0]) {
        print fd_close[0]
        fd_close[0] = 0
    }

    if (match($0, /i32.load offset=56/)) {
        fd_close[0] = $0
        next
    }
    print $0
}

#  awk -f fd_removal.awk get_public_key.wat > kek.wat