#
#   DIST.sh
#
#   David Janes
#   Consensas
#   2021-01-12
#

PACKAGE=jsonxt
DIST_ROOT=/var/tmp/.dist.$$

if [ ! -d "$DIST_ROOT" ]
then
    mkdir "$DIST_ROOT"
fi

echo "=================="
echo "NPM Packge: $PACKAGE"
echo "=================="
(
    NPM_DST="$DIST_ROOT/$PACKAGE"
    echo "NPM_DST=$NPM_DST"

    if [ -d ${NPM_DST} ]
    then
        rm -rf "${NPM_DST}"
    fi
    mkdir "${NPM_DST}" || exit 1

    update-package --increment-version --package "$PACKAGE" || exit 1

    tar cf - \
        --exclude "node_modules" \
        --exclude "xx*" \
        --exclude "yy*" \
        package.json \
        index.js \
        lib/*.js \
        lib/resolvers/*.js \
        lib/coders/*.js \
        |
    ( 
        cp ../README.md ../LICENSE "${NPM_DST}" || exit 1
        cd "${NPM_DST}" || exit 1
        tar xvf - || exit 
        npm publish || exit 1
    ) || exit 1
    git commit -m "new release" package.json || exit 1
    git push || exit 1

    echo "end"
)
