---
title: Running BTC and Lightning on Raspberri PI
date: June 2025
description: Yes, this was a fun project
tags: [Featured, Bitcoin, Lightning, Raspberri Pi]
draft: false
---

This article documents the process of setting up a Bitcoin node and Lightning Network daemon on a Raspberry Pi from scratch. It covers the complete installation and configuration of btcd (a Bitcoin implementation in Go) and LND (Lightning Network Daemon), including system service setup and basic wallet operations.

If I were to start this project over today, I would strongly recommend using established solutions like [RaspiBlitz](https://docs.raspiblitz.org/) or [RaspiBolt](https://raspibolt.org/) to significantly speed up setup time and quickly add additional tools like BTCPayServer. These platforms provide automated scripts and comprehensive guides that handle much of the manual configuration described below, while also offering additional features and better security practices out of the box.

## Raspberri Pi Setup

1. Download imager from <https://www.raspberrypi.com/software/>
1. Run the imager per <https://www.raspberrypi.com/documentation/computers/getting-started.html#raspberry-pi-imager> to install the OS on your device (microSD is preferred)
   1. Make sure to enable wifi and username/password ssh so you can connect to the pi without a display
1. Connect to the pi: `ssh username@raspberrypi.local`
1. Update software: <https://www.raspberrypi.com/documentation/computers/os.html#update-software>
1. (optional) Connect a micro HDMI cable and bluetooth mouse/keyboard
   1. Connect a USB keyboard
   1. Use the command key to open the menu and navigate to the terminal app
   1. `sudo systemctl start bluetooth`
   1. `bluetoothctl`
   1. `agent on ; scan on`
   1. Put your mouse into pairing mode
      1. You'll see something like `[NEW] Device` followed by address
      1. `pair <address>`
      1. `trust <address>`
      1. `connect <address>`
   1. I had to run these a few times before the mouse started working.
   1. Now you can pair your bluetooth keyboard using the top right menu.
1. Update timezone: `sudo dpkg-reconfigure tzdata` , then pick your timezone from the menu. I'm in the central timezone, and had to choose Menominee (Wisconsin) for some reason.

## Install btcd

1. Download latest from https://github.com/btcsuite/btcd/releases

```sh
tar xvzf *.tar.gz`
sudo cp btcd /usr/local/bin/
```

2. Create ~/.btcd/btcd.conf

```sh
rpcuser=bitcoin
rpcpass=bitcoin
txindex=1
debuglevel=info
```

3. Create system service - /etc/systemd/system/btcd.service

```sh
[Unit]
Description=Bitcoin Go daemon
After=network.target

[Service]
User=drmaas
Group=drmaas
PIDFile=/home/drmaas/.btcd/btcd.pid
ExecStart=/usr/local/bin/btcd
KillMode=process
Restart=always
TimeoutStartSec=180

[Install]
WantedBy=multi-user.target
```

4. Start service

```sh
sudo systemctl start btcd
```

5. View logs

```sh
journalctl -u btcd.service -f
```

6. Stop service

```sh
sudo systemctl stop btcd.service
```

## Install LND

1. Download latest from https://github.com/lightningnetwork/lnd/releases

```sh
tar xvzf *.tar.gz
sudo cp lnd lncli /usr/local/bin/
```

2. Start LND

```sh
lnd --bitcoin.active --bitcoin.mainnet
```

3. Setup wallet. Remember the password.

```sh
lncli create
```

4. Stop LND

```sh
lncli stop
```

5. Create password file

```sh
echo my-password > ~/password.txt
```

6. Create ~/.lnd/lnd.conf

```sh
bitcoin.active=true
bitcoin.mainnet=true

bitcoin.node=btcd
btcd.rpcuser=bitcoin
btcd.rpcpass=bitcoin
btcd.rpccert=<btcd dir>/rpc.cert

rpcmiddleware.enable=true
db.bolt.auto-compact=true
alias=automator

debuglevel=info

# Contains password to unlock wallet
wallet-unlock-password-file=/home/user/password.txt
```

7. Create lnd system service file - /etc/systemd/system/lnd.service

```
[Unit]
Description=Lightning Network Daemon

# Make sure lnd starts after bitcoind is ready

Requires=btcd.service
After=btcd.service

[Service]
ExecStart=/usr/local/bin/lnd
ExecStop=/usr/local/bin/lncli stop

# Replace these with the user:group that will run lnd

User=drmaas
Group=drmaas

# Try restarting lnd if it stops due to a failure

Restart=on-failure
RestartSec=60

# Type=notify is required for lnd to notify systemd when it is ready

Type=notify

# An extended timeout period is needed to allow for database compaction

# and other time intensive operations during startup. We also extend the

# stop timeout to ensure graceful shutdowns of lnd.

TimeoutStartSec=1200
TimeoutStopSec=3600

# Hardening Measures

####################

# Mount /usr, /boot/ and /etc read-only for the process.

ProtectSystem=full

# Disallow the process and all of its children to gain

# new privileges through execve().

NoNewPrivileges=true

# Use a new /dev namespace only populated with API pseudo devices

# such as /dev/null, /dev/zero and /dev/random.

PrivateDevices=true

# Deny the creation of writable and executable memory mappings.

MemoryDenyWriteExecute=true

[Install]
WantedBy=multi-user.target
```

9. Start LND

```sh
sudo systemctl start lnd
journalctl -u lnd.service -f
```

10. Wait for btcd to catch up to the latest transactions

11. Created wallet with lncli

12. Add btc to wallet with lncli

13. Open an outbound channel (kraken example)

```sh
lncli openchannel \
  --node_key 02f1a8c87607f415c8f22c00593002775941dea48869ce23096af27b0cfdcc0b69 \
  --connect 52.13.118.208:9735 \
  --local_amt 100000 \
  --sat_per_vbyte 1 \
  --min_confs 3
```

NOTE: more secure way to store password: 
<https://docs.lightning.engineering/lightning-network-tools/lnd/wallet#more-secure-example-with-password-manager-and-using-a-named-pipe>
```
