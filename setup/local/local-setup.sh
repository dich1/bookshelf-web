#!/bin/sh
echo "===== local-setup start ======"
cd ~/.ssh
ssh-add -l
ssh-add
ssh-add -K bookshelf-web.pem
scp -oStrictHostKeyChecking=no -i "bookshelf-web.pem" ~/PJ/bookshelf-web/setup/server/ec2-setup.sh ec2-user@ec2-52-192-137-28.ap-northeast-1.compute.amazonaws.com:/home/ec2-user
ssh -oStrictHostKeyChecking=no -A ec2-user@ec2-52-192-137-28.ap-northeast-1.compute.amazonaws.com "chmod +x ec2-setup.sh;./ec2-setup.sh"
echo "===== local-setup finish ====="