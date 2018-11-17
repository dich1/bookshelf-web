#!/bin/sh
echo "===== ec2-setup start ======"
sudo chmod 700 /etc/sudoers
sudo sed -ie '93i deploy  ALL=NOPASSWD:   ALL' /etc/sudoers
sudo chmod 440 /etc/sudoers
sudo yum update -y
sudo adduser deploy

sudo su - deploy <<EOF
mkdir -m 700 .ssh
touch .ssh/authorized_keys
chmod 600 .ssh/authorized_keys

sudo yum install -y docker git
sudo usermod -a -G docker deploy
sudo service docker start
sudo chkconfig docker on
sudo mkdir -p /var/www
sudo chown deploy:deploy -R /var/www/

sudo curl -L https://github.com/docker/compose/releases/download/1.21.2/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

sudo docker volume create --name=db-data
sudo docker volume create --name=tmp-data
sudo docker volume create --name=public-data
EOF

sudo cp /home/ec2-user/.ssh/authorized_keys /home/deploy/.ssh/authorized_keys
echo "===== ec2-setup finish ====="