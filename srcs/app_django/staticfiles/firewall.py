from django.template import Context, Template

def generate_iptables(filename, ips):
    """
        Generate iptables files from templates.
    """
    f = open('templates/%s' % filename)
    f = ''.join([line for line in f])
    t = Template(f)
    c = Context({ 'servers': ips })
    rendered = t.render(c)

    out = open('rendered/%s' % filename, 'w')
    out.write(rendered)
