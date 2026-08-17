SYSTEM 


// 
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/shadowzax/api-sys.git

DATA_BACKUP="/tmp/xsysx-data-backup"

rm -rf "$DATA_BACKUP"

if [ -d "data" ]; then
    cp -a data "$DATA_BACKUP"
fi

git fetch origin
git reset --hard origin/main
git clean -fd

if [ -d "$DATA_BACKUP" ]; then
    rm -rf data
    cp -a "$DATA_BACKUP" data
fi

npm install
pm2 restart all
