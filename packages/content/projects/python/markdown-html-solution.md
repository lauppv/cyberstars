```python
FENCE = '`' * 3  # three backticks

def escape(text):
    return text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def pairs(text, mark, tag):
    out = ''
    while True:
        start = text.find(mark)
        if start < 0:
            return out + text
        end = text.find(mark, start + len(mark))
        if end < 0:
            return out + text
        out += text[:start] + f'<{tag}>' + text[start + len(mark):end] + f'</{tag}>'
        text = text[end + len(mark):]


def links(text):
    out = ''
    while True:
        start = text.find('[')
        middle = text.find('](', start)
        end = text.find(')', middle)
        if start < 0 or middle < 0 or end < 0:
            return out + text
        label = text[start + 1:middle]
        url = text[middle + 2:end]
        out += text[:start] + f'<a href="{url}">{label}</a>'
        text = text[end + 1:]


def inline(text):
    text = escape(text)
    text = links(text)
    text = pairs(text, '**', 'strong')
    return pairs(text, '*', 'em')


lines = []
while True:
    try:
        lines.append(input())
    except EOFError:
        break

html = []
paragraph = []
list_tag = None


def close():
    global list_tag
    if paragraph:
        html.append('<p>' + inline(' '.join(paragraph)) + '</p>')
        paragraph.clear()
    if list_tag:
        html.append(f'</{list_tag}>')
        list_tag = None


in_code = False
for line in lines:
    if in_code:
        if line.strip() == FENCE:
            html.append('</code></pre>')
            in_code = False
        else:
            html.append(escape(line))
        continue
    stripped = line.strip()
    if stripped == FENCE:
        close()
        html.append('<pre><code>')
        in_code = True
    elif stripped == '':
        close()
    elif stripped.startswith('#'):
        level = len(stripped) - len(stripped.lstrip('#'))
        if 1 <= level <= 3 and stripped[level:level + 1] == ' ':
            close()
            html.append(f'<h{level}>' + inline(stripped[level + 1:].strip()) + f'</h{level}>')
        else:
            if list_tag:
                close()
            paragraph.append(stripped)
    elif stripped.startswith('- ') or (stripped.split('. ', 1)[0].isdigit() and '. ' in stripped):
        tag = 'ul' if stripped.startswith('- ') else 'ol'
        item = stripped[2:] if tag == 'ul' else stripped.split('. ', 1)[1]
        if paragraph or (list_tag and list_tag != tag):
            close()
        if not list_tag:
            html.append(f'<{tag}>')
            list_tag = tag
        html.append('  <li>' + inline(item) + '</li>')
    else:
        if list_tag:
            close()
        paragraph.append(stripped)
close()
if in_code:
    html.append('</code></pre>')
print('\n'.join(html))
```
