#!/bin/bash

vars=$(compgen -A variable)
subst=$(printf '${%s} ' $vars)
nginx_path="/etc/nginx"

if [ ! -L /nginx ]; then ln -s ${nginx_path} /nginx; fi

# certs_path="${nginx_path}/certs"
# declare -A files=(["server.pem"]="${PROJECT_NAME}.cert" ["server.key"]="${PROJECT_NAME}.key" ["cacert.pem"]="${PROJECT_NAME}.ca")

# for file in "${!files[@]}"; do
#    new_file="${certs_path}/${files[$file]}"
#     if [ -f "${new_file}" ]; then
#        continue
#    fi
#    while [ ! -f "${certs_path}/${file}" ]; do sleep 1; done
#    mv "${certs_path}/${file}" "${new_file}"
# done

find ${nginx_path}/ -type f \( -name "*.template.nginx" -o -name "*.template.conf" \) | while read template; do
  conf_file=$(echo $template | sed -E 's/\.template\.(nginx|conf)$/.conf/')
  envsubst "$subst" <$template >$conf_file
done

nginx -t
echo "Starting Nginx..."
nginx

