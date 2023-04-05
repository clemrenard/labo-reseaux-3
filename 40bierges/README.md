# Projet Red/Blue Team

## En cas de rebuild
- Vérifier le .htaccess
- Il doit être comme suit :
    RewriteEngine On
    RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR]
    RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -d
    RewriteRule ^ - [L]
    RewriteRule ^ ./index.html
    
Procédure d'exécution:
1. lancez l'api 
2. ouvrez un second terminal et tapez la ligne de commande suivante: npx tailwindcss -i ./src/assets/css/main.css -o ./src/assets/css/site.css --watch
1. lancez 40bierges
   
