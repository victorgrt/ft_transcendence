
@roles('all')
def ship_iptables():
    put('iptables.up.rules', '~/')
    sudo('mv /etc/iptables.up.rules /etc/iptables.up.rules.bak.%s' % int(time.time()))
    sudo('mv ~/iptables.up.rules /etc/iptables.up.rules')
    sudo('iptables-restore < /etc/iptables.up.rules')
