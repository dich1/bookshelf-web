#!/bin/sh
echo "===== local-setup start ======"
cd ~/.ssh
ssh-add -l
ssh-add
ssh-add -K bookshelf-web.pem
scp -oStrictHostKeyChecking=no -i "bookshelf-web.pem" ~/PJ/bookshelf-web/setup/ec2-setup.sh ec2-user@ec2-54-64-252-121.ap-northeast-1.compute.amazonaws.com:/home/ec2-user
ssh -A ec2-user@ec2-54-64-252-121.ap-northeast-1.compute.amazonaws.com "chmod +x ec2-setup.sh;./ec2-setup.sh"
echo "===== local-setup finish ====="