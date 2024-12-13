# Spring development

## Usage

- ONLY for windows

    ```bash
    setx VAGRANT_HOME "/d/.vagrant.d/" # change the mox storage location
    ```

- Vagrant commands

    ```bash
    vagrant up # start the virtual machine    
    vagrant ssh # connect to the virtual machine    
    vagrant status # check the virtual machine's status    
    vagrant halt # showdown the virtual machine    
    vagrant suspend # suspend the virtual machine    
    vagrant destroy # destroy the virtual machine

    vagrant box list # list all the boxes
    ```

- Setup ssh by key

    ```bash
    cat /mnt/id_ed25519.pub >> ~/.ssh/authorized_keys
    ```

## Documents

- [Install VirtualBox](https://www.virtualbox.org/wiki/Downloads)
- [Install Vagrant](https://developer.hashicorp.com/vagrant/tutorials/getting-started/getting-started-install)
