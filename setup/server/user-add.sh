#!/bin/sh
echo "===== user-add start ======"
read worker
sudo adduser worker
sudo sed -ie '/deploy/a worker  ALL=NOPASSWD:   ALL' /etc/sudoers

sudo su - worker <<EOF
mkdir -m 700 .ssh
cd .ssh
ssh-keygen -t rsa -f id_rsa_worker
mv id_rsa_worker.pub authorized_keys
chmod 600 authorized_keys
EOF
echo "===== user-add finish ====="