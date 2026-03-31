import os

replacements = {
    '/logo.png': '/alerty-icon.png',
    'logo.png': 'alerty-icon.png',
    '/favicon.ico': '/alerty-favicon.ico',
    'favicon.ico': 'alerty-favicon.ico'
}

# Ensure we don't double replace if we run this twice
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
            print(f"Updated references in {fpath}")

# Rename the actual files
if os.path.exists('public/logo.png'):
    os.rename('public/logo.png', 'public/alerty-icon.png')
    print("Renamed public/logo.png -> public/alerty-icon.png")

if os.path.exists('public/favicon.ico'):
    os.rename('public/favicon.ico', 'public/alerty-favicon.ico')
    print("Renamed public/favicon.ico -> public/alerty-favicon.ico")
