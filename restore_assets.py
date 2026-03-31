import os

replacements = {
    '/alerty-icon.png': '/logo.png',
    'alerty-icon.png': 'logo.png',
    '/alerty-favicon.ico': '/favicon.ico',
    'alerty-favicon.ico': 'favicon.ico'
}

files_to_check = [
    'src/components/layout/Navbar.js',
    'src/components/layout/Footer.js',
    'src/components/seo/JsonLd.jsx',
    'src/lib/seo/metadata.js',
    'src/app/layout.js',
    'public/manifest.json',
    'src/app/sitemap.js'
]

for fpath in files_to_check:
    if os.path.exists(fpath):
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        for k, v in replacements.items():
            content = content.replace(k, v)
            
        if original != content:
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Reverted references in {fpath}")

if os.path.exists('public/alerty-icon.png'):
    os.rename('public/alerty-icon.png', 'public/logo.png')
    print("Renamed back to public/logo.png")

if os.path.exists('public/alerty-favicon.ico'):
    os.rename('public/alerty-favicon.ico', 'public/favicon.ico')
    print("Renamed back to public/favicon.ico")

try:
    from PIL import Image
    if os.path.exists('public/logo.png'):
        img = Image.open('public/logo.png')
        img.save('public/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
        print("Successfully generated brand new favicon.ico from logo.png using Pillow!")
except Exception as e:
    print(f"Favicon gen failed: {e}")
