---
layout: post
permalink: wordpress-with-bedrock-and-digital-ocean
comments: true
title: "WordPress on Digital Ocean with Bedrock"
date: 2016-03-28 23:22:45
description: Talks about HTTP access control(CORS).
font-awesome: wordpress
categories:
- web
- wordpress
- digitalocean
- composer
- php
---

Years ago when I read a post "[Using Composer with WordPress](https://roots.io/using-composer-with-wordpress/)" I followed the instructions and wrote my own scripts to do installation for me. Today when I revisit the same topic I find the post is updated and now uses a slightly different approach. Instead of reinvient the wheel this time, I decide to give [roots/bedrock] a try.

Here are my steps:

1. Create a new Droplet on [DigitalOcean](https://www.digitalocean.com/)
  - Under "Select Image", choose "Applications -> LAMP on 14.04", or similar options if not available.
2. Install Dependencies
  {% highlight bash %}
  # install git
  apt-get update & apt-get install git
  # install composer
  curl -sS https://getcomposer.org/installer | php &> /dev/null
  mv composer.phar /usr/local/bin/composer
  {% endhighlight %}
3. Follow docs at [roots/bedrock] to install [WordPress] boilerplate
- Refer to "Installation" section for details
- After `mysql -u root -p`, using following command to create database and users for WordPress
  {% highlight sql %}
  CREATE DATABASE wordpress;
  CREATE USER wordpressuser@localhost IDENTIFIED BY 'password';
  GRANT ALL PRIVILEGES ON wordpress.* TO wordpressuser@localhost;
  FLUSH PRIVILEGES;
  {% endhighlight %}
4. Follow instructions at [How To Set Up Apache Virtual Hosts on Ubuntu 14.04 LTS](https://www.digitalocean.com/community/tutorials/how-to-set-up-apache-virtual-hosts-on-ubuntu-14-04-lts) to setup virtual host on Ubuntu 14.04.
5. (Optional) If you have permission issue to access your website after setting up virtual host, you can follow post [How To Configure Secure Updates and Installations in WordPress on Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-configure-secure-updates-and-installations-in-wordpress-on-ubuntu) to use my scripts from [WordPress-DigitalOcean](https://github.com/zhanghaowx/WordPress-DigitalOcean). Here is the minimum code you need:
  {% highlight bash %}
  ##### config WordPress ftp user account #####
  echo "=========="
  echo "Create a FTP user for WordPress"
  echo "https://www.digitalocean.com/community/tutorials/how-to-configure-secure-updates-and-installations-in-wordpress-on-ubuntu"
  echo "=========="

  export WP_USER=wp-user

  echo "Checking if user $WP_USER already exist ... "
  id -u $WP_USER &> /dev/null
  if [ $? == 0 ]; then
      echo "System already has a user called $WP_USER, skip creation"
  else
      if ! type "adduser" &> /dev/null; then
          echo "Could not find command adduser, please follow the above tutorials and create user for WordPress by yourself."
      else
          ## Add a New User for WordPress
          adduser $WP_USER
          chown -R $WP_USER:$WP_USER $(dirname $0)

          # skip if user is not successfully created
          id -u $WP_USER &> /dev/null
          if [ $? == 0 ]; then
              ## Create SSH Keys for WordPress
              echo "Creating SSH key for user $WP_USER"
              su -c "ssh-keygen -t rsa -b 4096 -f /home/$WP_USER/wp_rsa" $WP_USER

              chown $WP_USER:www-data /home/$WP_USER/wp_rsa*
              chmod 0640 /home/$WP_USER/wp_rsa*

              mkdir /home/$WP_USER/.ssh
              chown $WP_USER:$WP_USER /home/$WP_USER/.ssh/
              chmod 0700 /home/$WP_USER/.ssh/

              cp /home/$WP_USER/wp_rsa.pub /home/$WP_USER/.ssh/authorized_keys
              chown $WP_USER:$WP_USER /home/$WP_USER/.ssh/authorized_keys
              chmod 0644 /home/$WP_USER/.ssh/authorized_keys

              ## Restrict Key Usage to Local Machine
              echo -n 'from="127.0.0.1" ' | cat - /home/$WP_USER/.ssh/authorized_keys > temp && mv temp /home/$WP_USER/.ssh/authorized_keys
          fi
      fi
  fi
  {% endhighlight %}
6. Done! Go to [here](https://roots.io/bedrock/docs/installing-bedrock/) for bedrock docs.


[roots/bedrock]:https://github.com/roots/bedrock
[WordPress]:https://wordpress.org/
